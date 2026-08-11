import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  Typography,
} from "@mui/material";

import AcUnitRoundedIcon from "@mui/icons-material/AcUnitRounded";
import DeviceThermostatRoundedIcon from "@mui/icons-material/DeviceThermostatRounded";
import AirRoundedIcon from "@mui/icons-material/AirRounded";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";

import {
  getClimateData,
  setClimatePower,
  setClimateTemperature,
  setClimateHvacMode,
  setClimateFanMode,
  setClimateSwingMode,
} from "../services/homeAssistantApi";

const HVAC_LABELS = {
  off: "Arrêt",
  cool: "Froid",
  dry: "Déshumidification",
  fan_only: "Ventilation",
  auto: "Auto",
  heat: "Chauffage",
};

const FAN_LABELS = {
  auto: "Auto",
  low: "Faible",
  medium: "Moyenne",
  high: "Forte",
  turbo: "Turbo",
};

const SWING_LABELS = {
  off: "Arrêt",
  both: "Vertical + horizontal",
  vertical: "Vertical",
  horizontal: "Horizontal",
};

function ClimatePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commanding, setCommanding] = useState(false);
  const [error, setError] = useState("");

  const device = useMemo(
    () => data?.devices?.[0] ?? null,
    [data]
  );

  async function loadClimate() {
    try {
      setError("");

      const nextData =
        await getClimateData();

      setData(nextData);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Impossible de récupérer la climatisation."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClimate();

    const timer = window.setInterval(
      loadClimate,
      10000
    );

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  async function runCommand(callback) {
    if (!device || commanding) {
      return;
    }

    try {
      setCommanding(true);
      setError("");

      const result =
        await callback();

      if (result?.device) {
        setData((current) => ({
          ...(current ?? {}),
          devices: [
            result.device,
          ],
          totalCount:
            current?.totalCount ?? 1,
          availableCount:
            result.device.available ? 1 : 0,
          activeCount:
            result.device.isOn ? 1 : 0,
        }));
      } else {
        await loadClimate();
      }
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Commande de climatisation impossible."
      );
    } finally {
      setCommanding(false);
    }
  }

  function changePower() {
    return runCommand(() =>
      setClimatePower(
        device.id,
        !device.isOn
      )
    );
  }

  function changeTemperature(delta) {
    if (
      !Number.isFinite(
        device.targetTemperature
      )
    ) {
      return;
    }

    const nextTemperature =
      device.targetTemperature + delta;

    const boundedTemperature =
      Math.min(
        device.maxTemperature ??
          nextTemperature,
        Math.max(
          device.minTemperature ??
            nextTemperature,
          nextTemperature
        )
      );

    return runCommand(() =>
      setClimateTemperature(
        device.id,
        boundedTemperature
      )
    );
  }

  function changeHvacMode(hvacMode) {
    return runCommand(() =>
      setClimateHvacMode(
        device.id,
        hvacMode
      )
    );
  }

  function changeFanMode(fanMode) {
    return runCommand(() =>
      setClimateFanMode(
        device.id,
        fanMode
      )
    );
  }

  function changeSwingMode(swingMode) {
    return runCommand(() =>
      setClimateSwingMode(
        device.id,
        swingMode
      )
    );
  }

  if (loading && !device) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          Chargement de la climatisation...
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: {
          xs: 2,
          md: 3,
        },
      }}
    >
      <Stack spacing={3}>
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
            >
              Climatisation
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
            >
              Pilotage du climatiseur Samsung du salon
            </Typography>
          </Box>

          {device && (
            <Chip
              icon={
                device.available ? (
                  <CheckCircleRoundedIcon />
                ) : (
                  <WarningAmberRoundedIcon />
                )
              }
              label={
                !device.available
                  ? "Indisponible"
                  : device.isOn
                  ? "En fonctionnement"
                  : "Arrêtée"
              }
              color={
                !device.available
                  ? "warning"
                  : device.isOn
                  ? "success"
                  : "default"
              }
              variant="outlined"
            />
          )}
        </Stack>

        {error && (
          <Alert
            severity="error"
            onClose={() =>
              setError("")
            }
          >
            {error}
          </Alert>
        )}

        {!device ? (
          <Alert severity="warning">
            Aucun climatiseur disponible.
          </Alert>
        ) : (
          <>
            <Grid
              container
              spacing={2}
            >
              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >
                <Card sx={{ height: "100%" }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack spacing={2}>
                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          display: "grid",
                          placeItems: "center",
                          borderRadius: 3,
                          bgcolor:
                            device.isOn
                              ? "primary.main"
                              : "action.hover",
                          color:
                            device.isOn
                              ? "primary.contrastText"
                              : "text.secondary",
                        }}
                      >
                        <AcUnitRoundedIcon />
                      </Box>

                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight={800}
                        >
                          {device.name}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {device.location} · {device.brand}
                        </Typography>
                      </Box>

                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography
                          variant="body1"
                          fontWeight={700}
                        >
                          Marche / arrêt
                        </Typography>

                        <Switch
                          checked={device.isOn}
                          disabled={
                            !device.available ||
                            commanding
                          }
                          onChange={changePower}
                        />
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >
                <Card sx={{ height: "100%" }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack spacing={2}>
                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          display: "grid",
                          placeItems: "center",
                          borderRadius: 3,
                          bgcolor: "secondary.main",
                          color: "white",
                        }}
                      >
                        <DeviceThermostatRoundedIcon />
                      </Box>

                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight={700}
                        >
                          Température ambiante
                        </Typography>

                        <Typography
                          variant="h3"
                          fontWeight={800}
                        >
                          {Number.isFinite(
                            device.currentTemperature
                          )
                            ? `${device.currentTemperature} °C`
                            : "--"}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >
                <Card sx={{ height: "100%" }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack spacing={2}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={700}
                      >
                        Température de consigne
                      </Typography>

                      <Typography
                        variant="h3"
                        fontWeight={800}
                      >
                        {Number.isFinite(
                          device.targetTemperature
                        )
                          ? `${device.targetTemperature} °C`
                          : "--"}
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={1}
                      >
                        <Button
                          variant="outlined"
                          fullWidth
                          startIcon={
                            <RemoveRoundedIcon />
                          }
                          disabled={
                            commanding ||
                            !device.available
                          }
                          onClick={() =>
                            changeTemperature(-1)
                          }
                        >
                          - 1 °C
                        </Button>

                        <Button
                          variant="contained"
                          fullWidth
                          startIcon={
                            <AddRoundedIcon />
                          }
                          disabled={
                            commanding ||
                            !device.available
                          }
                          onClick={() =>
                            changeTemperature(1)
                          }
                        >
                          + 1 °C
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Grid
              container
              spacing={2}
            >
              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >
                <Card sx={{ height: "100%" }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack spacing={2}>
                      <Typography
                        variant="h6"
                        fontWeight={800}
                      >
                        Mode
                      </Typography>

                      <FormControl fullWidth>
                        <InputLabel>
                          Mode
                        </InputLabel>

                        <Select
                          value={
                            device.state ?? "off"
                          }
                          label="Mode"
                          disabled={
                            commanding ||
                            !device.available
                          }
                          onChange={(event) =>
                            changeHvacMode(
                              event.target.value
                            )
                          }
                        >
                          {device.hvacModes.map(
                            (mode) => (
                              <MenuItem
                                key={mode}
                                value={mode}
                              >
                                {HVAC_LABELS[
                                  mode
                                ] ?? mode}
                              </MenuItem>
                            )
                          )}
                        </Select>
                      </FormControl>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >
                <Card sx={{ height: "100%" }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack spacing={2}>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                      >
                        <AirRoundedIcon />

                        <Typography
                          variant="h6"
                          fontWeight={800}
                        >
                          Ventilation
                        </Typography>
                      </Stack>

                      <FormControl fullWidth>
                        <InputLabel>
                          Vitesse
                        </InputLabel>

                        <Select
                          value={
                            device.fanMode ?? ""
                          }
                          label="Vitesse"
                          disabled={
                            commanding ||
                            !device.available
                          }
                          onChange={(event) =>
                            changeFanMode(
                              event.target.value
                            )
                          }
                        >
                          {device.fanModes.map(
                            (mode) => (
                              <MenuItem
                                key={mode}
                                value={mode}
                              >
                                {FAN_LABELS[
                                  mode
                                ] ?? mode}
                              </MenuItem>
                            )
                          )}
                        </Select>
                      </FormControl>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >
                <Card sx={{ height: "100%" }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack spacing={2}>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                      >
                        <SwapVertRoundedIcon />

                        <Typography
                          variant="h6"
                          fontWeight={800}
                        >
                          Oscillation
                        </Typography>
                      </Stack>

                      <FormControl fullWidth>
                        <InputLabel>
                          Direction
                        </InputLabel>

                        <Select
                          value={
                            device.swingMode ??
                            "off"
                          }
                          label="Direction"
                          disabled={
                            commanding ||
                            !device.available
                          }
                          onChange={(event) =>
                            changeSwingMode(
                              event.target.value
                            )
                          }
                        >
                          {device.swingModes.map(
                            (mode) => (
                              <MenuItem
                                key={mode}
                                value={mode}
                              >
                                {SWING_LABELS[
                                  mode
                                ] ?? mode}
                              </MenuItem>
                            )
                          )}
                        </Select>
                      </FormControl>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Alert severity="info">
              Les fonctions affichées ici ont été testées avec le climatiseur Samsung :
              marche/arrêt, consigne, mode, ventilation et oscillation.
              Les presets Samsung ne sont pas affichés pour le moment.
            </Alert>
          </>
        )}
      </Stack>
    </Box>
  );
}

export default ClimatePage;

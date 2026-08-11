import { useMemo, useState } from "react";

import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Switch,
  Typography,
} from "@mui/material";

import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
import PoolRoundedIcon from "@mui/icons-material/PoolRounded";
import PowerRoundedIcon from "@mui/icons-material/PowerRounded";
import ElectricMeterRoundedIcon from "@mui/icons-material/ElectricMeterRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import useHomeAssistant from "../hooks/useHomeAssistant";

import {
  setEnergyDeviceState,
} from "../services/homeAssistantApi";

function formatPower(watts) {
  if (!Number.isFinite(watts)) {
    return "--";
  }

  if (watts >= 1000) {
    return `${(watts / 1000).toFixed(2)} kW`;
  }

  return `${watts.toFixed(1)} W`;
}

function formatValue(metric, decimals = 1) {
  if (!metric?.available || !Number.isFinite(metric.value)) {
    return "--";
  }

  return `${metric.value.toFixed(decimals)} ${metric.unit ?? ""}`.trim();
}

function getDeviceIcon(device) {
  if (device.id?.includes("ecs")) {
    return <WaterDropRoundedIcon />;
  }

  if (device.id === "pompe-piscine") {
    return <PoolRoundedIcon />;
  }

  return <PowerRoundedIcon />;
}

function EnergyPage() {
  const {
    dashboard,
    refreshing,
    error,
    refreshDashboard,
  } = useHomeAssistant(10000);

  const [commandingDeviceId, setCommandingDeviceId] =
    useState(null);

  const [commandError, setCommandError] =
    useState("");

  const [optimisticStates, setOptimisticStates] =
    useState({});

  const energy =
    dashboard?.energy ?? null;

  const backendDevices =
    energy?.devices ?? [];

  const devices = useMemo(
    () =>
      backendDevices.map((device) => {
        if (
          Object.prototype.hasOwnProperty.call(
            optimisticStates,
            device.id
          )
        ) {
          return {
            ...device,
            switch: {
              ...(device.switch ?? {}),
              isOn: optimisticStates[device.id],
            },
          };
        }

        return device;
      }),
    [backendDevices, optimisticStates]
  );

  const totalDevices =
    energy?.totalDevices ?? 0;

  const activeDevices =
    devices.filter(
      (device) =>
        device.switch?.available &&
        device.switch?.isOn === true
    ).length;

  const unavailableDevices =
    energy?.unavailableDevices ?? 0;

  const totalPower =
    energy?.totalPowerWatts ?? 0;

  const totalEnergy =
    energy?.totalEnergyKwh ?? 0;

  const powerLimit = 6000;

  const powerPercentage =
    Math.min(
      (totalPower / powerLimit) * 100,
      100
    );

  const highConsumption =
    totalPower > 4500;

  async function handleToggle(device) {
    const switchAvailable =
      device.switch?.available === true;

    if (
      !switchAvailable ||
      commandingDeviceId ||
      refreshing
    ) {
      return;
    }

    const requestedState =
      !device.switch?.isOn;

    setCommandError("");
    setCommandingDeviceId(device.id);

    setOptimisticStates((current) => ({
      ...current,
      [device.id]: requestedState,
    }));

    try {
      await setEnergyDeviceState(
        device.id,
        requestedState
      );

      await new Promise((resolve) => {
        setTimeout(resolve, 1200);
      });

      await refreshDashboard();

      setOptimisticStates((current) => {
        const next = { ...current };
        delete next[device.id];
        return next;
      });
    } catch (commandFailure) {
      setOptimisticStates((current) => {
        const next = { ...current };
        delete next[device.id];
        return next;
      });

      setCommandError(
        commandFailure instanceof Error
          ? commandFailure.message
          : "Impossible de commander cet équipement."
      );
    } finally {
      setCommandingDeviceId(null);
    }
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
      <Stack spacing={2}>
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
          spacing={1.25}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
            >
              Énergie
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
            >
              Suivi et commande des équipements
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
          >
            <Chip
              icon={
                highConsumption ? (
                  <WarningAmberRoundedIcon />
                ) : (
                  <CheckCircleRoundedIcon />
                )
              }
              label={
                highConsumption
                  ? "Consommation élevée"
                  : "Consommation normale"
              }
              color={
                highConsumption
                  ? "warning"
                  : "success"
              }
              size="small"
              variant="outlined"
            />

            {unavailableDevices > 0 && (
              <Chip
                label={`${unavailableDevices} indisponible${
                  unavailableDevices > 1 ? "s" : ""
                }`}
                color="warning"
                size="small"
                variant="outlined"
              />
            )}
          </Stack>
        </Stack>

        {error && (
          <Alert severity="error">
            Impossible de récupérer les données énergie : {error}
          </Alert>
        )}

        {commandError && (
          <Alert
            severity="error"
            onClose={() =>
              setCommandError("")
            }
          >
            {commandError}
          </Alert>
        )}

        <Card>
          <CardContent
            sx={{
              p: 1.25,
              "&:last-child": {
                pb: 1.25,
              },
            }}
          >
            <Grid
              container
              spacing={0.75}
              alignItems="center"
            >
              <Grid size={{ xs: 4 }}>
                <Stack
                  alignItems="center"
                  spacing={0}
                >
                  <BoltRoundedIcon
                    sx={{
                      fontSize: 20,
                      color: highConsumption
                        ? "warning.main"
                        : "primary.main",
                    }}
                  />

                  <Typography
                    variant="subtitle1"
                    fontWeight={800}
                    noWrap
                  >
                    {formatPower(totalPower)}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Actuelle
                  </Typography>
                </Stack>
              </Grid>

              <Grid size={{ xs: 4 }}>
                <Stack
                  alignItems="center"
                  spacing={0}
                >
                  <ElectricMeterRoundedIcon
                    sx={{
                      fontSize: 20,
                      color: "secondary.main",
                    }}
                  />

                  <Typography
                    variant="subtitle1"
                    fontWeight={800}
                    noWrap
                  >
                    {Number.isFinite(totalEnergy)
                      ? `${totalEnergy.toFixed(2)} kWh`
                      : "--"}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Énergie
                  </Typography>
                </Stack>
              </Grid>

              <Grid size={{ xs: 4 }}>
                <Stack
                  alignItems="center"
                  spacing={0}
                >
                  <PowerRoundedIcon
                    sx={{
                      fontSize: 20,
                      color: "success.main",
                    }}
                  />

                  <Typography
                    variant="subtitle1"
                    fontWeight={800}
                    noWrap
                  >
                    {activeDevices} / {totalDevices}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Actifs
                  </Typography>
                </Stack>
              </Grid>
            </Grid>

            <LinearProgress
              variant="determinate"
              value={powerPercentage}
              color={
                highConsumption
                  ? "warning"
                  : "primary"
              }
              sx={{
                mt: 1,
                height: 5,
                borderRadius: 999,
              }}
            />
          </CardContent>
        </Card>

        <Box>
          <Typography
            variant="h5"
            fontWeight={800}
            sx={{ mb: 0.25 }}
          >
            Équipements
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            Mesures réelles et mise en / hors service
          </Typography>

          <Stack spacing={0.75}>
            {devices.map((device) => {
              const active =
                device.switch?.available &&
                device.switch?.isOn === true;

              const switchAvailable =
                device.switch?.available === true;

              const commanding =
                commandingDeviceId ===
                device.id;

              return (
                <Card
                  key={device.id}
                  sx={{
                    borderColor:
                      active
                        ? "primary.light"
                        : "divider",

                    bgcolor:
                      active
                        ? "rgba(37, 99, 235, 0.035)"
                        : "background.paper",

                    opacity:
                      device.available
                        ? 1
                        : 0.65,
                  }}
                >
                  <CardContent
                    sx={{
                      p: 0.9,
                      "&:last-child": {
                        pb: 0.9,
                      },
                    }}
                  >
                    <Stack spacing={0.5}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                      >
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            flexShrink: 0,
                            display: "grid",
                            placeItems: "center",
                            borderRadius: 2,
                            bgcolor:
                              active
                                ? "primary.main"
                                : "action.hover",
                            color:
                              active
                                ? "primary.contrastText"
                                : "text.secondary",
                            "& svg": {
                              fontSize: 19,
                            },
                          }}
                        >
                          {getDeviceIcon(device)}
                        </Box>

                        <Box
                          sx={{
                            flexGrow: 1,
                            minWidth: 0,
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            noWrap
                            sx={{
                              fontWeight: "900 !important",
                            }}
                          >
                            {device.name}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                            noWrap
                          >
                            {device.location}
                          </Typography>
                        </Box>

                        <Switch
                          size="small"
                          checked={active}
                          disabled={
                            !switchAvailable ||
                            commanding ||
                            refreshing
                          }
                          onChange={() =>
                            handleToggle(device)
                          }
                          inputProps={{
                            "aria-label":
                              `Mettre en ou hors service ${device.name}`,
                          }}
                          sx={{
                            flexShrink: 0,
                          }}
                        />
                      </Stack>

                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={1}
                        sx={{
                          pl: 5.5,
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={800}
                          noWrap
                        >
                          {formatValue(
                            device.power,
                            1
                          )}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          noWrap
                        >
                          {formatValue(
                            device.voltage,
                            0
                          )}
                          {" · "}
                          {formatValue(
                            device.current,
                            2
                          )}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Divider
                      sx={{
                        my: 0.5,
                      }}
                    />

                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={1}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {formatValue(
                          device.totalEnergy,
                          3
                        )}
                      </Typography>

                      <Chip
                        label={
                          commanding
                            ? "Commande..."
                            : !switchAvailable
                            ? "Commande indisponible"
                            : active
                            ? "En service"
                            : "Hors service"
                        }
                        color={
                          !switchAvailable
                            ? "warning"
                            : active
                            ? "success"
                            : "default"
                        }
                        size="small"
                        variant={
                          active
                            ? "filled"
                            : "outlined"
                        }
                        sx={{
                          height: 20,
                          "& .MuiChip-label": {
                            px: 0.75,
                            fontSize: 11,
                          },
                        }}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}

export default EnergyPage;

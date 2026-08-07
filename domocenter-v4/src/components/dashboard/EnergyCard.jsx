import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import ElectricMeterRoundedIcon from "@mui/icons-material/ElectricMeterRounded";
import PowerRoundedIcon from "@mui/icons-material/PowerRounded";
import PowerSettingsNewRoundedIcon from "@mui/icons-material/PowerSettingsNewRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";

const API_URL = "http://localhost:3001";

function formatValue(metric, fallback = "--") {
  if (!metric?.available || metric.value === null) {
    return fallback;
  }

  const decimals =
    metric.unit === "A" || metric.unit === "kWh" ? 3 : 1;

  return `${metric.value.toFixed(decimals)} ${metric.unit}`;
}

function EnergyCard({ device, onEnergyUpdated }) {
  const [commandPending, setCommandPending] = useState(false);
  const [commandError, setCommandError] = useState("");

  const isAvailable = Boolean(device?.available);
  const switchAvailable = Boolean(device?.switch?.available);
  const isOn = Boolean(switchAvailable && device.switch.isOn);

  async function handleSwitch() {
    if (!switchAvailable || commandPending) {
      return;
    }

    try {
      setCommandPending(true);
      setCommandError("");

      const response = await fetch(
        `${API_URL}/api/energy/${device.id}/switch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isOn: !isOn,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.details ||
            data.error ||
            `Erreur du serveur : ${response.status}`
        );
      }

      if (typeof onEnergyUpdated === "function") {
        onEnergyUpdated(data.energy);
      }
    } catch (error) {
      setCommandError(
        error instanceof Error
          ? error.message
          : "Erreur inconnue lors de la commande."
      );
    } finally {
      setCommandPending(false);
    }
  }

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={2.5}>
          <Stack
            direction="row"
            alignItems="flex-start"
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography variant="h6" fontWeight={800}>
                {device?.name ?? "Équipement"}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {device?.location ?? "Emplacement inconnu"}
              </Typography>
            </Box>

            <Chip
              label={
                !isAvailable
                  ? "Indisponible"
                  : isOn
                    ? "En marche"
                    : "À l’arrêt"
              }
              color={
                !isAvailable
                  ? "default"
                  : isOn
                    ? "success"
                    : "warning"
              }
              size="small"
              variant={isAvailable ? "filled" : "outlined"}
            />
          </Stack>

          {commandError && (
            <Alert severity="error">
              {commandError}
            </Alert>
          )}

          <Button
            fullWidth
            variant={isOn ? "outlined" : "contained"}
            color={isOn ? "error" : "success"}
            startIcon={<PowerSettingsNewRoundedIcon />}
            onClick={handleSwitch}
            disabled={!switchAvailable || commandPending}
          >
            {commandPending
              ? "Commande en cours..."
              : isOn
                ? "Arrêter"
                : "Mettre en marche"}
          </Button>

          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: isOn
                ? "rgba(37, 99, 235, 0.06)"
                : "action.hover",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
            >
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 3,
                  bgcolor: isOn
                    ? "primary.main"
                    : "action.disabledBackground",
                  color: isOn
                    ? "primary.contrastText"
                    : "text.disabled",
                  flexShrink: 0,
                }}
              >
                <PowerRoundedIcon />
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Puissance instantanée
                </Typography>

                <Typography variant="h5" fontWeight={800}>
                  {formatValue(device?.power)}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Grid container spacing={1.5}>
            <Grid size={{ xs: 6 }}>
              <Box
                sx={{
                  p: 1.5,
                  height: "100%",
                  borderRadius: 2.5,
                  bgcolor: "action.hover",
                }}
              >
                <Stack spacing={0.75}>
                  <BoltRoundedIcon
                    sx={{ fontSize: 20 }}
                    color="primary"
                  />

                  <Typography variant="caption" color="text.secondary">
                    Tension
                  </Typography>

                  <Typography fontWeight={800}>
                    {formatValue(device?.voltage)}
                  </Typography>
                </Stack>
              </Box>
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Box
                sx={{
                  p: 1.5,
                  height: "100%",
                  borderRadius: 2.5,
                  bgcolor: "action.hover",
                }}
              >
                <Stack spacing={0.75}>
                  <SpeedRoundedIcon
                    sx={{ fontSize: 20 }}
                    color="primary"
                  />

                  <Typography variant="caption" color="text.secondary">
                    Courant
                  </Typography>

                  <Typography fontWeight={800}>
                    {formatValue(device?.current)}
                  </Typography>
                </Stack>
              </Box>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2.5,
                  bgcolor: "action.hover",
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                  >
                    <ElectricMeterRoundedIcon
                      sx={{ fontSize: 20 }}
                      color="secondary"
                    />

                    <Typography variant="body2" color="text.secondary">
                      Énergie totale
                    </Typography>
                  </Stack>

                  <Typography fontWeight={800}>
                    {formatValue(device?.totalEnergy)}
                  </Typography>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default EnergyCard;

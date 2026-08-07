import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import EnergyCard from "./EnergyCard";

function formatPower(watts) {
  if (!Number.isFinite(watts)) {
    return "--";
  }

  if (watts >= 1000) {
    return `${(watts / 1000).toFixed(2)} kW`;
  }

  return `${watts.toFixed(1)} W`;
}

function calculateEnergySummary(devices) {
  const totalPowerWatts = devices
    .filter((device) => device?.power?.available)
    .reduce(
      (total, device) => total + Number(device.power.value || 0),
      0
    );

  const activeDevices = devices.filter(
    (device) =>
      device?.switch?.available && device.switch.isOn
  ).length;

  const unavailableDevices = devices.filter(
    (device) => !device?.available
  ).length;

  return {
    totalPowerWatts,
    activeDevices,
    unavailableDevices,
  };
}

function EnergySection({ energy, loading = false }) {
  const [currentEnergy, setCurrentEnergy] = useState(
    energy ?? null
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCurrentEnergy(energy ?? null);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [energy]);

  const devices = currentEnergy?.devices ?? [];
  const totalDevices =
    currentEnergy?.totalDevices ?? devices.length;

  const calculatedSummary = calculateEnergySummary(devices);

  const activeDevices = calculatedSummary.activeDevices;
  const unavailableDevices =
    calculatedSummary.unavailableDevices;
  const totalPowerWatts =
    calculatedSummary.totalPowerWatts;

  function handleEnergyUpdated(updatedEnergy) {
    setCurrentEnergy(updatedEnergy);
  }

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={1}
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant="h5" fontWeight={800}>
            Énergie réelle
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Mesures et commandes des disjoncteurs Tuya
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          flexWrap="wrap"
        >
          <Chip
            icon={<BoltRoundedIcon />}
            label={`Puissance totale : ${formatPower(
              totalPowerWatts
            )}`}
            color="primary"
            variant="outlined"
          />

          <Chip
            icon={
              unavailableDevices > 0 ? (
                <WarningAmberRoundedIcon />
              ) : (
                <CheckCircleRoundedIcon />
              )
            }
            label={`${activeDevices} actif${
              activeDevices > 1 ? "s" : ""
            } sur ${totalDevices}`}
            color={
              unavailableDevices > 0
                ? "warning"
                : "success"
            }
            variant="outlined"
          />
        </Stack>
      </Stack>

      {loading && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Chargement des mesures énergétiques...
        </Alert>
      )}

      {!loading && unavailableDevices > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {unavailableDevices} équipement
          {unavailableDevices > 1
            ? "s sont indisponibles"
            : " est indisponible"}
          .
        </Alert>
      )}

      {!loading &&
        unavailableDevices === 0 &&
        devices.length > 0 && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Les trois équipements énergétiques transmettent leurs
            mesures et peuvent être commandés.
          </Alert>
        )}

      <Grid container spacing={2}>
        {devices.map((device) => (
          <Grid
            key={device.id}
            size={{ xs: 12, md: 6, xl: 4 }}
            sx={{ minWidth: 0 }}
          >
            <EnergyCard
              device={device}
              onEnergyUpdated={handleEnergyUpdated}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default EnergySection;
import {
  Box,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import SectionCard from "../common/SectionCard";

function formatPower(watts) {
  if (!Number.isFinite(watts)) {
    return "--";
  }

  if (watts >= 1000) {
    return `${(watts / 1000).toFixed(2)} kW`;
  }

  return `${watts.toFixed(1)} W`;
}

function EnergySummary({
  energy,
  loading = false,
}) {
  const devices = energy?.devices ?? [];

  const total =
    energy?.totalDevices ??
    devices.length;

  const active = devices.filter(
    (device) =>
      device?.switch?.available &&
      device.switch.isOn
  ).length;

  const unavailable = devices.filter(
    (device) => !device?.available
  ).length;

  const totalPower = devices
    .filter(
      (device) => device?.power?.available
    )
    .reduce(
      (sum, device) =>
        sum + Number(device.power.value || 0),
      0
    );

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
      }}
    >
      <SectionCard
        title="Énergie"
        icon={<BoltRoundedIcon />}
        action={
          <Chip
            size="small"
            label={`${active} / ${total} actif${
              active > 1 ? "s" : ""
            }`}
            color={
              unavailable > 0
                ? "warning"
                : "success"
            }
            variant="outlined"
          />
        }
      >
        {loading ? (
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Chargement de l’énergie…
          </Typography>
        ) : (
          <Stack spacing={1}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
            >
              <BoltRoundedIcon
                sx={{
                  color: "primary.main",
                  fontSize: 22,
                }}
              />

              <Typography
                variant="body1"
                fontWeight={600}
              >
                Puissance instantanée
              </Typography>

              <Typography
                variant="body1"
                fontWeight={800}
              >
                {formatPower(totalPower)}
              </Typography>
            </Stack>

            {unavailable === 0 ? (
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
              >
                <CheckCircleRoundedIcon
                  sx={{
                    color: "success.main",
                    fontSize: 20,
                  }}
                />

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Tous les équipements énergétiques répondent.
                </Typography>
              </Stack>
            ) : (
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
              >
                <WarningAmberRoundedIcon
                  sx={{
                    color: "warning.main",
                    fontSize: 20,
                  }}
                />

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {unavailable} équipement
                  {unavailable > 1
                    ? "s indisponibles"
                    : " indisponible"}
                </Typography>
              </Stack>
            )}
          </Stack>
        )}
      </SectionCard>
    </Box>
  );
}

export default EnergySummary;

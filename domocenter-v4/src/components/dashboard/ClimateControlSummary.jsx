import {
  Box,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import AcUnitRoundedIcon from "@mui/icons-material/AcUnitRounded";
import ThermostatRoundedIcon from "@mui/icons-material/ThermostatRounded";
import AdjustRoundedIcon from "@mui/icons-material/AdjustRounded";

import SectionCard from "../common/SectionCard";

const HVAC_LABELS = {
  off: "Arrêt",
  cool: "Froid",
  dry: "Déshumidification",
  fan_only: "Ventilation",
  auto: "Auto",
  heat: "Chauffage",
};

function ClimateControlSummary({
  climateControl,
  loading = false,
}) {
  const device =
    climateControl?.devices?.[0] ?? null;

  if (loading) {
    return (
      <SectionCard
        title="Climatisation"
        icon={<AcUnitRoundedIcon />}
      >
        <Typography
          variant="body2"
          color="text.secondary"
        >
          Chargement...
        </Typography>
      </SectionCard>
    );
  }

  if (!device) {
    return (
      <SectionCard
        title="Climatisation"
        icon={<AcUnitRoundedIcon />}
      >
        <Typography
          variant="body2"
          color="text.secondary"
        >
          Aucune climatisation disponible.
        </Typography>
      </SectionCard>
    );
  }

  const modeLabel =
    HVAC_LABELS[device.state] ??
    device.state ??
    "--";

  return (
    <SectionCard
      title="Climatisation"
      icon={<AcUnitRoundedIcon />}
    >
      <Stack spacing={2}>
        {/* ENTÊTE */}

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={800}
            >
              {device.name}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {device.location}
            </Typography>
          </Box>

          <Chip
            label={
              !device.available
                ? "Indisponible"
                : device.isOn
                ? "En marche"
                : "Arrêtée"
            }
            color={
              !device.available
                ? "warning"
                : device.isOn
                ? "success"
                : "default"
            }
            size="small"
            variant={
              device.isOn
                ? "filled"
                : "outlined"
            }
          />
        </Stack>

        <Divider />

        {/* TEMPÉRATURES */}

        <Stack
          direction="row"
          alignItems="stretch"
          spacing={1.5}
        >
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              p: 1.5,
              borderRadius: 2.5,
              bgcolor: "action.hover",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
            >
              <ThermostatRoundedIcon
                sx={{
                  color: "primary.main",
                  fontSize: 23,
                }}
              />

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Ambiante
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight={800}
                  sx={{
                    lineHeight: 1.15,
                  }}
                >
                  {Number.isFinite(
                    device.currentTemperature
                  )
                    ? `${device.currentTemperature}°`
                    : "--"}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              p: 1.5,
              borderRadius: 2.5,
              bgcolor: "action.hover",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
            >
              <AdjustRoundedIcon
                sx={{
                  color: "secondary.main",
                  fontSize: 22,
                }}
              />

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Consigne
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight={800}
                  sx={{
                    lineHeight: 1.15,
                  }}
                >
                  {Number.isFinite(
                    device.targetTemperature
                  )
                    ? `${device.targetTemperature}°`
                    : "--"}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>

        {/* MODE */}

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            px: 0.5,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Mode actuel
          </Typography>

          <Typography
            variant="body2"
            fontWeight={800}
          >
            {modeLabel}
          </Typography>
        </Stack>
      </Stack>
    </SectionCard>
  );
}

export default ClimateControlSummary;

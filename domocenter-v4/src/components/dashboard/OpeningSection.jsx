import {
  Box,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DoorFrontRoundedIcon from "@mui/icons-material/DoorFrontRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import SectionCard from "../common/SectionCard";

function OpeningSection({
  openings,
  loading = false,
}) {
  const sensors = openings?.sensors ?? [];

  const openCount =
    openings?.open ??
    sensors.filter(
      (sensor) =>
        sensor.available &&
        sensor.isOpen
    ).length;

  const unavailableCount =
    openings?.unavailable ??
    sensors.filter(
      (sensor) => !sensor.available
    ).length;

  const total =
    openings?.total ?? sensors.length;

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        height: "100%",
      }}
    >
      <SectionCard
        title="Ouvertures"
        icon={<DoorFrontRoundedIcon />}
        action={
          <Chip
            size="small"
            icon={
              openCount > 0 ? (
                <WarningAmberRoundedIcon />
              ) : (
                <CheckCircleRoundedIcon />
              )
            }
            label={`${openCount} / ${total} ouverte${
              openCount > 1 ? "s" : ""
            }`}
            color={
              openCount > 0
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
            Chargement des ouvertures…
          </Typography>
        ) : unavailableCount > 0 ? (
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

            <Typography variant="body1">
              {unavailableCount} détecteur
              {unavailableCount > 1
                ? "s sont indisponibles."
                : " est indisponible."}
            </Typography>
          </Stack>
        ) : openCount > 0 ? (
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

            <Typography variant="body1">
              Des ouvertures sont actuellement détectées.
            </Typography>
          </Stack>
        ) : (
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

            <Typography variant="body1">
              Toutes les ouvertures sont fermées.
            </Typography>
          </Stack>
        )}
      </SectionCard>
    </Box>
  );
}

export default OpeningSection;

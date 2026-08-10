import {
  Box,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import SectionCard from "../common/SectionCard";

function SmokeSummary({
  smoke,
  loading = false,
}) {
  const smokeAlertCount =
    smoke?.smokeAlert ?? 0;

  const tamperAlertCount =
    smoke?.tamperAlert ?? 0;

  const unavailableCount =
    smoke?.unavailable ?? 0;

  const lowBatteryCount =
    smoke?.lowBattery ?? 0;

  const total =
    smoke?.total ?? 0;

  const hasSmokeAlert =
    smokeAlertCount > 0;

  const hasAttention =
    tamperAlertCount > 0 ||
    unavailableCount > 0;

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        height: "100%",
      }}
    >
      <SectionCard
        title="Fumée"
        icon={<LocalFireDepartmentRoundedIcon />}
        action={
          <Chip
            size="small"
            label={`${smokeAlertCount} / ${total} alerte${
              smokeAlertCount > 1 ? "s" : ""
            }`}
            color={
              hasSmokeAlert
                ? "error"
                : hasAttention
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
            Chargement des détecteurs…
          </Typography>
        ) : hasSmokeAlert ? (
          <Stack spacing={1}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
            >
              <LocalFireDepartmentRoundedIcon
                sx={{
                  color: "error.main",
                  fontSize: 20,
                }}
              />

              <Typography
                variant="body1"
                fontWeight={600}
                color="error.main"
              >
                Alerte fumée détectée.
              </Typography>
            </Stack>

            {lowBatteryCount > 0 && (
              <Typography
                variant="body2"
                color="warning.main"
                fontWeight={600}
              >
                🔋 {lowBatteryCount} batterie
                {lowBatteryCount > 1
                  ? "s faibles"
                  : " faible"}
              </Typography>
            )}
          </Stack>
        ) : hasAttention ? (
          <Stack spacing={1}>
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
                variant="body1"
                fontWeight={600}
              >
                Un ou plusieurs détecteurs nécessitent votre attention.
              </Typography>
            </Stack>

            {tamperAlertCount > 0 && (
              <Typography
                variant="body2"
                color="warning.main"
              >
                {tamperAlertCount} détecteur
                {tamperAlertCount > 1
                  ? "s signalent"
                  : " signale"}{" "}
                une manipulation.
              </Typography>
            )}

            {unavailableCount > 0 && (
              <Typography
                variant="body2"
                color="warning.main"
              >
                {unavailableCount} détecteur
                {unavailableCount > 1
                  ? "s indisponibles"
                  : " indisponible"}.
              </Typography>
            )}

            {lowBatteryCount > 0 && (
              <Typography
                variant="body2"
                color="warning.main"
                fontWeight={600}
              >
                🔋 {lowBatteryCount} batterie
                {lowBatteryCount > 1
                  ? "s faibles"
                  : " faible"}
              </Typography>
            )}
          </Stack>
        ) : (
          <Stack spacing={1}>
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
                Aucun détecteur de fumée en alerte.
              </Typography>
            </Stack>

            {lowBatteryCount > 0 && (
              <Typography
                variant="body2"
                color="warning.main"
                fontWeight={600}
              >
                🔋 {lowBatteryCount} batterie
                {lowBatteryCount > 1
                  ? "s faibles"
                  : " faible"}
              </Typography>
            )}
          </Stack>
        )}
      </SectionCard>
    </Box>
  );
}

export default SmokeSummary;

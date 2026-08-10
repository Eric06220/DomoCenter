import {
  Box,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import SectionCard from "../common/SectionCard";

function WaterLeakSummary({
  waterLeaks,
  loading = false,
}) {
  const alertCount =
    waterLeaks?.alert ?? 0;

  const unavailableCount =
    waterLeaks?.unavailable ?? 0;

  const lowBatteryCount =
    waterLeaks?.lowBattery ?? 0;

  const total =
    waterLeaks?.total ?? 0;

  const hasLeak =
    alertCount > 0;

  const hasUnavailable =
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
        title="Inondation"
        icon={<WaterDropRoundedIcon />}
        action={
          <Chip
            size="small"
            label={`${alertCount} / ${total} alerte${
              alertCount > 1 ? "s" : ""
            }`}
            color={
              hasLeak
                ? "error"
                : hasUnavailable
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
        ) : hasLeak ? (
          <Stack spacing={1}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
            >
              <WarningAmberRoundedIcon
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
                Alerte fuite détectée.
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
        ) : hasUnavailable ? (
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
                Un ou plusieurs détecteurs sont indisponibles.
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
                Aucun dégât des eaux détecté.
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

export default WaterLeakSummary;

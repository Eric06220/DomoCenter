import {
  Box,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import SectionCard from "../common/SectionCard";

function LightingSummary({
  lighting,
  loading = false,
}) {
  const devices = lighting?.devices ?? [];

  const total =
    lighting?.totalCount ??
    devices.length;

  const active =
    lighting?.activeCount ??
    devices.filter(
      (device) =>
        device.available &&
        device.isOn
    ).length;

  const unavailable =
    lighting?.unavailableCount ??
    devices.filter(
      (device) => !device.available
    ).length;

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <SectionCard
        title="Éclairage"
        icon={<LightbulbRoundedIcon />}
        action={
          <Chip
            size="small"
            label={`${active} / ${total} allumé${
              active > 1 ? "s" : ""
            }`}
            color={
              active > 0
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
            Chargement de l’éclairage…
          </Typography>
        ) : (
          <Stack spacing={1}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
            >
              {active > 0 ? (
                <LightbulbRoundedIcon
                  sx={{
                    color: "warning.main",
                    fontSize: 20,
                  }}
                />
              ) : (
                <CheckCircleRoundedIcon
                  sx={{
                    color: "success.main",
                    fontSize: 20,
                  }}
                />
              )}

              <Typography
                variant="body1"
                fontWeight={600}
              >
                {active > 0
                  ? `${active} équipement${
                      active > 1 ? "s" : ""
                    } actuellement allumé${
                      active > 1 ? "s" : ""
                    }.`
                  : "Tous les éclairages sont éteints."}
              </Typography>
            </Stack>

            {unavailable > 0 && (
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

export default LightingSummary;

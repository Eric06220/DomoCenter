import {
  Box,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import BatteryFullRoundedIcon from "@mui/icons-material/BatteryFullRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";

import SectionCard from "../common/SectionCard";

function BatterySummary({
  batteries,
  loading = false,
}) {
  const total =
    batteries?.total ?? 0;

  const low =
    batteries?.low ?? 0;

  const critical =
    batteries?.critical ?? 0;

  const unavailable =
    batteries?.unavailable ?? 0;

  const problemBatteries =
    batteries?.batteries?.filter(
      (battery) =>
        battery.status === "low" ||
        battery.status === "critical" ||
        battery.status === "unavailable"
    ) ?? [];

  const healthy =
    critical === 0 &&
    low === 0 &&
    unavailable === 0;

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        height: "100%",
      }}
    >
      <SectionCard
        title="Batteries"
        icon={<BatteryFullRoundedIcon />}
        action={
          <Chip
            size="small"
            label={`${total} suivies`}
            color={
              critical > 0
                ? "error"
                : low > 0 ||
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
            Chargement des batteries…
          </Typography>
        ) : healthy ? (
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

            <Typography>
              Toutes les batteries sont correctes.
            </Typography>
          </Stack>
        ) : (
          <Stack spacing={1.5}>
            {problemBatteries.map(
              (battery) => (
                <Stack
                  key={battery.id}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    minWidth={0}
                  >
                    {battery.status ===
                    "critical" ? (
                      <ErrorRoundedIcon
                        sx={{
                          color: "error.main",
                          fontSize: 20,
                        }}
                      />
                    ) : (
                      <WarningAmberRoundedIcon
                        sx={{
                          color:
                            "warning.main",
                          fontSize: 20,
                        }}
                      />
                    )}

                    <Typography
                      variant="body2"
                      noWrap
                    >
                      {battery.name}
                    </Typography>
                  </Stack>

                  <Typography
                    variant="body2"
                    fontWeight={700}
                    color={
                      battery.status ===
                      "critical"
                        ? "error.main"
                        : "warning.main"
                    }
                  >
                    {Number.isFinite(
                      battery.level
                    )
                      ? `${battery.level} %`
                      : "Indisponible"}
                  </Typography>
                </Stack>
              )
            )}
          </Stack>
        )}
      </SectionCard>
    </Box>
  );
}

export default BatterySummary;

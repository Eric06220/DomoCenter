import {
  Box,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import ThermostatRoundedIcon from "@mui/icons-material/ThermostatRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";

import BatteryStatus from "../common/BatteryStatus";
import SectionCard from "../common/SectionCard";

function formatTemperature(metric) {
  if (!metric?.available || !Number.isFinite(metric.value)) {
    return "--";
  }

  return `${metric.value.toFixed(1)} °C`;
}

function formatHumidity(metric) {
  if (!metric?.available || !Number.isFinite(metric.value)) {
    return "--";
  }

  return `${metric.value.toFixed(0)} %`;
}

function ClimateSection({
  zones = [],
  loading = false,
}) {
  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <SectionCard
        title="Climat"
        icon={<ThermostatRoundedIcon />}
      >
        <Grid container spacing={1.5}>
          {zones.map((zone) => (
            <Grid
              key={zone.id}
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1.4fr 1fr 0.9fr auto",
                  },
                  alignItems: "center",
                  columnGap: 1.5,
                  rowGap: 1,
                  minHeight: 44,
                  px: 1.5,
                  py: 1,
                  borderRadius: 2,
                  bgcolor: "action.hover",
                }}
              >
                <Typography
                  variant="body1"
                  fontWeight={600}
                  noWrap
                  sx={{
                    textAlign: {
                      xs: "left",
                      sm: "center",
                    },
                  }}
                >
                  {zone.name}
                </Typography>

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                  spacing={0.5}
                >
                  <ThermostatRoundedIcon
                    sx={{
                      fontSize: 18,
                      color: "primary.main",
                    }}
                  />

                  <Typography
                    variant="body2"
                    fontWeight={700}
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    {loading
                      ? "..."
                      : formatTemperature(
                          zone.temperature
                        )}
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                  spacing={0.5}
                >
                  <WaterDropRoundedIcon
                    sx={{
                      fontSize: 17,
                      color: "secondary.main",
                    }}
                  />

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    {loading
                      ? "..."
                      : formatHumidity(
                          zone.humidity
                        )}
                  </Typography>
                </Stack>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: {
                      xs: "flex-start",
                      sm: "center",
                    },
                  }}
                >
                  <BatteryStatus
                    level={zone.batteryLevel}
                  />
                </Box>
              </Box>
            </Grid>
          ))}

          {!loading && zones.length === 0 && (
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Aucune donnée climatique disponible.
              </Typography>
            </Grid>
          )}
        </Grid>
      </SectionCard>
    </Box>
  );
}

export default ClimateSection;

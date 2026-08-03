import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import ThermostatRoundedIcon from "@mui/icons-material/ThermostatRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";

function ClimateCard({
  name,
  temperature,
  humidity,
  loading = false,
}) {
  const isAvailable = Boolean(temperature && humidity);

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={2.5}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography variant="h6" fontWeight={800}>
                {name}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Mesures réelles
              </Typography>
            </Box>

            <Chip
              label={isAvailable ? "En direct" : "Indisponible"}
              color={isAvailable ? "success" : "error"}
              size="small"
            />
          </Stack>

          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Box
                sx={{
                  p: 2,
                  height: "100%",
                  borderRadius: 3,
                  bgcolor: "rgba(37, 99, 235, 0.06)",
                }}
              >
                <Stack spacing={1}>
                  <ThermostatRoundedIcon color="primary" />

                  <Typography variant="caption" color="text.secondary">
                    Température
                  </Typography>

                  <Typography variant="h5" fontWeight={800}>
                    {loading ? (
                      <CircularProgress size={25} />
                    ) : temperature ? (
                      `${temperature.value.toFixed(1)} ${temperature.unit}`
                    ) : (
                      "--"
                    )}
                  </Typography>
                </Stack>
              </Box>
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Box
                sx={{
                  p: 2,
                  height: "100%",
                  borderRadius: 3,
                  bgcolor: "rgba(15, 118, 110, 0.07)",
                }}
              >
                <Stack spacing={1}>
                  <WaterDropRoundedIcon color="secondary" />

                  <Typography variant="caption" color="text.secondary">
                    Humidité
                  </Typography>

                  <Typography variant="h5" fontWeight={800}>
                    {loading ? (
                      <CircularProgress size={25} />
                    ) : humidity ? (
                      `${humidity.value.toFixed(1)} ${humidity.unit}`
                    ) : (
                      "--"
                    )}
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

export default ClimateCard;
import { Box, Grid, Typography } from "@mui/material";

import ClimateCard from "./ClimateCard";

function ClimateSection({ zones = [], loading = false }) {
  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>
        Climat réel
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 2 }}
      >
        Données Smart Life transmises par Home Assistant
      </Typography>

      <Grid container spacing={2}>
        {zones.map((zone) => (
          <Grid
            key={zone.id}
            size={{
              xs: 12,
              sm: 6,
              xl: 3,
            }}
            sx={{ minWidth: 0 }}
          >
            <ClimateCard
              name={zone.name}
              temperature={
                zone.temperature?.available
                  ? zone.temperature
                  : null
              }
              humidity={
                zone.humidity?.available
                  ? zone.humidity
                  : null
              }
              loading={loading}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ClimateSection;
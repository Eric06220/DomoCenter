import {
  Alert,
  Box,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import OpeningCard from "./OpeningCard";

function OpeningSection({ openings, loading = false }) {
  const sensors = openings?.sensors ?? [];
  const openCount = openings?.open ?? 0;
  const unavailableCount = openings?.unavailable ?? 0;
  const total = openings?.total ?? sensors.length;

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={1}
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant="h5" fontWeight={800}>
            Ouvertures réelles
          </Typography>

          <Typography variant="body2" color="text.secondary">
            États transmis par les détecteurs Smart Life
          </Typography>
        </Box>

        <Chip
          icon={
            openCount > 0 ? (
              <WarningAmberRoundedIcon />
            ) : (
              <CheckCircleRoundedIcon />
            )
          }
          label={`${openCount} ouverte${openCount > 1 ? "s" : ""} sur ${total}`}
          color={openCount > 0 ? "warning" : "success"}
          variant="outlined"
        />
      </Stack>

      {loading && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Chargement des détecteurs d’ouverture...
        </Alert>
      )}

      {!loading && openCount > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {openCount} ouverture{openCount > 1 ? "s sont" : " est"} actuellement
          détectée{openCount > 1 ? "s" : ""}.
        </Alert>
      )}

      {!loading && openCount === 0 && unavailableCount === 0 && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Toutes les ouvertures sont fermées.
        </Alert>
      )}

      {!loading && unavailableCount > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {unavailableCount} détecteur
          {unavailableCount > 1 ? "s sont indisponibles" : " est indisponible"}.
        </Alert>
      )}

      <Grid container spacing={2}>
        {sensors.map((sensor) => (
          <Grid
            key={sensor.id}
            size={{ xs: 12, sm: 6, lg: 4 }}
            sx={{ minWidth: 0 }}
          >
            <OpeningCard
              name={sensor.name}
              location={sensor.location}
              isOpen={Boolean(sensor.isOpen)}
              available={Boolean(sensor.available)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default OpeningSection;
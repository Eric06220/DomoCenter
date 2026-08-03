import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

const dashboardData = {
  temperature: {
    value: "22,4 °C",
    location: "Moyenne intérieure",
  },
  humidity: {
    value: "51 %",
    location: "Moyenne intérieure",
  },
  security: {
    openSensors: 1,
    totalSensors: 6,
  },
  smoke: {
    alerts: 0,
    totalSensors: 2,
  },
  energy: {
    value: "2,84 kW",
    location: "Consommation actuelle",
  },
  lights: {
    active: 3,
    total: 10,
  },
  cameras: {
    online: 6,
    total: 7,
  },
};

function DashboardCard({ title, value, description, status, statusColor = "default" }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>

          <Typography variant="h4" fontWeight={700}>
            {value}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>

          {status && (
            <Box>
              <Chip label={status} color={statusColor} size="small" />
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const securityIsSafe = dashboardData.security.openSensors === 0;
  const smokeIsSafe = dashboardData.smoke.alerts === 0;

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Tableau de bord
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Vue générale de la maison et des équipements
          </Typography>
        </Box>

        <Alert severity={securityIsSafe && smokeIsSafe ? "success" : "warning"}>
          {securityIsSafe && smokeIsSafe
            ? "Maison sécurisée : toutes les ouvertures sont fermées et aucun détecteur de fumée n'est en alerte."
            : `${dashboardData.security.openSensors} ouverture active et ${dashboardData.smoke.alerts} alerte fumée.`}
        </Alert>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <DashboardCard
              title="🌡️ Température"
              value={dashboardData.temperature.value}
              description={dashboardData.temperature.location}
              status="Confortable"
              statusColor="success"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <DashboardCard
              title="💧 Humidité"
              value={dashboardData.humidity.value}
              description={dashboardData.humidity.location}
              status="Normale"
              statusColor="success"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <DashboardCard
              title="🚪 Ouvertures"
              value={`${dashboardData.security.openSensors} / ${dashboardData.security.totalSensors}`}
              description="Détecteurs actuellement ouverts"
              status={
                securityIsSafe
                  ? "Tout est fermé"
                  : `${dashboardData.security.openSensors} ouverture active`
              }
              statusColor={securityIsSafe ? "success" : "warning"}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <DashboardCard
              title="🔥 Fumée"
              value={`${dashboardData.smoke.alerts} alerte`}
              description={`${dashboardData.smoke.totalSensors} détecteurs installés`}
              status={smokeIsSafe ? "Aucune alerte" : "Attention"}
              statusColor={smokeIsSafe ? "success" : "error"}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <DashboardCard
              title="⚡ Énergie"
              value={dashboardData.energy.value}
              description={dashboardData.energy.location}
              status="Mesure simulée"
              statusColor="info"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <DashboardCard
              title="💡 Éclairages"
              value={`${dashboardData.lights.active} allumés`}
              description={`${dashboardData.lights.total} circuits disponibles`}
              status="État simulé"
              statusColor="info"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <DashboardCard
              title="📹 Caméras"
              value={`${dashboardData.cameras.online} / ${dashboardData.cameras.total}`}
              description="Caméras actuellement en ligne"
              status={
                dashboardData.cameras.online === dashboardData.cameras.total
                  ? "Toutes en ligne"
                  : "Une caméra hors ligne"
              }
              statusColor={
                dashboardData.cameras.online === dashboardData.cameras.total
                  ? "success"
                  : "warning"
              }
            />
          </Grid>
        </Grid>

        <Alert severity="info">
          Les valeurs affichées sont encore simulées. Nous les remplacerons ensuite par les vraies données de tes équipements.
        </Alert>
      </Stack>
    </Box>
  );
}

export default Dashboard;
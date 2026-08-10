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

  batteries: [
    {
      id: 1,
      name: "Détecteur porte Entrée",
      location: "Entrée",
      level: 76,
    },
    {
      id: 2,
      name: "Détecteur fenêtre Studio",
      location: "Studio",
      level: 18,
    },
    {
      id: 3,
      name: "Capteur température Maison",
      location: "Maison",
      level: 8,
    },
    {
      id: 4,
      name: "Détecteur porte Atelier",
      location: "Atelier",
      level: 64,
    },
  ],
};

function getBatteryStatus(level) {
  if (level <= 10) {
    return {
      label: "Critique",
      color: "error",
    };
  }

  if (level <= 20) {
    return {
      label: "Faible",
      color: "warning",
    };
  }

  return {
    label: "Normal",
    color: "success",
  };
}

function DashboardCard({
  title,
  value,
  description,
  status,
  statusColor = "default",
}) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ height: "100%" }}>
        <Stack spacing={1.5} sx={{ height: "100%" }}>
          <Typography variant="h6" fontWeight={700}>
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

function BatteryAlerts({ batteries }) {
  const lowBatteries = batteries.filter(
    (battery) => battery.level <= 20 && battery.level > 10
  );

  const criticalBatteries = batteries.filter(
    (battery) => battery.level <= 10
  );

  const alertBatteries = batteries.filter(
    (battery) => battery.level <= 20
  );

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              🔋 Alertes batteries
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Surveillance des batteries des équipements DomoCenter
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              label={`${batteries.length} surveillées`}
              color="default"
              size="small"
            />

            <Chip
              label={`${lowBatteries.length} faible${
                lowBatteries.length > 1 ? "s" : ""
              }`}
              color={lowBatteries.length > 0 ? "warning" : "default"}
              size="small"
            />

            <Chip
              label={`${criticalBatteries.length} critique${
                criticalBatteries.length > 1 ? "s" : ""
              }`}
              color={criticalBatteries.length > 0 ? "error" : "default"}
              size="small"
            />
          </Stack>

          {alertBatteries.length === 0 ? (
            <Alert severity="success">
              Toutes les batteries surveillées sont à un niveau normal.
            </Alert>
          ) : (
            <Stack spacing={1}>
              {alertBatteries.map((battery) => {
                const status = getBatteryStatus(battery.level);

                return (
                  <Alert
                    key={battery.id}
                    severity={
                      battery.level <= 10 ? "error" : "warning"
                    }
                  >
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1}
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      justifyContent="space-between"
                    >
                      <Box>
                        <Typography fontWeight={700}>
                          {battery.name}
                        </Typography>

                        <Typography variant="body2">
                          {battery.location} — Batterie : {battery.level} %
                        </Typography>
                      </Box>

                      <Chip
                        label={status.label}
                        color={status.color}
                        size="small"
                      />
                    </Stack>
                  </Alert>
                );
              })}
            </Stack>
          )}

          <Typography variant="caption" color="text.secondary">
            Seuil faible : 20 % ou moins — seuil critique : 10 % ou moins.
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const securityIsSafe = dashboardData.security.openSensors === 0;
  const smokeIsSafe = dashboardData.smoke.alerts === 0;

  const lowBatteryCount = dashboardData.batteries.filter(
    (battery) => battery.level <= 20 && battery.level > 10
  ).length;

  const criticalBatteryCount = dashboardData.batteries.filter(
    (battery) => battery.level <= 10
  ).length;

  const batteryIsSafe =
    lowBatteryCount === 0 && criticalBatteryCount === 0;

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

        <Alert
          severity={
            securityIsSafe && smokeIsSafe && batteryIsSafe
              ? "success"
              : criticalBatteryCount > 0 || !smokeIsSafe
              ? "error"
              : "warning"
          }
        >
          {securityIsSafe && smokeIsSafe && batteryIsSafe
            ? "Maison sécurisée : aucune ouverture, aucune alerte fumée et aucune batterie faible."
            : `DomoCenter signale ${dashboardData.security.openSensors} ouverture active, ${dashboardData.smoke.alerts} alerte fumée, ${lowBatteryCount} batterie faible et ${criticalBatteryCount} batterie critique.`}
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
                dashboardData.cameras.online ===
                dashboardData.cameras.total
                  ? "Toutes en ligne"
                  : "Une caméra hors ligne"
              }
              statusColor={
                dashboardData.cameras.online ===
                dashboardData.cameras.total
                  ? "success"
                  : "warning"
              }
            />
          </Grid>
        </Grid>

        <BatteryAlerts batteries={dashboardData.batteries} />

        <Alert severity="info">
          Les valeurs affichées sont encore simulées. Elles seront ensuite
          remplacées par les vraies données Home Assistant.
        </Alert>
      </Stack>
    </Box>
  );
}

export default Dashboard;

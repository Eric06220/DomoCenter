import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import SystemStatusCard from "../components/dashboard/SystemStatusCard";
import useHomeAssistant from "../hooks/useHomeAssistant";

function SupervisionPage() {
  const {
    dashboard,
    refreshing,
    error,
    refreshDashboard,
  } = useHomeAssistant(10000);

  async function handleRefresh() {
    try {
      await refreshDashboard();
    } catch {
      // Le hook gère déjà le message d’erreur.
    }
  }

  const batteries =
    dashboard?.batteries?.batteries ?? [];

  const lowBatteries =
    batteries.filter(
      (battery) =>
        battery.status === "low"
    );

  const criticalBatteries =
    batteries.filter(
      (battery) =>
        battery.status === "critical"
    );

  const waterLeakSensors =
    dashboard
      ?.security
      ?.waterLeaks
      ?.sensors ?? [];

  const activeWaterLeaks =
    waterLeakSensors.filter(
      (sensor) =>
        sensor.available === true &&
        sensor.leakDetected === true
    );

  const smokeDetectors =
    dashboard
      ?.security
      ?.smoke
      ?.detectors ?? [];

  const activeSmokeAlerts =
    smokeDetectors.filter(
      (detector) =>
        detector.smokeDetected === true
    );

  const totalActiveAlerts =
    lowBatteries.length +
    criticalBatteries.length +
    activeWaterLeaks.length +
    activeSmokeAlerts.length;

  return (
    <Box
      sx={{
        p: {
          xs: 2,
          md: 3,
        },
      }}
    >
      <Stack spacing={3}>
        <Box>
          <Typography
            variant="h4"
            fontWeight={800}
          >
            Supervision
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
          >
            Santé du système et alertes DomoCenter
          </Typography>
        </Box>

        {error && (
          <Alert severity="error">
            Impossible de récupérer les données : {error}
          </Alert>
        )}

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={1}
                alignItems={{
                  xs: "flex-start",
                  sm: "center",
                }}
                justifyContent="space-between"
              >
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={800}
                  >
                    🚨 Alertes DomoCenter
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    État actuel des alertes de sécurité et de maintenance
                  </Typography>
                </Box>

                <Chip
                  label={
                    totalActiveAlerts === 0
                      ? "Aucune alerte"
                      : `${totalActiveAlerts} alerte${
                          totalActiveAlerts > 1
                            ? "s"
                            : ""
                        }`
                  }
                  color={
                    activeSmokeAlerts.length > 0 ||
                    activeWaterLeaks.length > 0 ||
                    criticalBatteries.length > 0
                      ? "error"
                      : totalActiveAlerts > 0
                      ? "warning"
                      : "success"
                  }
                />
              </Stack>

              <Divider />

              {totalActiveAlerts === 0 && (
                <Alert severity="success">
                  Aucun problème détecté par DomoCenter.
                </Alert>
              )}

              {criticalBatteries.map(
                (battery) => (
                  <Alert
                    key={battery.id}
                    severity="error"
                  >
                    <Typography fontWeight={800}>
                      🔴 Batterie critique — {battery.name}
                    </Typography>

                    <Typography variant="body2">
                      {battery.location ||
                        "Emplacement inconnu"}{" "}
                      — {Math.round(battery.level)} %
                    </Typography>
                  </Alert>
                )
              )}

              {lowBatteries.map(
                (battery) => (
                  <Alert
                    key={battery.id}
                    severity="warning"
                  >
                    <Typography fontWeight={800}>
                      🟠 Batterie faible — {battery.name}
                    </Typography>

                    <Typography variant="body2">
                      {battery.location ||
                        "Emplacement inconnu"}{" "}
                      — {Math.round(battery.level)} %
                    </Typography>
                  </Alert>
                )
              )}

              {activeWaterLeaks.map(
                (sensor) => (
                  <Alert
                    key={sensor.id}
                    severity="error"
                  >
                    <Typography fontWeight={800}>
                      💧 Fuite d’eau — {sensor.name}
                    </Typography>

                    <Typography variant="body2">
                      {sensor.location ||
                        "Emplacement inconnu"}
                    </Typography>
                  </Alert>
                )
              )}

              {activeSmokeAlerts.map(
                (detector) => (
                  <Alert
                    key={detector.id}
                    severity="error"
                  >
                    <Typography fontWeight={800}>
                      🔥 Fumée détectée — {detector.name}
                    </Typography>

                    <Typography variant="body2">
                      {detector.location ||
                        "Emplacement inconnu"}
                    </Typography>
                  </Alert>
                )
              )}
            </Stack>
          </CardContent>
        </Card>

        <SystemStatusCard
          dashboard={dashboard}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      </Stack>
    </Box>
  );
}

export default SupervisionPage;

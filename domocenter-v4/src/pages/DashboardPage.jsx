import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloudDoneRoundedIcon from "@mui/icons-material/CloudDoneRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SensorsRoundedIcon from "@mui/icons-material/SensorsRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import ClimateSection from "../components/dashboard/ClimateSection";
import OpeningSection from "../components/dashboard/OpeningSection";
import useHomeAssistant from "../hooks/useHomeAssistant";

import EnergySection from "../components/dashboard/EnergySection";
import InfrastructureSection from "../components/dashboard/InfrastructureSection";

function formatRelativeTime(timestamp) {
  if (!timestamp) {
    return "date inconnue";
  }

  const timestampMs = new Date(timestamp).getTime();

  if (!Number.isFinite(timestampMs)) {
    return "date inconnue";
  }

  const elapsedSeconds = Math.max(
    0,
    Math.floor((Date.now() - timestampMs) / 1000)
  );

  if (elapsedSeconds < 60) {
    return `il y a ${elapsedSeconds} seconde${
      elapsedSeconds > 1 ? "s" : ""
    }`;
  }

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);

  if (elapsedMinutes < 60) {
    return `il y a ${elapsedMinutes} minute${
      elapsedMinutes > 1 ? "s" : ""
    }`;
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60);

  return `il y a ${elapsedHours} heure${
    elapsedHours > 1 ? "s" : ""
  }`;
}

function SystemStatusCard({
  dashboard,
  refreshing,
  onRefresh,
}) {
  const system = dashboard?.system;
  const homeAssistant = system?.homeAssistant;
  const tuya = system?.tuya;
  const cache = system?.cache;

  const homeAssistantConnected = Boolean(
    homeAssistant?.connected
  );

  const unavailableCount =
    homeAssistant?.unavailableEntityCount ?? 0;

  const tuyaLastUpdate = tuya?.latestDataUpdate ?? null;

  return (
    <Card>
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={2.5}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "stretch", md: "center" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography variant="h6" fontWeight={800}>
                État des services
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Supervision de Home Assistant et de la synchronisation Tuya
              </Typography>
            </Box>

            <Button
              variant="outlined"
              startIcon={<RefreshRoundedIcon />}
              onClick={onRefresh}
              disabled={refreshing}
            >
              {refreshing ? "Synchronisation..." : "Synchroniser"}
            </Button>
          </Stack>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 3,
                    bgcolor: homeAssistantConnected
                      ? "success.main"
                      : "error.main",
                    color: "white",
                    flexShrink: 0,
                  }}
                >
                  <CloudDoneRoundedIcon />
                </Box>

                <Box>
                  <Typography fontWeight={800}>
                    Home Assistant
                  </Typography>

                  <Typography
                    variant="body2"
                    color={
                      homeAssistantConnected
                        ? "success.main"
                        : "error.main"
                    }
                  >
                    {homeAssistantConnected
                      ? "Connecté"
                      : "Inaccessible"}
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 3,
                    bgcolor: "success.main",
                    color: "white",
                    flexShrink: 0,
                  }}
                >
                  <CheckCircleRoundedIcon />
                </Box>

                <Box>
                  <Typography fontWeight={800}>
                    Tuya
                  </Typography>

                  <Typography variant="body2" color="success.main">
                    Synchronisé {formatRelativeTime(tuyaLastUpdate)}
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 3,
                    bgcolor:
                      unavailableCount > 0
                        ? "warning.main"
                        : "primary.main",
                    color: "white",
                    flexShrink: 0,
                  }}
                >
                  {unavailableCount > 0 ? (
                    <WarningAmberRoundedIcon />
                  ) : (
                    <SensorsRoundedIcon />
                  )}
                </Box>

                <Box>
                  <Typography fontWeight={800}>
                    Entités
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {homeAssistant?.entityCount ?? 0} au total ·{" "}
                    {unavailableCount} indisponible
                    {unavailableCount > 1 ? "s" : ""}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>

          <Typography variant="caption" color="text.secondary">
            Cache DomoCenter :{" "}
            {cache?.fromCache ? "données en cache" : "données fraîches"} ·
            durée {cache?.durationSeconds ?? 10} secondes
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

function DashboardPage() {
  const {
    dashboard,
    loading,
    refreshing,
    error,
    refreshDashboard,
  } = useHomeAssistant(10000);

  const climateZones = dashboard?.climate?.zones ?? [];
  const openings = dashboard?.security?.openings ?? null;
  const energy = dashboard?.energy ?? null;
  const infrastructure = dashboard?.infrastructure ?? null;


  async function handleRefresh() {
    try {
      await refreshDashboard();
    } catch {
      // Le message d'erreur est déjà géré par le hook.
    }
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Typography variant="h4" fontWeight={800}>
              Dashboard
            </Typography>

            <Typography variant="body1" color="text.secondary">
              Vue d’ensemble des données réelles de la maison
            </Typography>
          </Box>

          <Chip
            icon={<CheckCircleRoundedIcon />}
            label="DomoCenter opérationnel"
            color="success"
            variant="outlined"
          />
        </Stack>

        {error && (
          <Alert severity="error">
            Impossible de récupérer les données du Dashboard : {error}
          </Alert>
        )}

        {!error && dashboard && (
          <Alert severity="success">
            Les données sont centralisées par l’API DomoCenter.
          </Alert>
        )}

        <SystemStatusCard
          dashboard={dashboard}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />

        <ClimateSection
          zones={climateZones}
          loading={loading}
        />

        <OpeningSection
          openings={openings}
          loading={loading}
        />

        <EnergySection
          energy={energy}
          loading={loading}
        />
        <InfrastructureSection
          infrastructure={infrastructure}
          loading={loading}
        />
        
        <Typography variant="body2" color="text.secondary">
          Le climat et les ouvertures utilisent l’API centralisée
          DomoCenter. L’énergie, l’éclairage et les caméras seront ajoutés
          ensuite.
        </Typography>
      </Stack>
    </Box>
  );
}

export default DashboardPage;
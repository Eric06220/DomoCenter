import {
  Alert,
  Box,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import ClimateSection from "../components/dashboard/ClimateSection";
import EnergySection from "../components/dashboard/EnergySection";
import InfrastructureSection from "../components/dashboard/InfrastructureSection";
import OpeningSection from "../components/dashboard/OpeningSection";
import SystemStatusCard from "../components/dashboard/SystemStatusCard";
import useHomeAssistant from "../hooks/useHomeAssistant";

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
  const infrastructure =
    dashboard?.infrastructure ?? null;

  async function handleRefresh() {
    try {
      await refreshDashboard();
    } catch {
      // Le message d’erreur est déjà géré par le hook.
    }
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{
            xs: "flex-start",
            md: "center",
          }}
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Typography variant="h4" fontWeight={800}>
              Dashboard
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
            >
              Vue d’ensemble des données réelles de la
              maison
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
            Impossible de récupérer les données du
            Dashboard : {error}
          </Alert>
        )}

        {!error && dashboard && (
          <Alert severity="success">
            Les données sont centralisées par l’API
            DomoCenter.
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

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Le climat, les ouvertures, l’énergie et
          l’infrastructure utilisent l’API centralisée
          DomoCenter. L’éclairage et les caméras seront
          ajoutés ensuite.
        </Typography>
      </Stack>
    </Box>
  );
}

export default DashboardPage;

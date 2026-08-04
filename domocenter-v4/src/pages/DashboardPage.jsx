import {
  Alert,
  Box,
  Button,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import MonitorHeartRoundedIcon from "@mui/icons-material/MonitorHeartRounded";
import { Link as RouterLink } from "react-router-dom";

import ClimateSection from "../components/dashboard/ClimateSection";
import EnergySection from "../components/dashboard/EnergySection";
import InfrastructureSection from "../components/dashboard/InfrastructureSection";
import OpeningSection from "../components/dashboard/OpeningSection";
import useHomeAssistant from "../hooks/useHomeAssistant";

function DashboardPage() {
  const {
    dashboard,
    loading,
    error,
  } = useHomeAssistant(10000);

  const climateZones = dashboard?.climate?.zones ?? [];
  const openings = dashboard?.security?.openings ?? null;
  const energy = dashboard?.energy ?? null;
  const infrastructure =
    dashboard?.infrastructure ?? null;

  const services = dashboard?.services;

  const supervisionHealthy =
    services?.homeAssistant?.online !== false &&
    services?.domoCenter?.online !== false &&
    services?.tuya?.online !== false &&
    services?.internet?.online !== false;

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

        <Alert
          severity={supervisionHealthy ? "success" : "warning"}
          icon={<MonitorHeartRoundedIcon />}
          action={
            <Button
              component={RouterLink}
              to="/supervision"
              color="inherit"
              size="small"
            >
              Ouvrir
            </Button>
          }
        >
          {supervisionHealthy
            ? "La supervision technique est opérationnelle."
            : "Un élément de supervision nécessite votre attention."}
        </Alert>

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
          DomoCenter. La supervision détaillée est disponible
          dans sa page dédiée.
        </Typography>
      </Stack>
    </Box>
  );
}

export default DashboardPage;

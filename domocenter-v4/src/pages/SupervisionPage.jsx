import { Box, Stack, Typography } from "@mui/material";

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

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Supervision
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Santé du Raspberry Pi et état des services DomoCenter
          </Typography>
        </Box>

        {error && (
          <Typography color="error">
            Impossible de récupérer les données : {error}
          </Typography>
        )}

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

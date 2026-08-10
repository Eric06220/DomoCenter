import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ComputerRoundedIcon from "@mui/icons-material/ComputerRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";

import { Link as RouterLink } from "react-router-dom";

import SectionCard from "../common/SectionCard";

function SystemSummary({
  services,
  loading = false,
}) {
  const serviceList = [
    services?.homeAssistant,
    services?.domoCenter,
    services?.tuya,
    services?.internet,
  ].filter(Boolean);

  const servicesAvailable = serviceList.length > 0;

  const healthy =
    servicesAvailable &&
    serviceList.every(
      (service) => service.online !== false
    );

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        height: "100%",
      }}
    >
      <SectionCard
        title="Système"
        icon={<ComputerRoundedIcon />}
      >
        {loading ? (
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Chargement de l’état système…
          </Typography>
        ) : !servicesAvailable ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={1}
            sx={{
              minHeight: 90,
            }}
          >
            <ErrorRoundedIcon
              sx={{
                fontSize: 36,
                color: "text.secondary",
              }}
            />

            <Typography
              variant="body1"
              fontWeight={700}
              color="text.secondary"
            >
              État inconnu
            </Typography>
          </Stack>
        ) : healthy ? (
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
          >
            <CheckCircleRoundedIcon
              sx={{
                color: "success.main",
                fontSize: 20,
              }}
            />

            <Typography variant="body1">
              Tous les services sont opérationnels.
            </Typography>
          </Stack>
        ) : (
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={0.75}
            sx={{
              minHeight: 90,
            }}
          >
            <ErrorRoundedIcon
              sx={{
                fontSize: 42,
                color: "error.main",
              }}
            />

            <Typography
              variant="h6"
              fontWeight={800}
              color="error.main"
            >
              KO
            </Typography>

            <Button
              component={RouterLink}
              to="/supervision"
              color="error"
              size="small"
            >
              Voir Supervision
            </Button>
          </Stack>
        )}
      </SectionCard>
    </Box>
  );
}

export default SystemSummary;

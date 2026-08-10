import {
  Alert,
  Box,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import BatterySummary from "../components/dashboard/BatterySummary";
import CameraSummary from "../components/dashboard/CameraSummary";
import ClimateSection from "../components/dashboard/ClimateSection";
import EnergySummary from "../components/dashboard/EnergySummary";
import LightingSummary from "../components/dashboard/LightingSummary";
import OpeningSection from "../components/dashboard/OpeningSection";
import SmokeSummary from "../components/dashboard/SmokeSummary";
import SystemSummary from "../components/dashboard/SystemSummary";
import WaterLeakSummary from "../components/dashboard/WaterLeakSummary";
import useHomeAssistant from "../hooks/useHomeAssistant";

function DashboardPage() {
  const {
    dashboard,
    loading,
    error,
  } = useHomeAssistant(10000);

  const climateZones =
    dashboard?.climate?.zones ?? [];

  const openings =
    dashboard?.security?.openings ?? null;

  const waterLeaks =
    dashboard?.security?.waterLeaks ?? null;

  const smoke =
    dashboard?.security?.smoke ?? null;

  const lighting =
    dashboard?.lighting ?? null;

  const energy =
    dashboard?.energy ?? null;

  const services =
    dashboard?.services ?? null;

  const cameras =
    dashboard?.cameras ?? null;

  const batteries =
    dashboard?.batteries ?? null;

  const supervisionHealthy =
    services?.homeAssistant?.online !== false &&
    services?.domoCenter?.online !== false &&
    services?.tuya?.online !== false &&
    services?.internet?.online !== false;

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
        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          alignItems={{
            xs: "flex-start",
            md: "center",
          }}
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
            >
              Dashboard
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
            >
              Vue d’ensemble de la maison
            </Typography>
          </Box>

          <Chip
            icon={<CheckCircleRoundedIcon />}
            label={
              supervisionHealthy
                ? "DomoCenter opérationnel"
                : "Attention requise"
            }
            color={
              supervisionHealthy
                ? "success"
                : "warning"
            }
            variant="outlined"
          />
        </Stack>

        {error && (
          <Alert severity="error">
            Impossible de récupérer les données du Dashboard :{" "}
            {error}
          </Alert>
        )}

        <ClimateSection
          zones={climateZones}
          loading={loading}
        />

        <Grid
          container
          spacing={2}
          alignItems="stretch"
        >
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
            sx={{
              display: "flex",
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                width: "100%",
                minWidth: 0,
              }}
            >
              <OpeningSection
                openings={openings}
                loading={loading}
              />
            </Box>
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
            sx={{
              display: "flex",
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                width: "100%",
                minWidth: 0,
              }}
            >
              <LightingSummary
                lighting={lighting}
                loading={loading}
              />
            </Box>
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
            sx={{
              display: "flex",
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                width: "100%",
                minWidth: 0,
              }}
            >
              <EnergySummary
                energy={energy}
                loading={loading}
              />
            </Box>
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
            sx={{
              display: "flex",
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                width: "100%",
                minWidth: 0,
              }}
            >
              <SystemSummary
                services={services}
                loading={loading}
              />
            </Box>
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
            sx={{
              display: "flex",
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                width: "100%",
                minWidth: 0,
              }}
            >
              <WaterLeakSummary
                waterLeaks={waterLeaks}
                loading={loading}
              />
            </Box>
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
            sx={{
              display: "flex",
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                width: "100%",
                minWidth: 0,
              }}
            >
              <SmokeSummary
                smoke={smoke}
                loading={loading}
              />
            </Box>
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
            sx={{
              display: "flex",
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                width: "100%",
                minWidth: 0,
              }}
            >
              <CameraSummary
                cameras={cameras}
                loading={loading}
              />
            </Box>
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
            sx={{
              display: "flex",
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                width: "100%",
                minWidth: 0,
              }}
            >
              <BatterySummary
                batteries={batteries}
                loading={loading}
              />
            </Box>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}

export default DashboardPage;

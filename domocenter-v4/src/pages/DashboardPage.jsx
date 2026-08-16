import {
  useEffect,
  useState,
} from "react";

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
import ClimateControlSummary from "../components/dashboard/ClimateControlSummary";
import ClimateSection from "../components/dashboard/ClimateSection";
import EnergySummary from "../components/dashboard/EnergySummary";
import HouseModeSummary from "../components/dashboard/HouseModeSummary";
import LightingSummary from "../components/dashboard/LightingSummary";
import OpeningSection from "../components/dashboard/OpeningSection";
import SmokeSummary from "../components/dashboard/SmokeSummary";
import SystemSummary from "../components/dashboard/SystemSummary";
import WaterLeakSummary from "../components/dashboard/WaterLeakSummary";

import useHomeAssistant from "../hooks/useHomeAssistant";

import {
  getHouseMode,
  setHouseMode,
} from "../services/homeAssistantApi";

function DashboardPage() {
  const {
    dashboard,
    loading,
    error,
  } = useHomeAssistant(10000);

  const [
    houseMode,
    setHouseModeState,
  ] = useState("present");

  const [
    houseModeLoading,
    setHouseModeLoading,
  ] = useState(true);

  const [
    houseModeChanging,
    setHouseModeChanging,
  ] = useState(false);

  const [
    houseModeError,
    setHouseModeError,
  ] = useState("");

  useEffect(() => {
    let active = true;

    async function loadHouseMode() {
      try {
        setHouseModeError("");

        const result =
          await getHouseMode();

        if (!active) {
          return;
        }

        setHouseModeState(
          result?.current?.mode ??
            "present"
        );
      } catch (caughtError) {
        if (!active) {
          return;
        }

        setHouseModeError(
          caughtError instanceof Error
            ? caughtError.message
            : "Impossible de récupérer le mode maison."
        );
      } finally {
        if (active) {
          setHouseModeLoading(false);
        }
      }
    }

    loadHouseMode();

    return () => {
      active = false;
    };
  }, []);

  async function handleHouseModeChange(
    mode
  ) {
    if (
      houseModeChanging ||
      mode === houseMode
    ) {
      return;
    }

    try {
      setHouseModeChanging(true);
      setHouseModeError("");

      const result =
        await setHouseMode(mode);

      setHouseModeState(
        result?.current?.mode ??
          mode
      );
    } catch (caughtError) {
      setHouseModeError(
        caughtError instanceof Error
          ? caughtError.message
          : "Impossible de modifier le mode maison."
      );
    } finally {
      setHouseModeChanging(false);
    }
  }

  const climateZones =
    dashboard?.climate?.zones ?? [];

  const climateControl =
    dashboard?.climateControl ?? null;

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

  const gridItemSx = {
    display: "flex",
    minWidth: 0,
  };

  const cardWrapperSx = {
    width: "100%",
    minWidth: 0,
  };

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

        {/* MODE MAISON */}

        <HouseModeSummary
          mode={houseMode}
          loading={houseModeLoading}
          changing={houseModeChanging}
          error={houseModeError}
          onChange={
            handleHouseModeChange
          }
        />

        {/* CLIMAT - PLEINE LARGEUR */}

        <ClimateSection
          zones={climateZones}
          loading={loading}
        />

        {/* LIGNE PRINCIPALE :
            CLIMATISATION À GAUCHE
            OUVERTURES + ÉCLAIRAGE À DROITE */}

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
            sx={gridItemSx}
          >
            <Box
              sx={{
                ...cardWrapperSx,
                display: "flex",

                "& > *": {
                  width: "100%",
                },
              }}
            >
              <ClimateControlSummary
                climateControl={climateControl}
                loading={loading}
              />
            </Box>
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
            sx={gridItemSx}
          >
            <Stack
              spacing={2}
              sx={cardWrapperSx}
            >
              <OpeningSection
                openings={openings}
                loading={loading}
              />

              <LightingSummary
                lighting={lighting}
                loading={loading}
              />
            </Stack>
          </Grid>

          {/* FUMÉE */}

          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
            sx={gridItemSx}
          >
            <Box sx={cardWrapperSx}>
              <SmokeSummary
                smoke={smoke}
                loading={loading}
              />
            </Box>
          </Grid>

          {/* INONDATION */}

          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
            sx={gridItemSx}
          >
            <Box sx={cardWrapperSx}>
              <WaterLeakSummary
                waterLeaks={waterLeaks}
                loading={loading}
              />
            </Box>
          </Grid>

          {/* CAMÉRAS */}

          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
            sx={gridItemSx}
          >
            <Box sx={cardWrapperSx}>
              <CameraSummary
                cameras={cameras}
                loading={loading}
              />
            </Box>
          </Grid>

          {/* ÉNERGIE */}

          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
            sx={gridItemSx}
          >
            <Box sx={cardWrapperSx}>
              <EnergySummary
                energy={energy}
                loading={loading}
              />
            </Box>
          </Grid>

          {/* BATTERIES */}

          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
            sx={gridItemSx}
          >
            <Box sx={cardWrapperSx}>
              <BatterySummary
                batteries={batteries}
                loading={loading}
              />
            </Box>
          </Grid>

          {/* SYSTÈME */}

          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
            sx={gridItemSx}
          >
            <Box sx={cardWrapperSx}>
              <SystemSummary
                services={services}
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

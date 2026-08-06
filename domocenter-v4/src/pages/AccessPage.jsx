import { useCallback, useEffect, useState } from "react";

import {
  Alert,
  Box,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import DeviceHeader from "../components/devices/DeviceHeader";
import OpeningList from "../components/access/OpeningList";
import PortalCard from "../components/access/PortalCard";

import {
  getAccessData,
  triggerPortal,
} from "../services/homeAssistantApi";

const REFRESH_INTERVAL_MS = 10_000;

function AccessPage() {
  const [accessData, setAccessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [portalPending, setPortalPending] = useState(false);
  const [error, setError] = useState("");
  const [commandMessage, setCommandMessage] = useState("");

  const loadAccessData = useCallback(
    async ({ silent = false } = {}) => {
      try {
        if (silent) {
          setRefreshing(true);
        }

        setError("");

        const nextData = await getAccessData();
        setAccessData(nextData);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Impossible de récupérer les accès."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    loadAccessData();

    const timer = window.setInterval(() => {
      loadAccessData({ silent: true });
    }, REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [loadAccessData]);

  async function handleTriggerPortal() {
    if (portalPending) {
      return;
    }

    try {
      setPortalPending(true);
      setError("");
      setCommandMessage("");

      await triggerPortal();

      setCommandMessage(
        "La commande du portail a été envoyée."
      );

      await loadAccessData({ silent: true });
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Impossible de commander le portail."
      );
    } finally {
      setPortalPending(false);
    }
  }

  const openings = accessData?.openings;
  const sensors = openings?.sensors ?? [];

  const openCount = openings?.open ?? 0;
  const unavailableCount =
    openings?.unavailable ?? 0;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack spacing={3}>
        <DeviceHeader
          title="Accès"
          subtitle="Surveillance des ouvertures et commande du portail"
          active={openCount}
          unavailable={unavailableCount}
        />

        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        {commandMessage && !error && (
          <Alert severity="success">
            {commandMessage}
          </Alert>
        )}

        {loading && !accessData ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={2}
            sx={{ py: 8 }}
          >
            <CircularProgress />

            <Typography color="text.secondary">
              Chargement des accès…
            </Typography>
          </Stack>
        ) : (
          <Stack spacing={3}>
            <PortalCard
              portal={accessData?.portal}
              pending={portalPending}
              onTrigger={handleTriggerPortal}
            />

            <OpeningList
              sensors={sensors}
              openCount={openCount}
            />

            {refreshing && (
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Synchronisation en cours…
              </Typography>
            )}
          </Stack>
        )}

        {!loading &&
          !error &&
          sensors.length === 0 && (
            <Alert severity="warning">
              Aucun détecteur d’ouverture n’est configuré.
            </Alert>
          )}

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Le portail est commandé par une impulsion. Son
          état ouvert ou fermé n’est pas déduit du relais.
          Les ouvertures sont actualisées automatiquement
          toutes les dix secondes.
        </Typography>
      </Stack>
    </Box>
  );
}

export default AccessPage;

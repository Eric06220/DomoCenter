import { useCallback, useEffect, useState } from "react";

import {
  getDashboardData,
  refreshDashboardData,
} from "../services/homeAssistantApi";

function useHomeAssistant(refreshInterval = 10000) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setError("");

      const nextDashboard = await getDashboardData();
      setDashboard(nextDashboard);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Erreur inconnue lors de la récupération du Dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshDashboard = useCallback(async () => {
    try {
      setRefreshing(true);
      setError("");

      const nextDashboard = await refreshDashboardData();
      setDashboard(nextDashboard);

      return nextDashboard;
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Erreur inconnue lors de la synchronisation.";

      setError(message);
      throw caughtError;
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();

    const timer = window.setInterval(
      loadDashboard,
      refreshInterval
    );

    return () => {
      window.clearInterval(timer);
    };
  }, [loadDashboard, refreshInterval]);

  return {
    dashboard,
    loading,
    refreshing,
    error,
    refreshDashboard,
  };
}

export default useHomeAssistant;
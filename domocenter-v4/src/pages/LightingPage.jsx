import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DeckRoundedIcon from "@mui/icons-material/DeckRounded";
import ForestRoundedIcon from "@mui/icons-material/ForestRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import PoolRoundedIcon from "@mui/icons-material/PoolRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import DeviceGroup from "../components/devices/DeviceGroup";
import DeviceHeader from "../components/devices/DeviceHeader";
import useHomeAssistant from "../hooks/useHomeAssistant";
import {
  setLightingDeviceState,
} from "../services/homeAssistantApi";

const COMMAND_REFRESH_DELAY_MS = 700;

const GROUP_CONFIGURATION = {
  Piscine: {
    order: 1,
    icon: <PoolRoundedIcon />,
  },
  Maison: {
    order: 2,
    icon: <HomeRoundedIcon />,
  },
  Jardin: {
    order: 3,
    icon: <ForestRoundedIcon />,
  },
  Allée: {
    order: 4,
    icon: <ForestRoundedIcon />,
  },
  Extérieur: {
    order: 5,
    icon: <DeckRoundedIcon />,
  },
};

function wait(delayMs) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, delayMs);
  });
}

function getGroupConfiguration(location) {
  return (
    GROUP_CONFIGURATION[location] ?? {
      order: 99,
      icon: <LightbulbRoundedIcon />,
    }
  );
}

function addIds(currentIds, nextIds) {
  return Array.from(
    new Set([...currentIds, ...nextIds])
  );
}

function removeIds(currentIds, removedIds) {
  const removedIdSet = new Set(removedIds);

  return currentIds.filter(
    (deviceId) => !removedIdSet.has(deviceId)
  );
}

function LightingPage() {
  const {
    dashboard,
    loading,
    refreshing,
    error,
    refreshDashboard,
  } = useHomeAssistant(10000);

  const [pendingDeviceIds, setPendingDeviceIds] =
    useState([]);

  const [pendingGroupNames, setPendingGroupNames] =
    useState([]);

  const [optimisticStates, setOptimisticStates] =
    useState({});

  const [commandError, setCommandError] =
    useState("");

  const lighting = dashboard?.lighting;
  const devices = lighting?.devices ?? [];

  useEffect(() => {
    setOptimisticStates((currentStates) => {
      let changed = false;
      const nextStates = { ...currentStates };

      devices.forEach((device) => {
        const hasOptimisticState =
          Object.prototype.hasOwnProperty.call(
            nextStates,
            device.id
          );

        const commandPending =
          pendingDeviceIds.includes(device.id);

        if (
          hasOptimisticState &&
          !commandPending &&
          nextStates[device.id] === device.isOn
        ) {
          delete nextStates[device.id];
          changed = true;
        }
      });

      return changed
        ? nextStates
        : currentStates;
    });
  }, [devices, pendingDeviceIds]);

  const displayedDevices = useMemo(
    () =>
      devices.map((device) => ({
        ...device,
        displayedIsOn:
          optimisticStates[device.id] ??
          device.isOn,
      })),
    [devices, optimisticStates]
  );

  const groups = useMemo(() => {
    const groupedDevices = new Map();

    displayedDevices.forEach((device) => {
      const groupName =
        device.group || "Autres";

      const currentGroup =
        groupedDevices.get(groupName) ?? [];

      currentGroup.push(device);

      currentGroup.sort(
        (a, b) => a.order - b.order
      );
      
      groupedDevices.set(
        groupName,
        currentGroup
      );
    });

    return Array.from(
      groupedDevices.entries()
    )
      .map(([name, groupDevices]) => ({
        name,
        devices: groupDevices,
        ...getGroupConfiguration(name),
      }))
      .sort(
        (firstGroup, secondGroup) =>
          firstGroup.order - secondGroup.order
      );
  }, [displayedDevices]);

  const activeDevices = displayedDevices.filter(
    (device) =>
      device.available && device.displayedIsOn
  ).length;

  const unavailableDevices =
    lighting?.unavailableCount ?? 0;

  function setOptimisticState(deviceIds, isOn) {
    setOptimisticStates((currentStates) => {
      const nextStates = { ...currentStates };

      deviceIds.forEach((deviceId) => {
        nextStates[deviceId] = isOn;
      });

      return nextStates;
    });
  }

  function removeOptimisticStates(deviceIds) {
    setOptimisticStates((currentStates) => {
      const nextStates = { ...currentStates };

      deviceIds.forEach((deviceId) => {
        delete nextStates[deviceId];
      });

      return nextStates;
    });
  }

  async function synchronizeDashboard() {
    await wait(COMMAND_REFRESH_DELAY_MS);
    await refreshDashboard();
  }

  async function handleToggleDevice(device) {
    if (
      !device.available ||
      pendingDeviceIds.includes(device.id)
    ) {
      return;
    }

    const nextIsOn = !device.displayedIsOn;

    setCommandError("");
    setOptimisticState(
      [device.id],
      nextIsOn
    );

    setPendingDeviceIds((currentIds) =>
      addIds(currentIds, [device.id])
    );

    try {
      await setLightingDeviceState(
        device.id,
        nextIsOn
      );

      await synchronizeDashboard();
    } catch (caughtError) {
      removeOptimisticStates([device.id]);

      setCommandError(
        caughtError instanceof Error
          ? caughtError.message
          : `Impossible de commander ${device.name}.`
      );

      try {
        await refreshDashboard();
      } catch {
        // Le hook expose déjà l’erreur de synchronisation.
      }
    } finally {
      setPendingDeviceIds((currentIds) =>
        removeIds(currentIds, [device.id])
      );
    }
  }

  async function handleSetGroupState(
    groupDevices,
    nextIsOn
  ) {
    const availableDevices =
      groupDevices.filter(
        (device) =>
          device.available &&
          !pendingDeviceIds.includes(device.id)
      );

    if (availableDevices.length === 0) {
      return;
    }

    const groupName =
      availableDevices[0].group || "Autres";

    const deviceIds = availableDevices.map(
      (device) => device.id
    );

    setCommandError("");
    setOptimisticState(deviceIds, nextIsOn);

    setPendingGroupNames((currentNames) =>
      addIds(currentNames, [groupName])
    );

    setPendingDeviceIds((currentIds) =>
      addIds(currentIds, deviceIds)
    );

    const results = await Promise.allSettled(
      availableDevices.map((device) =>
        setLightingDeviceState(
          device.id,
          nextIsOn
        )
      )
    );

    const failedDeviceIds = results
      .map((result, index) => ({
        result,
        deviceId:
          availableDevices[index].id,
      }))
      .filter(
        ({ result }) =>
          result.status === "rejected"
      )
      .map(({ deviceId }) => deviceId);

    if (failedDeviceIds.length > 0) {
      removeOptimisticStates(
        failedDeviceIds
      );

      setCommandError(
        `${failedDeviceIds.length} commande${
          failedDeviceIds.length > 1 ? "s ont" : " a"
        } échoué dans la zone ${groupName}.`
      );
    }

    try {
      await synchronizeDashboard();
    } catch {
      setCommandError(
        "Les commandes ont été envoyées, mais la synchronisation avec Home Assistant a échoué."
      );
    } finally {
      setPendingDeviceIds((currentIds) =>
        removeIds(currentIds, deviceIds)
      );

      setPendingGroupNames((currentNames) =>
        removeIds(currentNames, [groupName])
      );
    }
  }


  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack spacing={3}>
        
        <DeviceHeader
          title="Éclairage"
          subtitle="Pilotage des éclairages et prises commandées, regroupés par zone"
          active={activeDevices}
          unavailable={unavailableDevices}
        />
          
        {error && (
          <Alert severity="error">
            Impossible de récupérer les équipements
            d’éclairage : {error}
          </Alert>
        )}

        {commandError && (
          <Alert severity="error">
            {commandError}
          </Alert>
        )}

        {!error && !commandError && (
          <Alert severity="success">
            Les équipements sont connectés à Home
            Assistant et peuvent être commandés depuis
            DomoCenter.
          </Alert>
        )}

        {loading && !dashboard ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={2}
            sx={{ py: 8 }}
          >
            <CircularProgress />

            <Typography color="text.secondary">
              Chargement des équipements…
            </Typography>
          </Stack>
        ) : (
          <Stack spacing={3}>
            {groups.map((group) => (
              <Paper
                key={group.name}
                variant="outlined"
                sx={{ p: { xs: 2, md: 2.5 } }}
              >
                <DeviceGroup
                  title={group.name}
                  icon={group.icon}
                  devices={group.devices}
                  pendingDeviceIds={
                    pendingDeviceIds
                  }
                  controlsDisabled={refreshing}
                  groupPending={pendingGroupNames.includes(
                    group.name
                  )}
                  onToggleDevice={
                    handleToggleDevice
                  }
                  onSetAll={
                    handleSetGroupState
                  }
                />
              </Paper>
            ))}
          </Stack>
        )}

        {!loading &&
          !error &&
          groups.length === 0 && (
            <Alert severity="warning">
              Aucun équipement d’éclairage n’est configuré
              dans l’API DomoCenter.
            </Alert>
          )}

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Les commandes sont affichées immédiatement, puis
          vérifiées auprès de Home Assistant. Les états sont
          également actualisés automatiquement toutes les
          dix secondes.
        </Typography>
      </Stack>
    </Box>
  );
}

export default LightingPage;

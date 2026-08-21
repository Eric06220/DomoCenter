const packageJson = require("../package.json");

function createDashboardService({
  homeAssistantService,
  entityConfiguration,
  getWindowsHealth,
  buildClimateData,
  buildClimateControlData,
  buildOpeningData,
  buildWaterLeakData,
  buildSmokeData,
  buildEnergyData,
  buildLightingData,
  buildCameraData,
  buildBatteryData,
  buildServicesStatus,
  buildTuyaHealth,
  getBatteryAlertStates,
  getWaterLeakAlertStates,
  getSmokeAlertStates,
  findEntity,
  isEntityAvailable,
  readNumericEntity,
  readSwitchEntity,
  cacheDurationMs = 10_000,
  homeAssistantUrl,
}) {
  let cache = {
    data: null,
    createdAt: 0,
  };

  function getLatestUpdateTimestamp(entities) {
    const timestamps = entities
      .map((entity) => entity.last_updated)
      .filter(Boolean)
      .map((timestamp) =>
        new Date(timestamp).getTime()
      )
      .filter(Number.isFinite);

    if (timestamps.length === 0) {
      return null;
    }

    return new Date(
      Math.max(...timestamps)
    ).toISOString();
  }

  function countUnavailableEntities(entities) {
    return entities.filter(
      (entity) =>
        entity.state === "unavailable" ||
        entity.state === "unknown"
    ).length;
  }

  function clearCache() {
    cache = {
      data: null,
      createdAt: 0,
    };
  }

  async function createDashboardData() {
    const entities =
      await homeAssistantService.getEntities();

    const windowsHealth =
      typeof getWindowsHealth === "function"
        ? await getWindowsHealth()
        : null;

    const generatedAt =
      new Date().toISOString();

    const latestUpdate =
      getLatestUpdateTimestamp(entities);

    const tuyaHealth =
      buildTuyaHealth({
        entities,
      });

    const climateZones = buildClimateData(
      entityConfiguration,
      entities,
      readNumericEntity
    );

    const openings = buildOpeningData(
      entityConfiguration,
      entities,
      findEntity,
      isEntityAvailable
    );

        const waterLeaks = buildWaterLeakData(
      entityConfiguration,
      entities,
      findEntity,
      isEntityAvailable
    );

    const waterLeakAlertStates =
      typeof getWaterLeakAlertStates ===
      "function"
        ? getWaterLeakAlertStates()
        : {};

    waterLeaks.sensors =
      waterLeaks.sensors.map(
        (sensor) => {
          const alertState =
            waterLeakAlertStates[
              sensor.id
            ];

          return {
            ...sensor,

            acknowledged:
              alertState?.acknowledged ===
              true,

            acknowledgedAt:
              alertState
                ?.acknowledgedAt ??
              null,
          };
        }
      );

    const smoke = buildSmokeData(
      entityConfiguration,
      entities,
      findEntity,
      isEntityAvailable
    );

    const smokeAlertStates =
      typeof getSmokeAlertStates ===
      "function"
        ? getSmokeAlertStates()
        : {};

    smoke.detectors =
      smoke.detectors.map(
        (detector) => {
          const alertState =
            smokeAlertStates[
              detector.id
            ];

          return {
            ...detector,

            acknowledged:
              alertState?.acknowledged ===
              true,

            acknowledgedAt:
              alertState
                ?.acknowledgedAt ??
              null,
            
            alertActive:
              alertState?.alertActive === true,
          };
        }
      );

        const batteryData =
      buildBatteryData({
        climateZones,
        openings,
        waterLeaks,
        smoke,
      });

    const batteryAlertStates =
      typeof getBatteryAlertStates ===
      "function"
        ? getBatteryAlertStates()
        : {};

    batteryData.batteries =
      batteryData.batteries.map(
        (battery) => {
          const alertState =
            batteryAlertStates[
              battery.id
            ];

          const latchedCritical =
            alertState
              ?.latchedCritical === true;

          return {
            ...battery,
            latchedCritical,

            status:
              latchedCritical
                ? "critical"
                : battery.status,
          };
        }
      );

    batteryData.ok =
      batteryData.batteries.filter(
        (battery) =>
          battery.status === "ok"
      ).length;

    batteryData.low =
      batteryData.batteries.filter(
        (battery) =>
          battery.status === "low"
      ).length;

    batteryData.critical =
      batteryData.batteries.filter(
        (battery) =>
          battery.status ===
          "critical"
      ).length;

    batteryData.unavailable =
      batteryData.batteries.filter(
        (battery) =>
          battery.status ===
          "unavailable"
      ).length;

    return {
      system: {
        domoCenter: {
          version: packageJson.version,
          uptimeSeconds:
            Math.floor(process.uptime()),
          startedAt: new Date(
            Date.now() -
              process.uptime() * 1000
          ).toISOString(),
        },

        homeAssistant: {
          connected: true,
          url: homeAssistantUrl,
          entityCount: entities.length,
          unavailableEntityCount:
            countUnavailableEntities(
              entities
            ),
        },

        tuya: {
          connected: true,
          latestDataUpdate:
            latestUpdate,
          health:
            tuyaHealth,
        },

        cache: {
          generatedAt,
          durationSeconds:
            cacheDurationMs / 1000,
        },
      },

      climate: {
        zones: climateZones,
      },

      security: {
        openings,
        waterLeaks,
        smoke,
      },

      batteries: batteryData,

      energy: buildEnergyData(
        entityConfiguration,
        entities,
        readNumericEntity,
        readSwitchEntity
      ),

      lighting: buildLightingData({
        lightingDevices:
          entityConfiguration
            .lightingDevices ?? [],
        entities,
        findEntity,
        isEntityAvailable,
      }),

      cameras: buildCameraData({
        cameraDevices:
          entityConfiguration
            .cameraDevices ?? [],

        cameraRecharge:
          entityConfiguration
            .cameraRecharge ?? null,

        entities,
        findEntity,
        isEntityAvailable,
      }),

      climateControl:
        buildClimateControlData({
          climateDevices:
            entityConfiguration
              .climateDevices ?? [],

          entities,
          findEntity,
          isEntityAvailable,
        }),

      infrastructure:
        windowsHealth,

      services: buildServicesStatus({
        homeAssistantConnected: true,
        tuyaLatestUpdate:
          latestUpdate,
        tuyaHealth,
        generatedAt,
      }),
    };
  }

  async function getDashboardData(
    forceRefresh = false
  ) {
    const now = Date.now();

    const cacheIsValid =
      cache.data !== null &&
      now - cache.createdAt <
        cacheDurationMs;

    if (
      !forceRefresh &&
      cacheIsValid
    ) {
      return {
        ...cache.data,

        system: {
          ...cache.data.system,

          cache: {
            ...cache.data.system.cache,
            fromCache: true,
          },
        },
      };
    }

    const data =
      await createDashboardData();

    cache = {
      data,
      createdAt: Date.now(),
    };

    return {
      ...data,

      system: {
        ...data.system,

        cache: {
          ...data.system.cache,
          fromCache: false,
        },
      },
    };
  }

  return {
    getDashboardData,
    clearCache,
  };
}

module.exports = {
  createDashboardService,
};

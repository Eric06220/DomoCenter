const packageJson = require("../package.json");

function createDashboardService({
  homeAssistantService,
  entityConfiguration,
  buildClimateData,
  buildClimateControlData,
  buildOpeningData,
  buildWaterLeakData,
  buildSmokeData,
  buildEnergyData,
  buildLightingData,
  buildCameraData,
  buildBatteryData,
  buildInfrastructureData,
  buildServicesStatus,
  buildTuyaHealth,
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

    const smoke = buildSmokeData(
      entityConfiguration,
      entities,
      findEntity,
      isEntityAvailable
    );

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

      batteries: buildBatteryData({
        climateZones,
        openings,
        waterLeaks,
        smoke,
      }),

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
        buildInfrastructureData(
          entityConfiguration.infrastructure,
          entities,
          readNumericEntity
        ),

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
      createdAt: now,
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

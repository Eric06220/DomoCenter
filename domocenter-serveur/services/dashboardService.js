
function createDashboardService({
  homeAssistantService,
  entityConfiguration,
  buildClimateData,
  buildOpeningData,
  buildEnergyData,
  buildInfrastructureData,
  buildServicesStatus,
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
      .map((timestamp) => new Date(timestamp).getTime())
      .filter(Number.isFinite);

    if (timestamps.length === 0) {
      return null;
    }

    return new Date(Math.max(...timestamps)).toISOString();
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
    const entities = await homeAssistantService.getEntities();
    const generatedAt = new Date().toISOString();
    const latestUpdate = getLatestUpdateTimestamp(entities);

    
    return {
      system: {
        homeAssistant: {
          connected: true,
          url: homeAssistantUrl,
          entityCount: entities.length,
          unavailableEntityCount:
            countUnavailableEntities(entities),
        },

        tuya: {
          connected: true,
          latestDataUpdate: latestUpdate,
        },

        cache: {
          generatedAt,
          durationSeconds: cacheDurationMs / 1000,
        },
      },

      climate: {
        zones: buildClimateData(
          entityConfiguration,
          entities,
          readNumericEntity
        ),
      },

      security: {
        openings: buildOpeningData(
          entityConfiguration,
          entities,
          findEntity,
          isEntityAvailable
        ),
      },

      energy: buildEnergyData(
        entityConfiguration,
        entities,
        readNumericEntity,
        readSwitchEntity
      ),

      infrastructure: buildInfrastructureData(
        entityConfiguration.infrastructure,
        entities,
        readNumericEntity
      ),

      services: buildServicesStatus({
        homeAssistantConnected: true,
        tuyaLatestUpdate: latestUpdate,
        generatedAt,
      }),
    };
  }

  async function getDashboardData(forceRefresh = false) {
    const now = Date.now();

    const cacheIsValid =
      cache.data !== null &&
      now - cache.createdAt < cacheDurationMs;

    if (!forceRefresh && cacheIsValid) {
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

    const data = await createDashboardData();

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
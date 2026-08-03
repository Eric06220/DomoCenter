function buildInfrastructureData(
  infrastructureConfig,
  entities,
  readNumericEntity
) {
  return {
    cpuTemperature: readNumericEntity(
      entities,
      infrastructureConfig.cpuTemperatureEntityId,
      "°C"
    ),

    cpuUsage: readNumericEntity(
      entities,
      infrastructureConfig.cpuUsageEntityId,
      "%"
    ),

    memoryUsage: readNumericEntity(
      entities,
      infrastructureConfig.memoryUsageEntityId,
      "%"
    ),

    diskFree: readNumericEntity(
      entities,
      infrastructureConfig.diskFreeEntityId,
      "GiB"
    ),

    diskUsed: readNumericEntity(
      entities,
      infrastructureConfig.diskUsedEntityId,
      "GiB"
    ),
  };
}

module.exports = {
  buildInfrastructureData,
};
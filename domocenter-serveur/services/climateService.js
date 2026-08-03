function buildClimateData(entityConfiguration, entities, readNumericEntity) {
  return entityConfiguration.climate.map((zone) => {
    const temperature = readNumericEntity(
      entities,
      zone.temperatureEntityId,
      "°C"
    );

    const humidity = readNumericEntity(
      entities,
      zone.humidityEntityId,
      "%"
    );

    return {
      id: zone.id,
      name: zone.name,
      available: temperature.available && humidity.available,
      temperature,
      humidity,
    };
  });
}

module.exports = {
  buildClimateData,
};
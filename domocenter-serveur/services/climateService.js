function buildClimateData(
  entityConfiguration,
  entities,
  readNumericEntity
) {
  return entityConfiguration.climate.map(
    (zone) => {
      const temperature =
        readNumericEntity(
          entities,
          zone.temperatureEntityId,
          "°C"
        );

      const humidity =
        readNumericEntity(
          entities,
          zone.humidityEntityId,
          "%"
        );

      const battery =
        zone.batteryEntityId
          ? readNumericEntity(
              entities,
              zone.batteryEntityId,
              "%"
            )
          : null;

      return {
        id: zone.id,
        name: zone.name,

        available:
          temperature.available &&
          humidity.available,

        temperature,
        humidity,

        batteryEntityId:
          zone.batteryEntityId ?? null,

        batteryLevel:
          battery?.available
            ? battery.value
            : null,
      };
    }
  );
}

module.exports = {
  buildClimateData,
};

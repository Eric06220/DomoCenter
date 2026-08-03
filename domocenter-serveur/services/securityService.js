function buildOpeningData(
  entityConfiguration,
  entities,
  findEntity,
  isEntityAvailable
) {
  const sensors = entityConfiguration.openings.map((sensor) => {
    const entity = findEntity(entities, sensor.entityId);
    const available = isEntityAvailable(entity);
    const isOpen = available ? entity.state === "on" : null;

    return {
      id: sensor.id,
      name: sensor.name,
      location: sensor.location,
      entityId: sensor.entityId,
      available,
      isOpen,
      state: available ? entity.state : "unavailable",
      lastUpdated: entity?.last_updated ?? null,
    };
  });

  return {
    total: sensors.length,
    open: sensors.filter(
      (sensor) => sensor.available && sensor.isOpen
    ).length,
    closed: sensors.filter(
      (sensor) => sensor.available && sensor.isOpen === false
    ).length,
    unavailable: sensors.filter(
      (sensor) => !sensor.available
    ).length,
    sensors,
  };
}

module.exports = {
  buildOpeningData,
};
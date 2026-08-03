function findEntity(entities, entityId) {
  return (
    entities.find((entity) => entity.entity_id === entityId) ?? null
  );
}

function isEntityAvailable(entity) {
  return (
    entity !== null &&
    entity.state !== "unknown" &&
    entity.state !== "unavailable"
  );
}

function readNumericEntity(
  entities,
  entityId,
  defaultUnit = ""
) {
  const entity = findEntity(entities, entityId);

  if (!isEntityAvailable(entity)) {
    return {
      entityId,
      available: false,
      value: null,
      unit: defaultUnit,
      lastUpdated: entity?.last_updated ?? null,
    };
  }

  const value = Number(entity.state);

  if (!Number.isFinite(value)) {
    return {
      entityId,
      available: false,
      value: null,
      unit:
        entity.attributes?.unit_of_measurement ?? defaultUnit,
      lastUpdated: entity.last_updated ?? null,
    };
  }

  return {
    entityId,
    available: true,
    value,
    unit:
      entity.attributes?.unit_of_measurement ?? defaultUnit,
    friendlyName:
      entity.attributes?.friendly_name ?? entityId,
    lastUpdated: entity.last_updated ?? null,
  };
}

function readSwitchEntity(entities, entityId) {
  const entity = findEntity(entities, entityId);
  const available = isEntityAvailable(entity);

  return {
    entityId,
    available,
    isOn: available ? entity.state === "on" : null,
    state: available ? entity.state : "unavailable",
    friendlyName:
      entity?.attributes?.friendly_name ?? entityId,
    lastUpdated: entity?.last_updated ?? null,
  };
}

module.exports = {
  findEntity,
  isEntityAvailable,
  readNumericEntity,
  readSwitchEntity,
};
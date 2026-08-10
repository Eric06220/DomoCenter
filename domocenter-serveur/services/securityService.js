function readBatteryLevel(
  entities,
  batteryEntityId,
  findEntity,
  isEntityAvailable
) {
  if (!batteryEntityId) {
    return null;
  }

  const batteryEntity = findEntity(
    entities,
    batteryEntityId
  );

  if (!isEntityAvailable(batteryEntity)) {
    return null;
  }

  const value = Number(batteryEntity.state);

  return Number.isFinite(value)
    ? value
    : null;
}

function buildOpeningData(
  entityConfiguration,
  entities,
  findEntity,
  isEntityAvailable
) {
  const sensors =
    entityConfiguration.openings.map(
      (sensor) => {
        const entity = findEntity(
          entities,
          sensor.entityId
        );

        const available =
          isEntityAvailable(entity);

        const isOpen = available
          ? entity.state === "on"
          : null;

        const batteryLevel =
          readBatteryLevel(
            entities,
            sensor.batteryEntityId,
            findEntity,
            isEntityAvailable
          );

        return {
          id: sensor.id,
          name: sensor.name,
          location: sensor.location,
          entityId: sensor.entityId,
          batteryEntityId:
            sensor.batteryEntityId ?? null,
          batteryLevel,
          available,
          isOpen,
          state: available
            ? entity.state
            : "unavailable",
          lastUpdated:
            entity?.last_updated ?? null,
        };
      }
    );

  return {
    total: sensors.length,

    open: sensors.filter(
      (sensor) =>
        sensor.available &&
        sensor.isOpen
    ).length,

    closed: sensors.filter(
      (sensor) =>
        sensor.available &&
        sensor.isOpen === false
    ).length,

    unavailable: sensors.filter(
      (sensor) => !sensor.available
    ).length,

    lowBattery: sensors.filter(
      (sensor) =>
        Number.isFinite(
          sensor.batteryLevel
        ) &&
        sensor.batteryLevel < 20
    ).length,

    sensors,
  };
}

function buildWaterLeakData(
  entityConfiguration,
  entities,
  findEntity,
  isEntityAvailable
) {
  const sensors =
    (
      entityConfiguration.waterLeakSensors ??
      []
    ).map((sensor) => {
      const entity = findEntity(
        entities,
        sensor.entityId
      );

      const available =
        isEntityAvailable(entity);

      const leakDetected = available
        ? entity.state === "on"
        : null;

      const batteryLevel =
        readBatteryLevel(
          entities,
          sensor.batteryEntityId,
          findEntity,
          isEntityAvailable
        );

      return {
        id: sensor.id,
        name: sensor.name,
        location: sensor.location,
        entityId: sensor.entityId,
        batteryEntityId:
          sensor.batteryEntityId ?? null,
        batteryLevel,
        available,
        leakDetected,
        state: available
          ? entity.state
          : "unavailable",
        lastUpdated:
          entity?.last_updated ?? null,
      };
    });

  return {
    total: sensors.length,

    alert: sensors.filter(
      (sensor) =>
        sensor.available &&
        sensor.leakDetected
    ).length,

    unavailable: sensors.filter(
      (sensor) => !sensor.available
    ).length,

    lowBattery: sensors.filter(
      (sensor) =>
        Number.isFinite(
          sensor.batteryLevel
        ) &&
        sensor.batteryLevel < 20
    ).length,

    sensors,
  };
}

function buildSmokeData(
  entityConfiguration,
  entities,
  findEntity,
  isEntityAvailable
) {
  const detectors =
    (
      entityConfiguration.smokeDetectors ??
      []
    ).map((detector) => {
      const smokeEntity = findEntity(
        entities,
        detector.smokeEntityId
      );

      const tamperEntity = findEntity(
        entities,
        detector.tamperEntityId
      );

      const smokeAvailable =
        isEntityAvailable(smokeEntity);

      const tamperAvailable =
        isEntityAvailable(tamperEntity);

      const batteryLevel =
        readBatteryLevel(
          entities,
          detector.batteryEntityId,
          findEntity,
          isEntityAvailable
        );

      return {
        id: detector.id,
        name: detector.name,
        location: detector.location,

        smokeEntityId:
          detector.smokeEntityId,

        tamperEntityId:
          detector.tamperEntityId,

        batteryEntityId:
          detector.batteryEntityId ?? null,

        batteryLevel,

        available:
          smokeAvailable &&
          tamperAvailable,

        smokeDetected:
          smokeAvailable
            ? smokeEntity.state === "on"
            : null,

        tamperDetected:
          tamperAvailable
            ? tamperEntity.state === "on"
            : null,

        smokeState:
          smokeAvailable
            ? smokeEntity.state
            : "unavailable",

        tamperState:
          tamperAvailable
            ? tamperEntity.state
            : "unavailable",

        lastUpdated:
          smokeEntity?.last_updated ??
          tamperEntity?.last_updated ??
          null,
      };
    });

  return {
    total: detectors.length,

    smokeAlert: detectors.filter(
      (detector) =>
        detector.smokeDetected === true
    ).length,

    tamperAlert: detectors.filter(
      (detector) =>
        detector.tamperDetected === true
    ).length,

    unavailable: detectors.filter(
      (detector) =>
        !detector.available
    ).length,

    lowBattery: detectors.filter(
      (detector) =>
        Number.isFinite(
          detector.batteryLevel
        ) &&
        detector.batteryLevel < 20
    ).length,

    detectors,
  };
}

module.exports = {
  buildOpeningData,
  buildWaterLeakData,
  buildSmokeData,
};

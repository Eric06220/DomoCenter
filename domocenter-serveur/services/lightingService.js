function buildLightingData({
  lightingDevices,
  entities,
  findEntity,
  isEntityAvailable,
}) {
  const devices = lightingDevices
    .map((device) => {
      const entity = findEntity(
        entities,
        device.entityId
      );

      const available =
        isEntityAvailable(entity);

      return {
        id: device.id,
        name: device.name,
        location: device.location,
        group:
          device.group ??
          device.location ??
          "Autres",
        displayType:
          device.displayType ??
          "Équipement connecté",
        order:
          Number.isFinite(device.order)
            ? device.order
            : 999,
        groupControl:
          device.groupControl !== false,
        entityId: device.entityId,
        icon: device.icon,
        available,
        isOn: available
          ? entity.state === "on"
          : false,
        state:
          entity?.state ?? "unavailable",
        lastUpdated:
          entity?.last_updated ?? null,
      };
    })
    .sort((firstDevice, secondDevice) => {
      const groupComparison =
        firstDevice.group.localeCompare(
          secondDevice.group,
          "fr"
        );

      if (groupComparison !== 0) {
        return groupComparison;
      }

      return (
        firstDevice.order -
        secondDevice.order
      );
    });

  return {
    devices,
    totalCount: devices.length,
    activeCount: devices.filter(
      (device) =>
        device.available && device.isOn
    ).length,
    unavailableCount: devices.filter(
      (device) => !device.available
    ).length,
  };
}

module.exports = {
  buildLightingData,
};

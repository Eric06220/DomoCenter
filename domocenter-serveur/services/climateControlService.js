function buildClimateControlData({
  climateDevices = [],
  entities,
  findEntity,
  isEntityAvailable,
}) {
  const devices = climateDevices.map((device) => {
    const entity = findEntity(
      entities,
      device.entityId
    );

    const available =
      isEntityAvailable(entity);

    const attributes =
      entity?.attributes ?? {};

    return {
      id: device.id,
      name: device.name,
      location: device.location,
      brand: device.brand,
      entityId: device.entityId,

      available,

      state:
        entity?.state ??
        "unavailable",

      isOn:
        available &&
        entity.state !== "off",

      currentTemperature:
        Number.isFinite(
          attributes.current_temperature
        )
          ? attributes.current_temperature
          : null,

      targetTemperature:
        Number.isFinite(
          attributes.temperature
        )
          ? attributes.temperature
          : null,

      minTemperature:
        Number.isFinite(
          attributes.min_temp
        )
          ? attributes.min_temp
          : null,

      maxTemperature:
        Number.isFinite(
          attributes.max_temp
        )
          ? attributes.max_temp
          : null,

      hvacModes:
        Array.isArray(
          attributes.hvac_modes
        )
          ? attributes.hvac_modes
          : [],

      fanMode:
        attributes.fan_mode ??
        null,

      fanModes:
        Array.isArray(
          attributes.fan_modes
        )
          ? attributes.fan_modes
          : [],

      presetMode:
        attributes.preset_mode ??
        null,

      presetModes:
        Array.isArray(
          attributes.preset_modes
        )
          ? attributes.preset_modes
          : [],

      swingMode:
        attributes.swing_mode ??
        null,

      swingModes:
        Array.isArray(
          attributes.swing_modes
        )
          ? attributes.swing_modes
          : [],

      lastUpdated:
        entity?.last_updated ??
        null,
    };
  });

  return {
    totalCount:
      devices.length,

    availableCount:
      devices.filter(
        (device) =>
          device.available
      ).length,

    activeCount:
      devices.filter(
        (device) =>
          device.available &&
          device.isOn
      ).length,

    devices,
  };
}

module.exports = {
  buildClimateControlData,
};

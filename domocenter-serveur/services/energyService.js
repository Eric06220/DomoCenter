function buildEnergyData(
  entityConfiguration,
  entities,
  readNumericEntity,
  readSwitchEntity
) {
  const devices = entityConfiguration.energyDevices.map((device) => {
    const switchState = readSwitchEntity(
      entities,
      device.switchEntityId
    );

    const voltage = readNumericEntity(
      entities,
      device.voltageEntityId,
      "V"
    );

    const current = readNumericEntity(
      entities,
      device.currentEntityId,
      "A"
    );

    const power = readNumericEntity(
      entities,
      device.powerEntityId,
      "W"
    );

    const totalEnergy = readNumericEntity(
      entities,
      device.totalEnergyEntityId,
      "kWh"
    );

    return {
      id: device.id,
      name: device.name,
      location: device.location,
      available:
        switchState.available ||
        voltage.available ||
        current.available ||
        power.available ||
        totalEnergy.available,
      switch: switchState,
      voltage,
      current,
      power,
      totalEnergy,
    };
  });

  const totalPowerWatts = devices
    .filter((device) => device.power.available)
    .reduce(
      (total, device) => total + device.power.value,
      0
    );

  const totalEnergyKwh = devices
    .filter((device) => device.totalEnergy.available)
    .reduce(
      (total, device) => total + device.totalEnergy.value,
      0
    );

  return {
    totalDevices: devices.length,
    activeDevices: devices.filter(
      (device) =>
        device.switch.available && device.switch.isOn
    ).length,
    unavailableDevices: devices.filter(
      (device) => !device.available
    ).length,
    totalPowerWatts,
    totalEnergyKwh,
    devices,
  };
}

module.exports = {
  buildEnergyData,
};
function createEnergyControlService({
  entityConfiguration,
  homeAssistantService,
  clearDashboardCache,
}) {
  function findEnergyDeviceConfiguration(deviceId) {
    return (
      entityConfiguration.energyDevices.find(
        (device) => device.id === deviceId
      ) ?? null
    );
  }

  async function setEnergyDeviceState(deviceId, isOn) {
    const device = findEnergyDeviceConfiguration(deviceId);

    if (!device) {
      const error = new Error(
        "Équipement énergétique introuvable."
      );

      error.statusCode = 404;
      throw error;
    }

    await homeAssistantService.setSwitchState(
      device.switchEntityId,
      isOn
    );

    clearDashboardCache();

    return {
      id: device.id,
      name: device.name,
      requestedState: isOn ? "on" : "off",
    };
  }

  return {
    setEnergyDeviceState,
  };
}

module.exports = {
  createEnergyControlService,
};

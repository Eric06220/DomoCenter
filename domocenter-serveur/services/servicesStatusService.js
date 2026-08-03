function buildServicesStatus({
  homeAssistantConnected,
  tuyaLatestUpdate,
  generatedAt,
}) {
  return {
    homeAssistant: {
      online: homeAssistantConnected,
      label: "Home Assistant",
    },

    domoCenter: {
      online: true,
      label: "DomoCenter",
    },

    tuya: {
      online: Boolean(tuyaLatestUpdate),
      label: "Tuya",
      lastUpdate: tuyaLatestUpdate,
    },

    internet: {
      online: true,
      label: "Internet",
    },

    generatedAt,
  };
}

module.exports = {
  buildServicesStatus,
};

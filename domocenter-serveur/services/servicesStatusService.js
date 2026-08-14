function buildServicesStatus({
  homeAssistantConnected,
  tuyaLatestUpdate,
  tuyaHealth,
  generatedAt,
}) {
  const tuyaStatus =
    tuyaHealth?.status ?? "unknown";

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
      online:
        Boolean(tuyaLatestUpdate) &&
        tuyaStatus !== "critical",

      label: "Tuya",

      status: tuyaStatus,

      healthLabel:
        tuyaHealth?.label ??
        "État Tuya inconnu",

      lastUpdate:
        tuyaLatestUpdate,

      warning:
        tuyaStatus === "warning",

      critical:
        tuyaStatus === "critical",

      witnesses:
        tuyaHealth?.witnesses ?? [],

      checkedAt:
        tuyaHealth?.checkedAt ?? null,
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
function getBatteryStatus(level) {
  if (!Number.isFinite(level)) {
    return "unavailable";
  }

  if (level < 10) {
    return "critical";
  }

  if (level < 20) {
    return "low";
  }

  return "ok";
}

function buildBatteryData({
  climateZones,
  openings,
  waterLeaks,
  smoke,
}) {
  const batteries = [];

  function addBattery({
    id,
    name,
    location,
    batteryLevel,
    batteryEntityId,
    category,
  }) {
    if (!batteryEntityId) {
      return;
    }

    batteries.push({
      id: `${category}-${id}`,
      deviceId: id,
      name,
      location,
      category,
      entityId: batteryEntityId,
      level: batteryLevel,
      status:
        getBatteryStatus(batteryLevel),
    });
  }

  for (
    const zone of climateZones ?? []
  ) {
    addBattery({
      ...zone,
      location: zone.name,
      category: "climate",
    });
  }

  for (
    const sensor of openings?.sensors ?? []
  ) {
    addBattery({
      ...sensor,
      category: "opening",
    });
  }

  for (
    const sensor of waterLeaks?.sensors ?? []
  ) {
    addBattery({
      ...sensor,
      category: "waterLeak",
    });
  }

  for (
    const detector of smoke?.detectors ?? []
  ) {
    addBattery({
      ...detector,
      category: "smoke",
    });
  }

  return {
    total: batteries.length,

    ok: batteries.filter(
      (battery) =>
        battery.status === "ok"
    ).length,

    low: batteries.filter(
      (battery) =>
        battery.status === "low"
    ).length,

    critical: batteries.filter(
      (battery) =>
        battery.status === "critical"
    ).length,

    unavailable: batteries.filter(
      (battery) =>
        battery.status === "unavailable"
    ).length,

    batteries,
  };
}

module.exports = {
  buildBatteryData,
};

function buildCameraData({
  cameraDevices = [],
  cameraRecharge = null,
  entities,
  findEntity,
  isEntityAvailable,
}) {
  const cameras = cameraDevices.map((camera) => {
    const availabilityEntity =
      typeof camera.availabilityEntityId === "string" &&
      camera.availabilityEntityId.length > 0
        ? findEntity(
            entities,
            camera.availabilityEntityId
          )
        : null;

    const availabilityEntityAvailable =
      isEntityAvailable(
        availabilityEntity
      );

    const available =
      availabilityEntityAvailable
        ? availabilityEntity.state === "on"
        : false;

    const cameraEntity =
      typeof camera.entityId === "string" &&
      camera.entityId.length > 0
        ? findEntity(
            entities,
            camera.entityId
          )
        : null;

    return {
      id: camera.id,
      name: camera.name,
      location: camera.location,
      model: camera.model,
      ipAddress: camera.ipAddress,

      entityId:
        camera.entityId ?? null,

      availabilityEntityId:
        camera.availabilityEntityId ??
        null,

      integrated:
        typeof camera.entityId === "string" &&
        camera.entityId.length > 0,

      available,

      state: available
        ? "online"
        : "offline",

      cameraState:
        cameraEntity &&
        isEntityAvailable(cameraEntity)
          ? cameraEntity.state
          : null,

      lastUpdated:
        availabilityEntity
          ?.last_updated ??
        null,
    };
  });

  const availableCameras =
    cameras.filter(
      (camera) =>
        camera.available === true
    );

  const unavailableCameras =
    cameras.filter(
      (camera) =>
        camera.available === false
    );

  let recharge = null;

  if (
    cameraRecharge &&
    typeof cameraRecharge.entityId === "string"
  ) {
    const rechargeEntity = findEntity(
      entities,
      cameraRecharge.entityId
    );

    const rechargeAvailable =
      isEntityAvailable(
        rechargeEntity
      );

    recharge = {
      name:
        cameraRecharge.name ??
        "Recharge caméras",

      location:
        cameraRecharge.location ??
        "Entrée + Allée",

      entityId:
        cameraRecharge.entityId,

      available:
        rechargeAvailable,

      active:
        rechargeAvailable
          ? rechargeEntity.state === "on"
          : null,

      state:
        rechargeAvailable
          ? rechargeEntity.state
          : "unavailable",

      lastUpdated:
        rechargeEntity?.last_updated ??
        null,
    };
  }

  return {
    totalConfigured:
      cameras.length,

    available:
      availableCameras.length,

    unavailable:
      unavailableCameras.length,

    cameras,

    recharge,
  };
}

module.exports = {
  buildCameraData,
};

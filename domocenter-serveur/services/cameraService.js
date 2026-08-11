function buildCameraData({
  cameraDevices = [],
  cameraRecharge = null,
  entities,
  findEntity,
  isEntityAvailable,
}) {
  const cameras = cameraDevices.map((camera) => {
    const integrated =
      typeof camera.entityId === "string" &&
      camera.entityId.length > 0;

    if (!integrated) {
      return {
        id: camera.id,
        name: camera.name,
        location: camera.location,
        model: camera.model,
        ipAddress: camera.ipAddress,
        entityId: null,
        integrated: false,
        available: null,
        state: "not_integrated",
        lastUpdated: null,
      };
    }

    const entity = findEntity(
      entities,
      camera.entityId
    );

    const available =
      isEntityAvailable(entity);

    return {
      id: camera.id,
      name: camera.name,
      location: camera.location,
      model: camera.model,
      ipAddress: camera.ipAddress,
      entityId: camera.entityId,
      integrated: true,
      available,
      state: available
        ? entity.state
        : "unavailable",
      lastUpdated:
        entity?.last_updated ?? null,
    };
  });

  const integratedCameras = cameras.filter(
    (camera) => camera.integrated
  );

  const availableCameras =
    integratedCameras.filter(
      (camera) =>
        camera.available === true
    );

  const unavailableCameras =
    integratedCameras.filter(
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

    integrated:
      integratedCameras.length,

    available:
      availableCameras.length,

    unavailable:
      unavailableCameras.length,

    notIntegrated:
      cameras.length -
      integratedCameras.length,

    cameras,

    recharge,
  };
}

module.exports = {
  buildCameraData,
};

const TUYA_TECHNICAL_ENTITIES = [
  "sensor.horloge_piscine_tension",
  "sensor.horloge_piscine_puissance",
  "sensor.horloge_piscine_courant",
  "sensor.horloge_piscine_energie_totale",

  "sensor.horloge_ecs_home_tension",
  "sensor.horloge_ecs_home_courant",
  "sensor.horloge_ecs_home_puissance",
  "sensor.horloge_ecs_home_energie_totale",

  "sensor.horloge_ecs_studio_tension",
  "sensor.prises_piscine_tension",

  "sensor.temp_humidity_home_temperature",
  "sensor.temp_humidity_home_humidite",
  "sensor.temp_humidity_studio_temperature",
  "sensor.temp_humidity_studio_humidite",
  "sensor.temp_humidity_ext_temperature",
  "sensor.temp_humidity_ext_humidite",

  "sensor.salon_climatiseur_de_piece_puissance",
];

const WARNING_AFTER_MINUTES = 3;
const CRITICAL_AFTER_MINUTES = 5;


function getTimestampMs(entity) {
  const value =
    entity?.last_updated ??
    entity?.last_changed ??
    null;

  if (!value) {
    return null;
  }

  const timestamp =
    new Date(value).getTime();

  return Number.isFinite(timestamp)
    ? timestamp
    : null;
}


function buildTuyaHealth({
  entities,
  now = new Date(),
}) {
  const technicalEntities =
    entities.filter((entity) =>
      TUYA_TECHNICAL_ENTITIES.includes(
        entity.entity_id
      )
    );

  const updates =
    technicalEntities
      .map((entity) => ({
        entityId:
          entity.entity_id,
        state:
          entity.state,
        lastUpdated:
          entity.last_updated ??
          entity.last_changed ??
          null,
        timestamp:
          getTimestampMs(entity),
      }))
      .filter(
        (item) =>
          Number.isFinite(
            item.timestamp
          )
      )
      .sort(
        (a, b) =>
          b.timestamp -
          a.timestamp
      );

  const latest =
    updates[0] ?? null;

  const nowMs =
    now.getTime();

  const ageMinutes =
    latest
      ? Math.max(
          0,
          (nowMs -
            latest.timestamp) /
            60_000
        )
      : null;

  let status =
    "critical";

  let label =
    "Données Tuya probablement figées";

  if (
    ageMinutes !== null &&
    ageMinutes <
      WARNING_AFTER_MINUTES
  ) {
    status =
      "ok";

    label =
      "Tuya OK";
  } else if (
    ageMinutes !== null &&
    ageMinutes <
      CRITICAL_AFTER_MINUTES
  ) {
    status =
      "warning";

    label =
      "Données Tuya à vérifier";
  }

  return {
    status,
    label,

    healthy:
      status === "ok",

    warning:
      status === "warning",

    critical:
      status === "critical",

    latestEntity:
      latest?.entityId ?? null,

    latestUpdate:
      latest?.lastUpdated ?? null,

    ageMinutes,

    thresholds: {
      warningAfterMinutes:
        WARNING_AFTER_MINUTES,

      criticalAfterMinutes:
        CRITICAL_AFTER_MINUTES,
    },

    monitoredEntityCount:
      technicalEntities.length,

    checkedAt:
      now.toISOString(),
  };
}


module.exports = {
  TUYA_TECHNICAL_ENTITIES,
  WARNING_AFTER_MINUTES,
  CRITICAL_AFTER_MINUTES,
  buildTuyaHealth,
};

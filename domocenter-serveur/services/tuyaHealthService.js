const DEFAULT_THRESHOLDS_HOURS = {
  entrance: 6,
  poolPump: 14,
  ecsHome: 30,
};

const TUYA_WITNESSES = [
  {
    id: "entrance",
    name: "Entrée",
    entityId:
      "binary_sensor.porte_entree_porte",
  },
  {
    id: "poolPump",
    name: "Pompe piscine",
    entityId:
      "switch.horloge_piscine_interrupteur",
  },
  {
    id: "ecsHome",
    name: "ECS Maison",
    entityId:
      "switch.horloge_ecs_home_interrupteur",
  },
];


function getAgeHours(
  dateString,
  now = new Date()
) {
  if (!dateString) {
    return null;
  }

  const date =
    new Date(dateString);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }

  return (
    now.getTime() -
    date.getTime()
  ) / 3_600_000;
}


function findEntityById(
  entities,
  entityId
) {
  return entities.find(
    (entity) =>
      entity.entity_id ===
      entityId
  );
}


function evaluateWitness({
  witness,
  entities,
  thresholdsHours,
  now,
}) {
  const entity =
    findEntityById(
      entities,
      witness.entityId
    );

  if (!entity) {
    return {
      ...witness,
      available: false,
      state: "unknown",
      lastUpdated: null,
      ageHours: null,
      stale: true,
      reason:
        "Entité introuvable",
    };
  }

  const lastUpdated =
    entity.last_updated ??
    entity.last_changed ??
    null;

  const ageHours =
    getAgeHours(
      lastUpdated,
      now
    );

  const thresholdHours =
    thresholdsHours[
      witness.id
    ];

  const stale =
    ageHours === null ||
    ageHours >
      thresholdHours;

  return {
    ...witness,
    available:
      entity.state !==
      "unavailable",

    state:
      entity.state,

    lastUpdated,

    ageHours,

    thresholdHours,

    stale,

    reason:
      stale
        ? "Dernière mise à jour trop ancienne"
        : null,
  };
}


function buildTuyaHealth({
  entities,
  now = new Date(),
  thresholdsHours =
    DEFAULT_THRESHOLDS_HOURS,
}) {
  const witnesses =
    TUYA_WITNESSES.map(
      (witness) =>
        evaluateWitness({
          witness,
          entities,
          thresholdsHours,
          now,
        })
    );

  const entrance =
    witnesses.find(
      (item) =>
        item.id ===
        "entrance"
    );

  const poolPump =
    witnesses.find(
      (item) =>
        item.id ===
        "poolPump"
    );

  const ecsHome =
    witnesses.find(
      (item) =>
        item.id ===
        "ecsHome"
    );

  const automaticWitnessesStale =
    Boolean(
      poolPump?.stale &&
      ecsHome?.stale
    );

  const allWitnessesStale =
    Boolean(
      entrance?.stale &&
      poolPump?.stale &&
      ecsHome?.stale
    );

  let status =
    "ok";

  let label =
    "Tuya OK";

  if (
    allWitnessesStale
  ) {
    status =
      "critical";

    label =
      "Données Tuya probablement figées";
  } else if (
    automaticWitnessesStale
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

    witnesses,

    checkedAt:
      now.toISOString(),
  };
}


module.exports = {
  DEFAULT_THRESHOLDS_HOURS,
  TUYA_WITNESSES,
  buildTuyaHealth,
};

const fs = require("fs");
const path = require("path");

const CRITICAL_ALERT_REPEAT_MS =
  5 * 60 * 1000;

function createAlertService({
  homeAssistantService,
  stateFilePath,
  waterLeakStateFilePath,
  smokeStateFilePath,
}) {
  const resolvedStateFilePath =
    stateFilePath ||
    path.join(
      __dirname,
      "..",
      "data",
      "alert-state.json"
    );

  const resolvedWaterLeakStateFilePath =
    waterLeakStateFilePath ||
    path.join(
      __dirname,
      "..",
      "data",
      "water-leak-alert-state.json"
    );

  const resolvedSmokeStateFilePath =
    smokeStateFilePath ||
    path.join(
      __dirname,
      "..",
      "data",
      "smoke-alert-state.json"
    );

  let batteryAlertStates = {};
  let waterLeakAlertStates = {};
  let smokeAlertStates = {};

  /*
   * -----------------------------------------
   * GESTION DES FICHIERS D'ÉTAT
   * -----------------------------------------
   */

  function loadJsonFile(
    filePath,
    defaultValue = {}
  ) {
    try {
      if (!fs.existsSync(filePath)) {
        return defaultValue;
      }

      const content =
        fs.readFileSync(
          filePath,
          "utf8"
        );

      return (
        JSON.parse(content) ||
        defaultValue
      );
    } catch (error) {
      console.error(
        `Impossible de charger ${filePath} :`,
        error.message
      );

      return defaultValue;
    }
  }

  function saveJsonFile(
    filePath,
    data
  ) {
    try {
      const directory =
        path.dirname(filePath);

      fs.mkdirSync(
        directory,
        {
          recursive: true,
        }
      );

      fs.writeFileSync(
        filePath,
        JSON.stringify(
          data,
          null,
          2
        ),
        "utf8"
      );
    } catch (error) {
      console.error(
        `Impossible d'enregistrer ${filePath} :`,
        error.message
      );
    }
  }

  function loadState() {
    batteryAlertStates =
      loadJsonFile(
        resolvedStateFilePath,
        {}
      );

    waterLeakAlertStates =
      loadJsonFile(
        resolvedWaterLeakStateFilePath,
        {}
      );

    smokeAlertStates =
      loadJsonFile(
        resolvedSmokeStateFilePath,
        {}
      );
  }

  function saveBatteryState() {
    saveJsonFile(
      resolvedStateFilePath,
      batteryAlertStates
    );
  }

  function saveWaterLeakState() {
    saveJsonFile(
      resolvedWaterLeakStateFilePath,
      waterLeakAlertStates
    );
  }

  function saveSmokeState() {
    saveJsonFile(
      resolvedSmokeStateFilePath,
      smokeAlertStates
    );
  }

  /*
   * -----------------------------------------
   * BATTERIES
   * -----------------------------------------
   */

  function getBatterySeverity(
    level,
    previousState = null
  ) {
    if (!Number.isFinite(level)) {
      return "unavailable";
    }

    const wasLatched =
      previousState?.latchedCritical === true;

    /*
     * Une batterie qui passe sous 5 %
     * déclenche une alerte critique
     * persistante.
     */
    if (level < 5) {
      return "critical";
    }

    /*
     * Une alerte critique déjà mémorisée
     * reste active jusqu'à ce qu'une
     * nouvelle valeur supérieure à 80 %
     * confirme le remplacement de la pile.
     */
    if (
      wasLatched &&
      level <= 80
    ) {
      return "critical";
    }

    /*
     * Entre 5 % et moins de 10 %,
     * la batterie reste critique,
     * mais sans verrouillage persistant.
     */
    if (level < 10) {
      return "critical";
    }

    /*
     * Entre 10 % et moins de 20 %,
     * la batterie est faible.
     */
    if (level < 20) {
      return "low";
    }

    return "ok";
  }

  function getPreviousBatterySeverity(
    batteryId
  ) {
    return (
      batteryAlertStates[
        batteryId
      ]?.severity ?? null
    );
  }

  function shouldNotifyBattery({
    previousSeverity,
    currentSeverity,
  }) {
    if (
      currentSeverity ===
        "unavailable" ||
      currentSeverity === "ok"
    ) {
      return false;
    }

    if (
      previousSeverity === null
    ) {
      return true;
    }

    if (
      previousSeverity ===
      currentSeverity
    ) {
      return false;
    }

    if (
      currentSeverity ===
      "critical"
    ) {
      return true;
    }

    if (
      currentSeverity === "low" &&
      previousSeverity === "ok"
    ) {
      return true;
    }

    return false;
  }

  function buildBatteryMessage(
    battery,
    severity
  ) {
    const level =
      Math.round(
        battery.level
      );

    const location =
      battery.location ||
      battery.name ||
      "Emplacement inconnu";

    if (
      severity === "critical"
    ) {
      return (
        "🔴 DomoCenter — Batterie critique\n" +
        `${battery.name}\n` +
        `${location}\n` +
        `Batterie : ${level} %`
      );
    }

    return (
      "🟠 DomoCenter — Batterie faible\n" +
      `${battery.name}\n` +
      `${location}\n` +
      `Batterie : ${level} %`
    );
  }

  async function processBatteryAlerts(
    batteries = []
  ) {
    const results = [];

    for (
      const battery of batteries
    ) {
      if (!battery?.id) {
        continue;
      }

      const previousState =
        batteryAlertStates[
          battery.id
        ] ?? null;

      const currentSeverity =
        getBatterySeverity(
          battery.level,
          previousState
        );

      const previousSeverity =
        previousState?.severity ??
        null;

      if (
        currentSeverity ===
        "unavailable"
      ) {
        results.push({
          batteryId:
            battery.id,
          notified: false,
          severity:
            currentSeverity,
        });

        continue;
      }

      const notify =
        shouldNotifyBattery({
          previousSeverity,
          currentSeverity,
        });

      if (notify) {
        const message =
          buildBatteryMessage(
            battery,
            currentSeverity
          );

        await homeAssistantService
          .sendNotification({
            message,
          });

        console.log(
          `Alerte batterie DomoCenter : ${battery.name} — ${battery.level} % — ${currentSeverity}`
        );
      }

      const latchedCritical =
        battery.level < 5
          ? true
          : previousState?.latchedCritical === true &&
            battery.level <= 80;

      batteryAlertStates[
        battery.id
      ] = {
        severity:
          currentSeverity,

        level:
          battery.level,

        latchedCritical,

        name:
          battery.name,

        updatedAt:
          new Date()
            .toISOString(),

        lastNotifiedAt:
          notify
            ? new Date()
                .toISOString()
            : previousState?.lastNotifiedAt ||
              null,
      };

      results.push({
        batteryId:
          battery.id,
        notified:
          notify,
        severity:
          currentSeverity,
      });
    }

    saveBatteryState();

    return results;
  }

  /*
   * -----------------------------------------
   * FUITES D'EAU
   * -----------------------------------------
   */

  function getPreviousWaterLeakState(
    sensorId
  ) {
    return (
      waterLeakAlertStates[
        sensorId
      ]?.state ?? null
    );
  }

  function buildWaterLeakMessage(
    sensor
  ) {
    const location =
      sensor.location ||
      sensor.name ||
      "Emplacement inconnu";

    return (
      "🚨 DomoCenter — FUITE D'EAU\n" +
      `${sensor.name}\n` +
      `Emplacement : ${location}\n` +
      "Une présence d'eau a été détectée."
    );
  }

  async function processWaterLeakAlerts(
    sensors = []
  ) {
    const results = [];

    for (
      const sensor of sensors
    ) {
      if (!sensor?.id) {
        continue;
      }

      if (
        sensor.available !== true
      ) {
        results.push({
          sensorId:
            sensor.id,
          notified: false,
          state:
            "unavailable",
        });

        continue;
      }

      const currentState =
        sensor.leakDetected === true
          ? "leak"
          : "dry";

      const previousState =
        getPreviousWaterLeakState(
          sensor.id
        );

      const previousAlertState =
        waterLeakAlertStates[
          sensor.id
        ] ?? null;  

      const lastNotifiedAt =
        previousAlertState
          ?.lastNotifiedAt
          ? new Date(
              previousAlertState
                .lastNotifiedAt
            ).getTime()
          : null;

      const repeatDue =
        currentState === "leak" &&
        previousAlertState
          ?.acknowledged !== true &&
        (
          !Number.isFinite(
            lastNotifiedAt
          ) ||
          Date.now() -
            lastNotifiedAt >=
            CRITICAL_ALERT_REPEAT_MS
        );

      const notify =
        currentState === "leak" &&
        (
          previousState !== "leak" ||
          repeatDue
        );

      if (notify) {
        const message =
          buildWaterLeakMessage(
            sensor
          );

        await homeAssistantService
          .sendNotification({
            message,
            critical: true,
          });

        console.log(
          `Alerte fuite DomoCenter : ${sensor.name}`
        );
      }

      waterLeakAlertStates[
        sensor.id
      ] = {
        state:
          currentState,

        name:
          sensor.name,

        location:
          sensor.location,

        acknowledged:
          currentState === "leak"
            ? previousAlertState?.acknowledged === true
            : false,

        updatedAt:
          new Date()
            .toISOString(),

        lastNotifiedAt:
          notify
            ? new Date()
                .toISOString()
            : waterLeakAlertStates[
                sensor.id
              ]?.lastNotifiedAt ||
              null,
      };

      results.push({
        sensorId:
          sensor.id,
        notified:
          notify,
        state:
          currentState,
      });
    }

    saveWaterLeakState();

    return results;
  }

  /*
   * -----------------------------------------
   * FUMÉE
   * -----------------------------------------
   */

  function getPreviousSmokeState(
    detectorId
  ) {
    return (
      smokeAlertStates[
        detectorId
      ]?.state ?? null
    );
  }

  function buildSmokeMessage(
    detector
  ) {
    const location =
      detector.location ||
      detector.name ||
      "Emplacement inconnu";

    return (
      "🔥 DomoCenter — ALERTE FUMÉE\n" +
      `${detector.name}\n` +
      `Emplacement : ${location}\n` +
      "De la fumée a été détectée."
    );
  }

  async function processSmokeAlerts(
    detectors = []
  ) {
    const results = [];

    for (
      const detector of detectors
    ) {
      if (!detector?.id) {
        continue;
      }

      /*
       * Pour la fumée, on regarde
       * directement smokeDetected.
       *
       * Cela évite qu'un éventuel
       * problème du capteur anti-
       * sabotage soit interprété
       * comme une absence de fumée.
       */
      if (
        detector.smokeDetected === null ||
        detector.smokeDetected ===
          undefined
      ) {
        results.push({
          detectorId:
            detector.id,
          notified: false,
          state:
            "unavailable",
        });

        continue;
      }

      const currentState =
        detector.smokeDetected === true
          ? "smoke"
          : "clear";

      const previousState =
        getPreviousSmokeState(
          detector.id
        );

      const previousAlertState =
        smokeAlertStates[
          detector.id
        ] ?? null;

            const previousAlertActive =
        previousAlertState
          ?.alertActive === true;

      const newSmokeDetection =
        currentState === "smoke" &&
        previousState !== "smoke";

      const alertActive =
        newSmokeDetection ||
        (
          previousAlertActive &&
          previousAlertState
            ?.acknowledged !== true
        ) ||
        currentState === "smoke";

      /*
       * Notification uniquement
       * lors du passage à l'état
       * "smoke".
       */
      const lastNotifiedAt =
        previousAlertState
          ?.lastNotifiedAt
          ? new Date(
              previousAlertState
                .lastNotifiedAt
            ).getTime()
          : null;

      const repeatDue =
        currentState === "smoke" &&
        previousAlertState
          ?.acknowledged !== true &&
        (
          !Number.isFinite(
            lastNotifiedAt
          ) ||
          Date.now() -
            lastNotifiedAt >=
            CRITICAL_ALERT_REPEAT_MS
        );

      const notify =
        currentState === "smoke" &&
        (
          previousState !== "smoke" ||
          repeatDue
        );

      if (notify) {
        const message =
          buildSmokeMessage(
            detector
          );

        await homeAssistantService
          .sendNotification({
            message,
            critical: true,
          });

        console.log(
          `Alerte fumée DomoCenter : ${detector.name}`
        );
      }

      /*
       * Le retour à "clear"
       * réarme automatiquement
       * une future alerte.
       */
            smokeAlertStates[
        detector.id
      ] = {
        state:
          currentState,

        alertActive,

        name:
          detector.name,

        location:
          detector.location,

        acknowledged:
          alertActive
            ? previousAlertState?.acknowledged === true
            : false,

        updatedAt:
          new Date()
            .toISOString(),

        lastNotifiedAt:
          notify
            ? new Date()
                .toISOString()
            : previousAlertState
                ?.lastNotifiedAt ||
              null,
      };

      results.push({
        detectorId:
          detector.id,
        notified:
          notify,
        state:
          currentState,
      });
    }

    saveSmokeState();

    return results;
  }

    function acknowledgeWaterLeakAlert(
    sensorId
  ) {
    const currentState =
      waterLeakAlertStates[
        sensorId
      ];

    if (
      !currentState ||
      currentState.state !== "leak"
    ) {
      return false;
    }

    waterLeakAlertStates[
      sensorId
    ] = {
      ...currentState,
      acknowledged: true,
      acknowledgedAt:
        new Date().toISOString(),
    };

    saveWaterLeakState();

    return true;
  }

  function acknowledgeSmokeAlert(
    detectorId
  ) {
    const currentState =
      smokeAlertStates[
        detectorId
      ];

    if (
      !currentState ||
        currentState.alertActive !== true
    ) {
      return false;
    }

    smokeAlertStates[
      detectorId
    ] = {
      ...currentState,

      acknowledged: true,

      acknowledgedAt:
        new Date().toISOString(),

      alertActive:
        currentState.state === "smoke",
    };

    saveSmokeState();

    return true;
  }

  /*
   * -----------------------------------------
   * OUTILS
   * -----------------------------------------
   */

  function resetBatteryAlertState(
    batteryId
  ) {
    if (batteryId) {
      delete batteryAlertStates[
        batteryId
      ];
    } else {
      batteryAlertStates = {};
    }

    saveBatteryState();
  }

  function resetWaterLeakAlertState(
    sensorId
  ) {
    if (sensorId) {
      delete waterLeakAlertStates[
        sensorId
      ];
    } else {
      waterLeakAlertStates = {};
    }

    saveWaterLeakState();
  }

  function resetSmokeAlertState(
    detectorId
  ) {
    if (detectorId) {
      delete smokeAlertStates[
        detectorId
      ];
    } else {
      smokeAlertStates = {};
    }

    saveSmokeState();
  }

  function getBatteryAlertStates() {
    return batteryAlertStates;
  }

  function getWaterLeakAlertStates() {
    return waterLeakAlertStates;
  }

  function getSmokeAlertStates() {
    return smokeAlertStates;
  }

  loadState();

  return {
    processBatteryAlerts,
    processWaterLeakAlerts,
    processSmokeAlerts,

    acknowledgeWaterLeakAlert,
    acknowledgeSmokeAlert,

    resetBatteryAlertState,
    resetWaterLeakAlertState,
    resetSmokeAlertState,

    getBatteryAlertStates,
    getWaterLeakAlertStates,
    getSmokeAlertStates,
  };
}

module.exports = {
  createAlertService,
};

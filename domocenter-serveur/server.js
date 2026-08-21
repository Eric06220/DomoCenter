const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const {
  createDashboardService,
} = require("./services/dashboardService");

const {
  createLightingRouter,
} = require("./lightingRoutes");

const {
  createAccessRouter,
} = require("./accessRoutes");

const {
  createClimateRouter,
} = require("./climateRoutes");

const {
  buildClimateData,
} = require("./services/climateService");

const entityConfiguration =
  require("./config/devices");

const {
  buildOpeningData,
  buildWaterLeakData,
  buildSmokeData,
} = require("./services/securityService");

const {
  buildEnergyData,
} = require("./services/energyService");

const {
  buildLightingData,
} = require("./services/lightingService");

const {
  buildCameraData,
} = require("./services/cameraService");

const {
  buildClimateControlData,
} = require("./services/climateControlService");

const {
  buildBatteryData,
} = require("./services/batteryService");

const {
  createHomeAssistantService,
} = require("./services/homeAssistantService");

const {
  createEnergyControlService,
} = require("./services/energyControlService");

const {
  getWindowsHealth,
} = require("./services/windowsHealthService");

const {
  buildServicesStatus,
} = require("./services/servicesStatusService");

const {
  buildTuyaHealth,
} = require("./services/tuyaHealthService");

const {
  createAlertService,
} = require("./services/alertService");

const {
  createHouseModeService,
} = require("./services/houseModeService");

const {
  findEntity,
  isEntityAvailable,
  readNumericEntity,
  readSwitchEntity,
} = require("./utils/entityHelpers");

dotenv.config();

const app = express();

const port =
  Number(process.env.PORT) ||
  3001;

const homeAssistantUrl =
  process.env.HOME_ASSISTANT_URL;

const homeAssistantToken =
  process.env.HOME_ASSISTANT_TOKEN;

const CACHE_DURATION_MS =
  10_000;

const BATTERY_CHECK_INTERVAL_MS =
  60_000;

const SAFETY_CHECK_INTERVAL_MS =
  60_000;

if (
  !homeAssistantUrl ||
  !homeAssistantToken
) {
  console.error(
    "Configuration Home Assistant manquante dans le fichier .env."
  );

  process.exit(1);
}

const homeAssistantService =
  createHomeAssistantService({
    baseUrl:
      homeAssistantUrl,

    token:
      homeAssistantToken,
  });

const alertService =
  createAlertService({
    homeAssistantService,

    stateFilePath:
      path.join(
        __dirname,
        "data",
        "alert-state.json"
      ),
  });

const houseModeService =
  createHouseModeService({
    stateFilePath:
      path.join(
        __dirname,
        "data",
        "house-mode.json"
      ),
  });

const dashboardService =
  createDashboardService({
    homeAssistantService,
    entityConfiguration,
    getWindowsHealth,
    
    buildClimateData,
    buildClimateControlData,
    buildOpeningData,
    buildWaterLeakData,
    buildSmokeData,
    buildEnergyData,
    buildLightingData,
    buildCameraData,
    buildBatteryData,
    buildServicesStatus,
    buildTuyaHealth,

    getBatteryAlertStates:
      alertService.getBatteryAlertStates,

    getWaterLeakAlertStates:
      alertService.getWaterLeakAlertStates,

    getSmokeAlertStates:
      alertService.getSmokeAlertStates,

    findEntity,
    isEntityAvailable,
    readNumericEntity,
    readSwitchEntity,

    cacheDurationMs:
      CACHE_DURATION_MS,

    homeAssistantUrl,
  });

;

const lightingRouter =
  createLightingRouter({
    homeAssistantService,
    entityConfiguration,
    dashboardService,
  });

const accessRouter =
  createAccessRouter({
    homeAssistantService,
    entityConfiguration,
    dashboardService,
  });

const climateRouter =
  createClimateRouter({
    homeAssistantService,
    entityConfiguration,
    dashboardService,
  });

const energyControlService =
  createEnergyControlService({
    entityConfiguration,
    homeAssistantService,

    clearDashboardCache:
      dashboardService
        .clearCache,
  });

homeAssistantService.subscribeStateChanges(
  async (eventData) => {
    const entityId =
      eventData?.entity_id;

    const newState =
      eventData?.new_state;

    const oldState =
      eventData?.old_state;

    if (
      !entityId ||
      !newState
    ) {
      return;
    }

    const openingSensor =
      (
        entityConfiguration
          .openings ?? []
      ).find(
        (sensor) =>
          sensor.entityId ===
          entityId
      );

    if (openingSensor) {
      const houseMode =
        houseModeService
          .getMode()
          ?.mode;

      const wasClosed =
        oldState?.state === "off";

      const isNowOpen =
        newState.state === "on";

      if (
        houseMode === "absent" &&
        wasClosed &&
        isNowOpen
      ) {
        await alertService
          .notifyAwayOpeningAlert({
            id:
              openingSensor.id,

            name:
              openingSensor.name,

            location:
              openingSensor.location,
          });
      }

      dashboardService
        .clearCache();

      return;
    }
    
    const cameraDevice =
      (
        entityConfiguration
          .cameraDevices ?? []
      ).find(
        (camera) =>
          camera.availabilityEntityId ===
          entityId
      );

    if (cameraDevice) {
      const houseMode =
        houseModeService
          .getMode()
          ?.mode;

      const wasOnline =
        oldState?.state === "on";

      const isNowOffline =
        newState.state === "off";

      if (
        houseMode === "absent" &&
        wasOnline &&
        isNowOffline
      ) {
        await alertService
          .notifyAwayCameraOfflineAlert({
            id:
              cameraDevice.id,

            name:
              cameraDevice.name,

            location:
              cameraDevice.location,
          });
      }
    

      dashboardService
        .clearCache();

      return;
    }

    const waterLeakSensor =
      (
        entityConfiguration
          .waterLeakSensors ?? []
      ).find(
        (sensor) =>
          sensor.entityId ===
          entityId
      );

    if (waterLeakSensor) {
      const available =
        newState.state !==
          "unavailable" &&
        newState.state !==
          "unknown";

      await alertService
        .processWaterLeakAlerts([
          {
            id:
              waterLeakSensor.id,

            name:
              waterLeakSensor.name,

            location:
              waterLeakSensor.location,

            available,

            leakDetected:
              available
                ? newState.state ===
                  "on"
                : null,
          },
        ]);

      dashboardService
        .clearCache();

      return;
    }

    const smokeDetector =
      (
        entityConfiguration
          .smokeDetectors ?? []
      ).find(
        (detector) =>
          detector.smokeEntityId ===
          entityId
      );

    if (smokeDetector) {
      const available =
        newState.state !==
          "unavailable" &&
        newState.state !==
          "unknown";

      await alertService
        .processSmokeAlerts([
          {
            id:
              smokeDetector.id,

            name:
              smokeDetector.name,

            location:
              smokeDetector.location,

            smokeDetected:
              available
                ? newState.state ===
                  "on"
                : null,
          },
        ]);

      dashboardService
        .clearCache();
    }
  }
);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://192.168.1.63:5173",
    ],
  })
);

app.use(
  express.json()
);

app.use(
  "/api/lighting",
  lightingRouter
);

app.use(
  "/api/access",
  accessRouter
);

app.use(
  "/api/climate",
  climateRouter
);

function getErrorDetails(
  error
) {
  return (
    error.response?.data
      ?.message ||
    error.response?.data
      ?.error ||
    error.message ||
    "Erreur inconnue"
  );
}

function getErrorStatus(
  error,
  fallback = 503
) {
  return (
    error.statusCode ||
    error.response?.status ||
    fallback
  );
}

/*
 * -------------------------------------------------
 * Surveillance automatique des alertes batteries
 * -------------------------------------------------
 */

let batteryAlertCheckRunning =
  false;

let safetyAlertCheckRunning =
  false;

async function checkBatteryAlerts() {
  if (
    batteryAlertCheckRunning
  ) {
    return;
  }

  batteryAlertCheckRunning =
    true;

  try {
    const dashboard =
      await dashboardService
        .getDashboardData(
          true
        );

    const batteries =
      dashboard
        ?.batteries
        ?.batteries ??
      [];

    const results =
      await alertService
        .processBatteryAlerts(
          batteries
        );

    const notifications =
      results.filter(
        (result) =>
          result.notified
      );

    if (
      notifications.length >
      0
    ) {
      console.log(
        `${notifications.length} notification(s) batterie DomoCenter envoyée(s).`
      );
    }
  } catch (error) {
    console.error(
      "Erreur surveillance batteries DomoCenter :",
      getErrorDetails(
        error
      )
    );
  } finally {
    batteryAlertCheckRunning =
      false;
  }
}

async function checkSafetyAlerts() {
  if (
    safetyAlertCheckRunning
  ) {
    return;
  }

  safetyAlertCheckRunning =
    true;

  try {
    const dashboard =
      await dashboardService
        .getDashboardData(
          true
        );

    const waterLeakSensors =
      dashboard
        ?.security
        ?.waterLeaks
        ?.sensors ??
      [];

    const smokeDetectors =
      dashboard
        ?.security
        ?.smoke
        ?.detectors ??
      [];

    const waterLeakResults =
      await alertService
        .processWaterLeakAlerts(
          waterLeakSensors
        );

    const smokeResults =
      await alertService
        .processSmokeAlerts(
          smokeDetectors
        );

    const waterLeakNotifications =
      waterLeakResults.filter(
        (result) =>
          result.notified
      );

    const smokeNotifications =
      smokeResults.filter(
        (result) =>
          result.notified
      );

    if (
      waterLeakNotifications.length >
      0
    ) {
      console.log(
        `${waterLeakNotifications.length} notification(s) fuite DomoCenter envoyée(s).`
      );
    }

    if (
      smokeNotifications.length >
      0
    ) {
      console.log(
        `${smokeNotifications.length} notification(s) fumée DomoCenter envoyée(s).`
      );
    }
  } catch (error) {
    console.error(
      "Erreur surveillance sécurité DomoCenter :",
      getErrorDetails(
        error
      )
    );
  } finally {
    safetyAlertCheckRunning =
      false;
  }
}

app.get(
  "/api/house-mode",
  (
    request,
    response
  ) => {
    response.json({
      current:
        houseModeService.getMode(),

      available:
        houseModeService
          .getAvailableModes(),
    });
  }
);

app.post(
  "/api/house-mode",
  async (
    request,
    response
  ) => {
    try {
      const {
        mode,
      } = request.body;

      const current =
        houseModeService
          .setMode(mode);

      dashboardService
        .clearCache();

      let awayCheck = null;

      if (mode === "absent") {
        const dashboard =
          await dashboardService
            .getDashboardData(
              true
            );

        const openings =
          dashboard
            ?.security
            ?.openings
            ?.sensors ??
          [];

        const cameras =
          dashboard
            ?.cameras
            ?.cameras ??
          [];

        awayCheck =
          await alertService
            .notifyAwayModeIssues({
              openings,
              cameras,
            });
      }

      return response.json({
        success: true,
        current,
        awayCheck,
      });
    } catch (error) {
      return response
        .status(
          getErrorStatus(
            error,
            400
          )
        )
        .json({
          success: false,
          error:
            getErrorDetails(
              error
            ),
        });
    }
  }
);

app.get(
  "/api/health",
  (
    request,
    response
  ) => {
    response.json({
      status: "ok",

      service:
        "DomoCenter Server",

      timestamp:
        new Date()
          .toISOString(),
    });
  }
);

app.get(
  "/api/homeassistant/status",
  async (
    request,
    response
  ) => {
    try {
      const homeAssistantStatus =
        await homeAssistantService
          .getStatus();

      response.json({
        connected: true,

        homeAssistantUrl,

        message:
          homeAssistantStatus
            .message,

        timestamp:
          new Date()
            .toISOString(),
      });
    } catch (error) {
      response
        .status(
          getErrorStatus(
            error
          )
        )
        .json({
          connected: false,

          error:
            "Connexion à Home Assistant impossible",

          details:
            getErrorDetails(
              error
            ),
        });
    }
  }
);

app.get(
  "/api/homeassistant/entities",
  async (
    request,
    response
  ) => {
    try {
      const entities =
        await homeAssistantService
          .getEntities();

      response.json({
        count:
          entities.length,

        entities,
      });
    } catch (error) {
      response
        .status(
          getErrorStatus(
            error
          )
        )
        .json({
          error:
            "Impossible de récupérer les entités Home Assistant",

          details:
            getErrorDetails(
              error
            ),
        });
    }
  }
);

app.get(
  "/api/dashboard",
  async (
    request,
    response
  ) => {
    try {
      const dashboard =
        await dashboardService
          .getDashboardData(
            false
          );

      response.json(
        dashboard
      );
    } catch (error) {
      response
        .status(
          getErrorStatus(
            error
          )
        )
        .json({
          error:
            "Impossible de construire le Dashboard DomoCenter",

          details:
            getErrorDetails(
              error
            ),

          system: {
            homeAssistant: {
              connected:
                false,
            },
          },
        });
    }
  }
);


app.post(
  "/api/dashboard/refresh",
  async (
    request,
    response
  ) => {
    try {
      const dashboard =
        await dashboardService
          .getDashboardData(
            true
          );

      response.json(
        dashboard
      );
    } catch (error) {
      response
        .status(
          getErrorStatus(
            error
          )
        )
        .json({
          error:
            "Impossible de synchroniser le Dashboard DomoCenter",

          details:
            getErrorDetails(
              error
            ),
        });
    }
  }
);

app.post(
  "/api/energy/:deviceId/switch",
  async (
    request,
    response
  ) => {
    try {
      const {
        deviceId,
      } = request.params;

      const {
        isOn,
      } = request.body;

      if (
        typeof isOn !==
        "boolean"
      ) {
        return response
          .status(400)
          .json({
            success:
              false,

            error:
              "Le champ isOn doit contenir true ou false.",
          });
      }

      const command =
        await energyControlService
          .setEnergyDeviceState(
            deviceId,
            isOn
          );

      await new Promise(
        (resolve) => {
          setTimeout(
            resolve,
            800
          );
        }
      );

      const dashboard =
        await dashboardService
          .getDashboardData(
            true
          );

      return response.json({
        success: true,
        command,

        energy:
          dashboard.energy,
      });
    } catch (error) {
      return response
        .status(
          getErrorStatus(
            error
          )
        )
        .json({
          success:
            false,

          error:
            "Impossible de commander cet équipement.",

          details:
            getErrorDetails(
              error
            ),
        });
    }
  }
);

app.post(
  "/api/alerts/water-leak/:sensorId/acknowledge",
  (
    request,
    response
  ) => {
    const {
      sensorId,
    } = request.params;

    const acknowledged =
      alertService
        .acknowledgeWaterLeakAlert(
          sensorId
        );

    if (!acknowledged) {
      return response
        .status(409)
        .json({
          success: false,
          error:
            "Aucune alerte fuite active à acquitter.",
        });
    }

    return response.json({
      success: true,
      sensorId,
      acknowledged: true,
    });
  }
);

app.post(
  "/api/alerts/smoke/:detectorId/acknowledge",
  (
    request,
    response
  ) => {
    const {
      detectorId,
    } = request.params;

    const acknowledged =
      alertService
        .acknowledgeSmokeAlert(
          detectorId
        );

    if (!acknowledged) {
      return response
        .status(409)
        .json({
          success: false,
          error:
            "Aucune alerte fumée active à acquitter.",
        });
    }

    return response.json({
      success: true,
      detectorId,
      acknowledged: true,
    });
  }
);

app.use(
  (
    request,
    response
  ) => {
    response
      .status(404)
      .json({
        error:
          "Route introuvable",
      });
  }
);

app.use(
  (
    error,
    request,
    response,
    next
  ) => {
    console.error(
      "Erreur API DomoCenter :",
      {
        message:
          error.message,

        status:
          error.response
            ?.status,

        data:
          error.response
            ?.data,
      }
    );

    if (
      response.headersSent
    ) {
      return next(error);
    }

    return response
      .status(
        getErrorStatus(
          error
        )
      )
      .json({
        success: false,

        error:
          "Une erreur est survenue dans l’API DomoCenter.",

        details:
          getErrorDetails(
            error
          ),
      });
  }
);

app.listen(
  port,
  "0.0.0.0",
  () => {
    console.log(
      `DomoCenter Server démarré sur http://localhost:${port}`
    );

    console.log(
      `Home Assistant configuré sur ${homeAssistantUrl}`
    );

    console.log(
      `Dashboard disponible sur http://localhost:${port}/api/dashboard`
    );

    console.log(
      `Éclairage disponible sur http://localhost:${port}/api/lighting`
    );

    console.log(
      `Accès disponible sur http://localhost:${port}/api/access`
    );

    console.log(
      `Contrôle énergie disponible sur http://localhost:${port}/api/energy/:deviceId/switch`
    );

    console.log(
      "Surveillance batteries DomoCenter active : vérification toutes les 60 secondes."
    );

    /*
     * Première vérification
     * quelques secondes après
     * le démarrage.
     */
    setTimeout(
      checkBatteryAlerts,
      3000
    );

    /*
     * Puis vérification
     * toutes les 60 secondes.
     */
    setInterval(
      checkBatteryAlerts,
      BATTERY_CHECK_INTERVAL_MS
    );

    setInterval(
      checkSafetyAlerts,
      SAFETY_CHECK_INTERVAL_MS
    );
  }
);

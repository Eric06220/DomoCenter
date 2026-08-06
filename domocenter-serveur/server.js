const {
  createDashboardService,
} = require("./services/dashboardService");

const {
  createLightingRouter,
} = require("./lightingRoutes");

const {
  createAccessRouter,
} = require("./accessRoutes");

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const {
  buildClimateData,
} = require("./services/climateService");

const entityConfiguration = require("./config/devices");

const {
  buildOpeningData,
} = require("./services/securityService");

const {
  buildEnergyData,
} = require("./services/energyService");

const {
  buildLightingData,
} = require("./services/lightingService");

const {
  createHomeAssistantService,
} = require("./services/homeAssistantService");

const {
  createEnergyControlService,
} = require("./services/energyControlService");

const {
  buildInfrastructureData,
} = require("./services/infrastructureService");

const {
  buildServicesStatus,
} = require("./services/servicesStatusService");

const {
  findEntity,
  isEntityAvailable,
  readNumericEntity,
  readSwitchEntity,
} = require("./utils/entityHelpers");

dotenv.config();

const app = express();

const port = Number(process.env.PORT) || 3001;
const homeAssistantUrl =
  process.env.HOME_ASSISTANT_URL;
const homeAssistantToken =
  process.env.HOME_ASSISTANT_TOKEN;

const CACHE_DURATION_MS = 10_000;

if (!homeAssistantUrl || !homeAssistantToken) {
  console.error(
    "Configuration Home Assistant manquante dans le fichier .env."
  );

  process.exit(1);
}

const homeAssistantService =
  createHomeAssistantService({
    baseUrl: homeAssistantUrl,
    token: homeAssistantToken,
  });

const dashboardService =
  createDashboardService({
    homeAssistantService,
    entityConfiguration,
    buildClimateData,
    buildOpeningData,
    buildEnergyData,
    buildLightingData,
    buildInfrastructureData,
    buildServicesStatus,
    findEntity,
    isEntityAvailable,
    readNumericEntity,
    readSwitchEntity,
    cacheDurationMs: CACHE_DURATION_MS,
    homeAssistantUrl,
  });

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

const energyControlService =
  createEnergyControlService({
    entityConfiguration,
    homeAssistantService,
    clearDashboardCache:
      dashboardService.clearCache,
  });

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.use("/api/lighting", lightingRouter);
app.use("/api/access", accessRouter);

function getErrorDetails(error) {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "Erreur inconnue"
  );
}

function getErrorStatus(error, fallback = 503) {
  return (
    error.statusCode ||
    error.response?.status ||
    fallback
  );
}

app.get("/api/health", (request, response) => {
  response.json({
    status: "ok",
    service: "DomoCenter Server",
    timestamp: new Date().toISOString(),
  });
});

app.get(
  "/api/homeassistant/status",
  async (request, response) => {
    try {
      const homeAssistantStatus =
        await homeAssistantService.getStatus();

      response.json({
        connected: true,
        homeAssistantUrl,
        message:
          homeAssistantStatus.message,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      response
        .status(getErrorStatus(error))
        .json({
          connected: false,
          error:
            "Connexion à Home Assistant impossible",
          details:
            getErrorDetails(error),
        });
    }
  }
);

app.get(
  "/api/homeassistant/entities",
  async (request, response) => {
    try {
      const entities =
        await homeAssistantService.getEntities();

      response.json({
        count: entities.length,
        entities,
      });
    } catch (error) {
      response
        .status(getErrorStatus(error))
        .json({
          error:
            "Impossible de récupérer les entités Home Assistant",
          details:
            getErrorDetails(error),
        });
    }
  }
);

app.get(
  "/api/dashboard",
  async (request, response) => {
    try {
      const dashboard =
        await dashboardService.getDashboardData(
          false
        );

      response.json(dashboard);
    } catch (error) {
      response
        .status(getErrorStatus(error))
        .json({
          error:
            "Impossible de construire le Dashboard DomoCenter",
          details:
            getErrorDetails(error),

          system: {
            homeAssistant: {
              connected: false,
            },
          },
        });
    }
  }
);

app.post(
  "/api/dashboard/refresh",
  async (request, response) => {
    try {
      const dashboard =
        await dashboardService.getDashboardData(
          true
        );

      response.json(dashboard);
    } catch (error) {
      response
        .status(getErrorStatus(error))
        .json({
          error:
            "Impossible de synchroniser le Dashboard DomoCenter",
          details:
            getErrorDetails(error),
        });
    }
  }
);

app.post(
  "/api/energy/:deviceId/switch",
  async (request, response) => {
    try {
      const { deviceId } = request.params;
      const { isOn } = request.body;

      if (typeof isOn !== "boolean") {
        return response
          .status(400)
          .json({
            success: false,
            error:
              "Le champ isOn doit contenir true ou false.",
          });
      }

      const command =
        await energyControlService.setEnergyDeviceState(
          deviceId,
          isOn
        );

      await new Promise((resolve) => {
        setTimeout(resolve, 800);
      });

      const dashboard =
        await dashboardService.getDashboardData(
          true
        );

      return response.json({
        success: true,
        command,
        energy: dashboard.energy,
      });
    } catch (error) {
      return response
        .status(getErrorStatus(error))
        .json({
          success: false,
          error:
            "Impossible de commander cet équipement.",
          details:
            getErrorDetails(error),
        });
    }
  }
);

app.use((request, response) => {
  response.status(404).json({
    error: "Route introuvable",
  });
});

app.use(
  (error, request, response, next) => {
    console.error(
      "Erreur API DomoCenter :",
      {
        message: error.message,
        status:
          error.response?.status,
        data:
          error.response?.data,
      }
    );

    if (response.headersSent) {
      return next(error);
    }

    return response
      .status(getErrorStatus(error))
      .json({
        success: false,
        error:
          "Une erreur est survenue dans l’API DomoCenter.",
        details:
          getErrorDetails(error),
      });
  }
);

app.listen(port, () => {
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
});

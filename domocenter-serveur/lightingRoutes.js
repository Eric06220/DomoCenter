const express = require("express");

function createLightingRouter({
  homeAssistantService,
  entityConfiguration,
  dashboardService,
}) {
  const router = express.Router();

  router.get("/", async (request, response, next) => {
    try {
      const dashboard =
        await dashboardService.getDashboardData();

      response.json(
        dashboard.lighting ?? {
          devices: [],
          totalCount: 0,
          activeCount: 0,
          unavailableCount: 0,
        }
      );
    } catch (error) {
      next(error);
    }
  });

  router.post(
    "/:deviceId/switch",
    async (request, response, next) => {
      try {
        const { deviceId } = request.params;
        const { isOn } = request.body;

        if (typeof isOn !== "boolean") {
          return response.status(400).json({
            error:
              "Le champ isOn doit être un booléen.",
          });
        }

        const device =
          entityConfiguration.lightingDevices?.find(
            (candidate) =>
              candidate.id === deviceId
          );

        if (!device) {
          return response.status(404).json({
            error:
              "Équipement d’éclairage introuvable.",
          });
        }

        await homeAssistantService.setSwitchState(
          device.entityId,
          isOn
        );

        dashboardService.clearCache();

        const dashboard =
          await dashboardService.getDashboardData(true);

        const updatedDevice =
          dashboard.lighting?.devices?.find(
            (candidate) =>
              candidate.id === deviceId
          );

        return response.json({
          success: true,
          device: updatedDevice ?? null,
        });
      } catch (error) {
        console.error("Commande éclairage impossible :", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });

        return response.status(502).json({
          error: "Home Assistant a refusé la commande.",
          details:
            error.response?.data ??
            error.message,
        });
      }
    }
  );

  return router;
}

module.exports = {
  createLightingRouter,
};



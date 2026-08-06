const express = require("express");

function createAccessRouter({
  homeAssistantService,
  entityConfiguration,
  dashboardService,
}) {
  const router = express.Router();

  router.get("/", async (request, response, next) => {
    try {
      const dashboard =
        await dashboardService.getDashboardData(false);

      const portal =
        entityConfiguration.accessDevices?.find(
          (device) => device.id === "portail"
        );

      return response.json({
        openings:
          dashboard.security?.openings ?? {
            total: 0,
            open: 0,
            closed: 0,
            unavailable: 0,
            sensors: [],
          },

        portal: portal
          ? {
              id: portal.id,
              name: portal.name,
              location: portal.location,
              available: true,
              actionType: "pulse",
            }
          : null,
      });
    } catch (error) {
      next(error);
    }
  });

  router.post(
    "/portail/trigger",
    async (request, response, next) => {
      try {
        const portal =
          entityConfiguration.accessDevices?.find(
            (device) => device.id === "portail"
          );

        if (!portal) {
          return response.status(404).json({
            success: false,
            error:
              "Le portail n'est pas configuré dans DomoCenter.",
          });
        }

        await homeAssistantService.setSwitchState(
          portal.entityId,
          true
        );

        dashboardService.clearCache();

        return response.json({
          success: true,
          portal: {
            id: portal.id,
            name: portal.name,
            location: portal.location,
          },
        });
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
}

module.exports = {
  createAccessRouter,
};

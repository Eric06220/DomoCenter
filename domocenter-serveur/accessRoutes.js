const express = require("express");

function createAccessRouter({
  homeAssistantService,
  entityConfiguration,
  dashboardService,
}) {
  const router = express.Router();

  const PORTAL_PULSE_DURATION_MS = 700;

  router.get(
    "/",
    async (
      request,
      response,
      next
    ) => {
      try {
        const dashboard =
          await dashboardService
            .getDashboardData(false);

        const portal =
          entityConfiguration
            .accessDevices
            ?.find(
              (device) =>
                device.id ===
                "portail"
            );

        return response.json({
          openings:
            dashboard
              .security
              ?.openings ?? {
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
                location:
                  portal.location,
                available: true,
                actionType:
                  "pulse",
              }
            : null,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  router.post(
    "/portail/trigger",
    async (
      request,
      response,
      next
    ) => {
      try {
        const portal =
          entityConfiguration
            .accessDevices
            ?.find(
              (device) =>
                device.id ===
                "portail"
            );

        if (!portal) {
          return response
            .status(404)
            .json({
              success: false,

              error:
                "Le portail n'est pas configuré dans DomoCenter.",
            });
        }

        /*
         * Début de l'impulsion.
         */
        await homeAssistantService
          .setSwitchState(
            portal.entityId,
            true
          );

        /*
         * Durée de l'impulsion.
         */
        await new Promise(
          (resolve) => {
            setTimeout(
              resolve,
              PORTAL_PULSE_DURATION_MS
            );
          }
        );

        /*
         * Fin de l'impulsion.
         *
         * On force le retour à OFF :
         * DomoCenter ne considère jamais
         * cette entité comme un état
         * ouvert / fermé du portail.
         */
        await homeAssistantService
          .setSwitchState(
            portal.entityId,
            false
          );

        dashboardService
          .clearCache();

        return response.json({
          success: true,

          action:
            "pulse",

          durationMs:
            PORTAL_PULSE_DURATION_MS,

          portal: {
            id: portal.id,
            name: portal.name,
            location:
              portal.location,
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

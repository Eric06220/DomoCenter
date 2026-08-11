const express = require("express");

function createAccessRouter({
  homeAssistantService,
  entityConfiguration,
  dashboardService,
}) {
  const router = express.Router();

  const PORTAL_PULSE_DURATION_MS = 700;

  function getAccessDevice(deviceId) {
    return entityConfiguration
      .accessDevices
      ?.find(
        (device) =>
          device.id === deviceId
      );
  }

  async function sendPulse(
    entityId,
    durationMs = 700
  ) {
    await homeAssistantService
      .setSwitchState(
        entityId,
        true
      );

    await new Promise(
      (resolve) => {
        setTimeout(
          resolve,
          durationMs
        );
      }
    );

    await homeAssistantService
      .setSwitchState(
        entityId,
        false
      );
  }

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
          getAccessDevice(
            "portail"
          );

        const shutters =
          (
            entityConfiguration
              .accessDevices ?? []
          )
            .filter(
              (device) =>
                device.actionType ===
                "dual-pulse"
            )
            .map(
              (device) => ({
                id: device.id,
                name: device.name,
                location:
                  device.location,
                actionType:
                  "dual-pulse",
                available: true,
              })
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

          shutters,
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
          getAccessDevice(
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

        await sendPulse(
          portal.entityId,
          PORTAL_PULSE_DURATION_MS
        );

        dashboardService
          .clearCache();

        return response.json({
          success: true,
          action: "pulse",
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

  router.post(
    "/:deviceId/:action",
    async (
      request,
      response,
      next
    ) => {
      try {
        const {
          deviceId,
          action,
        } = request.params;

        if (
          action !== "open" &&
          action !== "close"
        ) {
          return response
            .status(400)
            .json({
              success: false,
              error:
                "Commande de volet invalide.",
            });
        }

        const shutter =
          getAccessDevice(
            deviceId
          );

        if (
          !shutter ||
          shutter.actionType !==
            "dual-pulse"
        ) {
          return response
            .status(404)
            .json({
              success: false,
              error:
                "Volet non configuré dans DomoCenter.",
            });
        }

        const targetEntityId =
          action === "open"
            ? shutter.openEntityId
            : shutter.closeEntityId;

        const oppositeEntityId =
          action === "open"
            ? shutter.closeEntityId
            : shutter.openEntityId;

        if (
          !targetEntityId ||
          !oppositeEntityId
        ) {
          return response
            .status(500)
            .json({
              success: false,
              error:
                "Configuration du volet incomplète.",
            });
        }

        /*
         * Sécurité :
         * le relais opposé est forcé
         * à OFF avant toute impulsion.
         */
        await homeAssistantService
          .setSwitchState(
            oppositeEntityId,
            false
          );

        const durationMs =
          shutter
            .pulseDurationMs ??
          700;

        await sendPulse(
          targetEntityId,
          durationMs
        );

        dashboardService
          .clearCache();

        return response.json({
          success: true,
          action,
          durationMs,

          shutter: {
            id: shutter.id,
            name: shutter.name,
            location:
              shutter.location,
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

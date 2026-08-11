const express = require("express");

function createClimateRouter({
  homeAssistantService,
  entityConfiguration,
  dashboardService,
}) {
  const router = express.Router();

  function getClimateDevice(deviceId) {
    return entityConfiguration
      .climateDevices
      ?.find(
        (device) =>
          device.id === deviceId
      );
  }

  async function refreshClimateDevice(
    deviceId
  ) {
    dashboardService.clearCache();

    const dashboard =
      await dashboardService
        .getDashboardData(true);

    return dashboard
      .climateControl
      ?.devices
      ?.find(
        (device) =>
          device.id === deviceId
      ) ?? null;
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

        return response.json(
          dashboard
            .climateControl ?? {
            totalCount: 0,
            availableCount: 0,
            activeCount: 0,
            devices: [],
          }
        );
      } catch (error) {
        next(error);
      }
    }
  );

  router.post(
    "/:deviceId/power",
    async (
      request,
      response,
      next
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
              success: false,

              error:
                "Le champ isOn doit être un booléen.",
            });
        }

        const device =
          getClimateDevice(
            deviceId
          );

        if (!device) {
          return response
            .status(404)
            .json({
              success: false,

              error:
                "Climatisation introuvable.",
            });
        }

        await homeAssistantService
          .callClimateService(
            isOn
              ? "turn_on"
              : "turn_off",
            device.entityId
          );

        await new Promise(
          (resolve) => {
            setTimeout(
              resolve,
              700
            );
          }
        );

        const updatedDevice =
          await refreshClimateDevice(
            deviceId
          );

        return response.json({
          success: true,
          device:
            updatedDevice,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  router.post(
    "/:deviceId/temperature",
    async (
      request,
      response,
      next
    ) => {
      try {
        const {
          deviceId,
        } = request.params;

        const {
          temperature,
        } = request.body;

        if (
          !Number.isFinite(
            temperature
          )
        ) {
          return response
            .status(400)
            .json({
              success: false,

              error:
                "Température de consigne invalide.",
            });
        }

        const device =
          getClimateDevice(
            deviceId
          );

        if (!device) {
          return response
            .status(404)
            .json({
              success: false,

              error:
                "Climatisation introuvable.",
            });
        }

        await homeAssistantService
          .callClimateService(
            "set_temperature",
            device.entityId,
            {
              temperature,
            }
          );

        const updatedDevice =
          await refreshClimateDevice(
            deviceId
          );

        return response.json({
          success: true,
          device:
            updatedDevice,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  router.post(
    "/:deviceId/hvac-mode",
    async (
      request,
      response,
      next
    ) => {
      try {
        const {
          deviceId,
        } = request.params;

        const {
          hvacMode,
        } = request.body;

        if (
          typeof hvacMode !==
            "string" ||
          !hvacMode
        ) {
          return response
            .status(400)
            .json({
              success: false,

              error:
                "Mode HVAC invalide.",
            });
        }

        const device =
          getClimateDevice(
            deviceId
          );

        if (!device) {
          return response
            .status(404)
            .json({
              success: false,

              error:
                "Climatisation introuvable.",
            });
        }

        await homeAssistantService
          .callClimateService(
            "set_hvac_mode",
            device.entityId,
            {
              hvac_mode:
                hvacMode,
            }
          );

        const updatedDevice =
          await refreshClimateDevice(
            deviceId
          );

        return response.json({
          success: true,
          device:
            updatedDevice,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  router.post(
    "/:deviceId/fan-mode",
    async (
      request,
      response,
      next
    ) => {
      try {
        const {
          deviceId,
        } = request.params;

        const {
          fanMode,
        } = request.body;

        if (
          typeof fanMode !==
            "string" ||
          !fanMode
        ) {
          return response
            .status(400)
            .json({
              success: false,

              error:
                "Mode de ventilation invalide.",
            });
        }

        const device =
          getClimateDevice(
            deviceId
          );

        if (!device) {
          return response
            .status(404)
            .json({
              success: false,

              error:
                "Climatisation introuvable.",
            });
        }

        await homeAssistantService
          .callClimateService(
            "set_fan_mode",
            device.entityId,
            {
              fan_mode:
                fanMode,
            }
          );

        const updatedDevice =
          await refreshClimateDevice(
            deviceId
          );

        return response.json({
          success: true,
          device:
            updatedDevice,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  router.post(
    "/:deviceId/preset-mode",
    async (
      request,
      response,
      next
    ) => {
      try {
        const {
          deviceId,
        } = request.params;

        const {
          presetMode,
        } = request.body;

        if (
          typeof presetMode !==
            "string" ||
          !presetMode
        ) {
          return response
            .status(400)
            .json({
              success: false,

              error:
                "Preset invalide.",
            });
        }

        const device =
          getClimateDevice(
            deviceId
          );

        if (!device) {
          return response
            .status(404)
            .json({
              success: false,

              error:
                "Climatisation introuvable.",
            });
        }

        await homeAssistantService
          .callClimateService(
            "set_preset_mode",
            device.entityId,
            {
              preset_mode:
                presetMode,
            }
          );

        const updatedDevice =
          await refreshClimateDevice(
            deviceId
          );

        return response.json({
          success: true,
          device:
            updatedDevice,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  router.post(
    "/:deviceId/swing-mode",
    async (
      request,
      response,
      next
    ) => {
      try {
        const {
          deviceId,
        } = request.params;

        const {
          swingMode,
        } = request.body;

        if (
          typeof swingMode !==
            "string" ||
          !swingMode
        ) {
          return response
            .status(400)
            .json({
              success: false,

              error:
                "Mode d'oscillation invalide.",
            });
        }

        const device =
          getClimateDevice(
            deviceId
          );

        if (!device) {
          return response
            .status(404)
            .json({
              success: false,

              error:
                "Climatisation introuvable.",
            });
        }

        await homeAssistantService
          .callClimateService(
            "set_swing_mode",
            device.entityId,
            {
              swing_mode:
                swingMode,
            }
          );

        const updatedDevice =
          await refreshClimateDevice(
            deviceId
          );

        return response.json({
          success: true,
          device:
            updatedDevice,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
}

module.exports = {
  createClimateRouter,
};

const axios = require("axios");
const WebSocket = require("ws");

function createHomeAssistantService({
  baseUrl,
  token,
  timeoutMs = 10_000,
}) {
  if (!baseUrl || !token) {
    throw new Error(
      "Configuration Home Assistant incomplète : URL ou jeton manquant."
    );
  }

  const api = axios.create({
    baseURL: `${baseUrl}/api`,
    timeout: timeoutMs,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  async function getStatus() {
    const response = await api.get("/");
    return response.data;
  }

  async function getEntities() {
    const response = await api.get("/states");

    if (!Array.isArray(response.data)) {
      throw new Error(
        "Home Assistant n'a pas renvoyé une liste d'entités valide."
      );
    }

    return response.data;
  }

  async function setSwitchState(entityId, isOn) {
    if (!entityId) {
      throw new Error(
        "Identifiant de l'interrupteur manquant."
      );
    }

    if (typeof isOn !== "boolean") {
      throw new Error(
        "L'état demandé doit être true ou false."
      );
    }

    const serviceName = isOn
      ? "turn_on"
      : "turn_off";

    try {
      await api.post(
        `/services/switch/${serviceName}`,
        {
          entity_id: entityId,
        }
      );
    } catch (error) {
      console.error(
        "Erreur de commande Home Assistant :",
        {
          status: error.response?.status,
          data: error.response?.data,
          entityId,
          serviceName,
        }
      );

      throw error;
    }
  }

  async function callClimateService(
  serviceName,
  entityId,
  data = {}
) {
  if (!serviceName) {
    throw new Error(
      "Service climate manquant."
    );
  }

  if (!entityId) {
    throw new Error(
      "Entité climate manquante."
    );
  }

  try {
    await api.post(
      `/services/climate/${serviceName}`,
      {
        entity_id: entityId,
        ...data,
      }
    );
  } catch (error) {
    console.error(
      "Erreur commande climatisation Home Assistant :",
      {
        serviceName,
        entityId,
        data,
        status:
          error.response?.status,
        response:
          error.response?.data,
      }
    );

    throw error;
  }
}


    async function sendNotification({
    message,
    entityId = "notify.iphone",
    critical = false,
  }) {
    if (!message) {
      throw new Error(
        "Message de notification manquant."
      );
    }

    if (!entityId) {
      throw new Error(
        "Entité de notification manquante."
      );
    }

    const payload = {
      entity_id: entityId,
      message,
    };

    if (critical) {
      payload.data = {
        push: {
          sound: {
            name: "default",
            critical: 1,
            volume: 1.0,
          },
        },
      };
    }

    try {
      if (critical) {
        await api.post(
          "/services/notify/notify",
          {
            message,
            data: {
              push: {
                sound: {
                  name: "default",
                  critical: 1,
                  volume: 1,
                },
              },
            },
          }
        );
      } else {
        await api.post(
          "/services/notify/send_message",
          payload
        );
      }

      console.log(
        `Notification DomoCenter envoyée vers ${entityId}`
      );
    } catch (error) {
      console.error(
        "Erreur notification DomoCenter :",
        {
          status: error.response?.status,
          data: error.response?.data,
          entityId,
          message,
          critical,
        }
      );

      throw error;
    }
  }

    function subscribeStateChanges(
    onStateChanged
  ) {
    if (
      typeof onStateChanged !==
      "function"
    ) {
      throw new Error(
        "Callback state_changed manquant."
      );
    }

    const websocketUrl =
      baseUrl.replace(
        /^http/,
        "ws"
      ) + "/api/websocket";

    let socket = null;
    let subscriptionId = 1;
    let reconnectTimer = null;
    let stopped = false;

    function connect() {
      if (stopped) {
        return;
      }

      socket =
        new WebSocket(
          websocketUrl
        );

      socket.on(
        "message",
        (rawMessage) => {
          let message;

          try {
            message =
              JSON.parse(
                rawMessage.toString()
              );
          } catch {
            return;
          }

          if (
            message.type ===
            "auth_required"
          ) {
            socket.send(
              JSON.stringify({
                type: "auth",
                access_token:
                  token,
              })
            );

            return;
          }

          if (
            message.type ===
            "auth_ok"
          ) {
            socket.send(
              JSON.stringify({
                id:
                  subscriptionId,
                type:
                  "subscribe_events",
                event_type:
                  "state_changed",
              })
            );

            console.log(
              "DomoCenter WebSocket Home Assistant connecté."
            );

            return;
          }

          if (
            message.type ===
              "event" &&
            message.event
              ?.event_type ===
              "state_changed"
          ) {
            try {
              onStateChanged(
                message.event.data
              );
            } catch (error) {
              console.error(
                "Erreur traitement événement Home Assistant :",
                error.message
              );
            }
          }
        }
      );

      socket.on(
        "close",
        () => {
          if (stopped) {
            return;
          }

          console.warn(
            "WebSocket Home Assistant déconnecté. Reconnexion dans 5 secondes."
          );

          reconnectTimer =
            setTimeout(
              connect,
              5000
            );
        }
      );

      socket.on(
        "error",
        (error) => {
          console.error(
            "Erreur WebSocket Home Assistant :",
            error.message
          );
        }
      );
    }

    connect();

    return function unsubscribe() {
      stopped = true;

      if (reconnectTimer) {
        clearTimeout(
          reconnectTimer
        );
      }

      if (socket) {
        socket.close();
      }
    };
  }

  return {
    getStatus,
    getEntities,
    setSwitchState,
    callClimateService,
    sendNotification,
    subscribeStateChanges,
  };
}

module.exports = {
  createHomeAssistantService,
};

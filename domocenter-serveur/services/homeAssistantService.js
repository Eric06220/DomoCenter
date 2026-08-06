const axios = require("axios");

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
      throw new Error("Identifiant de l'interrupteur manquant.");
    }

    if (typeof isOn !== "boolean") {
      throw new Error("L'état demandé doit être true ou false.");
    }

    const serviceName = isOn ? "turn_on" : "turn_off";

    try {
      await api.post(`/services/switch/${serviceName}`, {
        entity_id: entityId,
      });
    } catch (error) {
      console.error("Erreur de commande Home Assistant :", {
        status: error.response?.status,
        data: error.response?.data,
        entityId,
        serviceName,
      });

      throw error;
    }

  }

  return {
    getStatus,
    getEntities,
    setSwitchState,
  };
}

module.exports = {
  createHomeAssistantService,
};


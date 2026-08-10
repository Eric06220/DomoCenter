const API_URL = "http://192.168.1.120:3001";

async function fetchJson(path, options = {}) {
  const response = await fetch(
    `${API_URL}${path}`,
    options
  );

  if (!response.ok) {
    let details;

    try {
      const errorData =
        await response.json();

      details =
        errorData.details ||
        errorData.error;
    } catch {
      details = undefined;
    }

    throw new Error(
      details ||
        `Erreur du serveur DomoCenter : ${response.status}`
    );
  }

  return response.json();
}

export async function getDashboardData() {
  return fetchJson(
    "/api/dashboard"
  );
}

export async function refreshDashboardData() {
  return fetchJson(
    "/api/dashboard/refresh",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
    }
  );
}

export async function setLightingDeviceState(
  deviceId,
  isOn
) {
  return fetchJson(
    `/api/lighting/${deviceId}/switch`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        isOn,
      }),
    }
  );
}

export async function getAccessData() {
  return fetchJson(
    "/api/access"
  );
}

export async function triggerPortal() {
  return fetchJson(
    "/api/access/portail/trigger",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
    }
  );
}


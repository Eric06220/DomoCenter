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

export async function getClimateData() {
  return fetchJson(
    "/api/climate"
  );
}

export async function setClimatePower(
  deviceId,
  isOn
) {
  return fetchJson(
    `/api/climate/${deviceId}/power`,
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

export async function setClimateTemperature(
  deviceId,
  temperature
) {
  return fetchJson(
    `/api/climate/${deviceId}/temperature`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        temperature,
      }),
    }
  );
}

export async function setClimateHvacMode(
  deviceId,
  hvacMode
) {
  return fetchJson(
    `/api/climate/${deviceId}/hvac-mode`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        hvacMode,
      }),
    }
  );
}

export async function setClimateFanMode(
  deviceId,
  fanMode
) {
  return fetchJson(
    `/api/climate/${deviceId}/fan-mode`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        fanMode,
      }),
    }
  );
}

export async function setClimateSwingMode(
  deviceId,
  swingMode
) {
  return fetchJson(
    `/api/climate/${deviceId}/swing-mode`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        swingMode,
      }),
    }
  );
}
export async function getShuttersData() {
  return fetchJson(
    "/api/access"
  );
}

export async function triggerShutter(
  deviceId,
  action
) {
  return fetchJson(
    `/api/access/${deviceId}/${action}`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
    }
  );
}

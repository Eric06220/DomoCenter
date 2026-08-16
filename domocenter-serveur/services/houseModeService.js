const fs = require("fs");
const path = require("path");

const HOUSE_MODES = [
  "present",
  "absent",
  "vacation",
  "maintenance",
];

const DEFAULT_MODE = "present";

function createHouseModeService({
  stateFilePath,
}) {
  let state = {
    mode: DEFAULT_MODE,
    updatedAt: null,
  };

  function ensureDirectory() {
    const directory =
      path.dirname(stateFilePath);

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, {
        recursive: true,
      });
    }
  }

  function loadState() {
    try {
      if (
        !fs.existsSync(stateFilePath)
      ) {
        return;
      }

      const content =
        fs.readFileSync(
          stateFilePath,
          "utf8"
        );

      const savedState =
        JSON.parse(content);

      if (
        HOUSE_MODES.includes(
          savedState?.mode
        )
      ) {
        state = {
          mode: savedState.mode,

          updatedAt:
            savedState.updatedAt ??
            null,
        };
      }
    } catch (error) {
      console.error(
        "Impossible de charger le mode maison DomoCenter :",
        error.message
      );
    }
  }

  function saveState() {
    ensureDirectory();

    fs.writeFileSync(
      stateFilePath,
      JSON.stringify(
        state,
        null,
        2
      ),
      "utf8"
    );
  }

  function getMode() {
    return {
      ...state,
    };
  }

  function setMode(mode) {
    if (
      !HOUSE_MODES.includes(mode)
    ) {
      const error =
        new Error(
          `Mode maison invalide : ${mode}`
        );

      error.statusCode = 400;

      throw error;
    }

    state = {
      mode,

      updatedAt:
        new Date().toISOString(),
    };

    saveState();

    return getMode();
  }

  function getAvailableModes() {
    return [
      {
        id: "present",
        name: "Présent",
      },
      {
        id: "absent",
        name: "Absent",
      },
      {
        id: "vacation",
        name: "Congés",
      },
      {
        id: "maintenance",
        name: "Maintenance",
      },
    ];
  }

  loadState();

  return {
    getMode,
    setMode,
    getAvailableModes,
  };
}

module.exports = {
  createHouseModeService,
};

import { useMemo, useState } from "react";

import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Switch,
  Typography,
} from "@mui/material";

import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import PoolRoundedIcon from "@mui/icons-material/PoolRounded";
import ForestRoundedIcon from "@mui/icons-material/ForestRounded";
import DeckRoundedIcon from "@mui/icons-material/DeckRounded";
import ChairRoundedIcon from "@mui/icons-material/ChairRounded";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";
import PowerRoundedIcon from "@mui/icons-material/PowerRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

import useHomeAssistant from "../hooks/useHomeAssistant";

import {
  setLightingDeviceState,
} from "../services/homeAssistantApi";

function getDeviceIcon(device) {
  if (device.icon === "outlet") {
    return <PowerRoundedIcon />;
  }

  switch (device.group) {
    case "Piscine":
      return <PoolRoundedIcon />;

    case "Jardin":
      return <ForestRoundedIcon />;

    case "Extérieur":
      return <DeckRoundedIcon />;

    case "Maison":
      return <ChairRoundedIcon />;

    default:
      return <LightbulbRoundedIcon />;
  }
}

function LightingPage() {
  const {
    dashboard,
    refreshing,
    error,
    refreshDashboard,
  } = useHomeAssistant(10000);

  const [commandingDeviceId, setCommandingDeviceId] =
    useState(null);

  const [commandError, setCommandError] =
    useState("");

  /*
   * État visuel temporaire.
   *
   * Il permet au bouton de changer
   * immédiatement dès le premier clic,
   * sans attendre la remontée Home Assistant.
   */
  const [optimisticStates, setOptimisticStates] =
    useState({});

  const lighting =
    dashboard?.lighting ?? null;

  const backendDevices =
    lighting?.devices ?? [];

  /*
   * On applique l'état optimiste uniquement
   * lorsqu'une commande est en attente.
   */
  const devices = useMemo(
    () =>
      backendDevices.map((device) => {
        if (
          Object.prototype.hasOwnProperty.call(
            optimisticStates,
            device.id
          )
        ) {
          return {
            ...device,
            isOn:
              optimisticStates[
                device.id
              ],
          };
        }

        return device;
      }),
    [
      backendDevices,
      optimisticStates,
    ]
  );

  const activeDevices =
    devices.filter(
      (device) =>
        device.available &&
        device.isOn
    ).length;

  const unavailableDevices =
    lighting?.unavailableCount ?? 0;

  async function handleToggle(
    device
  ) {
    if (
      !device.available ||
      commandingDeviceId
    ) {
      return;
    }

    const previousState =
      device.isOn;

    const requestedState =
      !previousState;

    setCommandError("");

    setCommandingDeviceId(
      device.id
    );

    /*
     * Mise à jour visuelle immédiate.
     */
    setOptimisticStates(
      (current) => ({
        ...current,
        [device.id]:
          requestedState,
      })
    );

    try {
      await setLightingDeviceState(
        device.id,
        requestedState
      );

      /*
       * On laisse un peu de temps
       * à Home Assistant pour publier
       * réellement le nouvel état.
       */
      await new Promise(
        (resolve) => {
          setTimeout(
            resolve,
            1200
          );
        }
      );

      await refreshDashboard();

      /*
       * Une fois Home Assistant relu,
       * on retire l'état temporaire.
       */
      setOptimisticStates(
        (current) => {
          const next = {
            ...current,
          };

          delete next[
            device.id
          ];

          return next;
        }
      );
    } catch (commandFailure) {
      /*
       * En cas d'échec,
       * retour à l'état précédent.
       */
      setOptimisticStates(
        (current) => {
          const next = {
            ...current,
          };

          delete next[
            device.id
          ];

          return next;
        }
      );

      setCommandError(
        commandFailure.message ||
          "Impossible de commander cet équipement."
      );
    } finally {
      setCommandingDeviceId(
        null
      );
    }
  }

  return (
    <Box
      sx={{
        p: {
          xs: 2,
          md: 3,
        },
      }}
    >
      <Stack spacing={3}>
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
            >
              Éclairage
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
            >
              Commande réelle des éclairages,
              prises et interrupteurs connectés
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
          >
            <Chip
              icon={
                <CheckCircleRoundedIcon />
              }
              label={`${activeDevices} équipement${
                activeDevices > 1
                  ? "s"
                  : ""
              } actif${
                activeDevices > 1
                  ? "s"
                  : ""
              }`}
              color={
                activeDevices > 0
                  ? "primary"
                  : "default"
              }
              variant={
                activeDevices > 0
                  ? "filled"
                  : "outlined"
              }
            />

            {unavailableDevices > 0 && (
              <Chip
                icon={
                  <ErrorOutlineRoundedIcon />
                }
                label={`${unavailableDevices} indisponible${
                  unavailableDevices > 1
                    ? "s"
                    : ""
                }`}
                color="warning"
                variant="outlined"
              />
            )}
          </Stack>
        </Stack>

        {error && (
          <Alert severity="error">
            Impossible de récupérer les
            éclairages : {error}
          </Alert>
        )}

        {commandError && (
          <Alert
            severity="error"
            onClose={() =>
              setCommandError("")
            }
          >
            {commandError}
          </Alert>
        )}

        {!error && (
          <Alert severity="success">
            Les états affichés proviennent
            directement de Home Assistant.
            Les interrupteurs commandent les
            vrais équipements.
          </Alert>
        )}

        <Grid
          container
          spacing={2}
        >
          {devices.map(
            (device) => {
              const commanding =
                commandingDeviceId ===
                device.id;

              return (
                <Grid
                  key={device.id}
                  size={{
                    xs: 12,
                    sm: 6,
                    lg: 4,
                  }}
                >
                  <Card
                    sx={{
                      height: "100%",

                      borderColor:
                        device.isOn
                          ? "primary.light"
                          : "divider",

                      bgcolor:
                        device.isOn
                          ? "rgba(37, 99, 235, 0.035)"
                          : "background.paper",

                      opacity:
                        device.available
                          ? 1
                          : 0.65,
                    }}
                  >
                    <CardContent
                      sx={{
                        p: 2.5,
                      }}
                    >
                      <Stack
                        spacing={2.25}
                      >
                        <Stack
                          direction="row"
                          alignItems="flex-start"
                          justifyContent="space-between"
                          spacing={2}
                        >
                          <Box
                            sx={{
                              width: 50,
                              height: 50,

                              display:
                                "grid",

                              placeItems:
                                "center",

                              borderRadius:
                                3,

                              bgcolor:
                                device.isOn
                                  ? "primary.main"
                                  : "action.hover",

                              color:
                                device.isOn
                                  ? "primary.contrastText"
                                  : "text.secondary",
                            }}
                          >
                            {getDeviceIcon(
                              device
                            )}
                          </Box>

                          <Switch
                            checked={
                              device.isOn
                            }
                            disabled={
                              !device.available ||
                              commanding ||
                              refreshing
                            }
                            onChange={() =>
                              handleToggle(
                                device
                              )
                            }
                            inputProps={{
                              "aria-label":
                                `Activer ou désactiver ${device.name}`,
                            }}
                          />
                        </Stack>

                        <Box>
                          <Typography
                            variant="h6"
                            fontWeight={800}
                          >
                            {device.name}
                          </Typography>

                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.75}
                            sx={{
                              mt: 0.5,
                            }}
                          >
                            <MeetingRoomRoundedIcon
                              sx={{
                                fontSize:
                                  17,

                                color:
                                  "text.secondary",
                              }}
                            />

                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              {
                                device.location
                              }
                            </Typography>
                          </Stack>
                        </Box>

                        <Stack
                          spacing={1}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {
                              device.displayType
                            }
                          </Typography>

                          {!device.available ? (
                            <Chip
                              label="Indisponible"
                              color="warning"
                              size="small"
                              variant="outlined"
                              sx={{
                                alignSelf:
                                  "flex-start",
                              }}
                            />
                          ) : (
                            <Chip
                              label={
                                commanding
                                  ? "Commande..."
                                  : device.isOn
                                  ? "Allumé"
                                  : "Éteint"
                              }
                              color={
                                device.isOn
                                  ? "success"
                                  : "default"
                              }
                              size="small"
                              variant={
                                device.isOn
                                  ? "filled"
                                  : "outlined"
                              }
                              sx={{
                                alignSelf:
                                  "flex-start",
                              }}
                            />
                          )}
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            }
          )}
        </Grid>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          DomoCenter synchronise automatiquement
          les états avec Home Assistant.
        </Typography>
      </Stack>
    </Box>
  );
}

export default LightingPage;

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import BatteryChargingFullRoundedIcon from "@mui/icons-material/BatteryChargingFullRounded";
import PowerOffRoundedIcon from "@mui/icons-material/PowerOffRounded";

import useHomeAssistant from "../hooks/useHomeAssistant";


function getCameraApplication(camera) {
  const model =
    camera?.model?.toLowerCase() ?? "";

  if (model.includes("anran")) {
    return {
      name: "ANRAN",
      shortcutUrl:
        "shortcuts://run-shortcut?name=ANRAN",
    };
  }

  if (model.includes("icam365")) {
    return {
      name: "iCam365",
      shortcutUrl:
        "shortcuts://run-shortcut?name=iCam365",
    };
  }

  if (model.includes("hi3516")) {
    return {
      name: "XMEye",
      shortcutUrl:
        "shortcuts://run-shortcut?name=XMEye",
    };
  }

  return {
    name: "Application",
    shortcutUrl: null,
  };
}


function isIOSDevice() {
  if (typeof navigator === "undefined") {
    return false;
  }

  return (
    /iPhone|iPad|iPod/i.test(
      navigator.userAgent
    ) ||
    (
      navigator.platform === "MacIntel" &&
      navigator.maxTouchPoints > 1
    )
  );
}


function CameraPage() {
  const {
    dashboard,
    loading,
    error,
  } = useHomeAssistant(10000);

  const camerasData =
    dashboard?.cameras ?? null;

  const cameras =
    camerasData?.cameras ?? [];

  const recharge =
    camerasData?.recharge ?? null;

  const available =
    camerasData?.available ?? 0;

  const unavailable =
    camerasData?.unavailable ?? 0;

  const total =
    camerasData?.totalConfigured ??
    cameras.length;

  const hasOfflineCamera =
    unavailable > 0;

  const iosDevice =
    isIOSDevice();


  return (
    <Box
      sx={{
        p: {
          xs: 2,
          md: 3,
        },
      }}
    >
      <Stack
        spacing={{
          xs: 1.5,
          md: 2,
        }}
      >
        {/* EN-TÊTE */}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          alignItems={{
            xs: "center",
            sm: "center",
          }}
          justifyContent="space-between"
          spacing={{
            xs: 1,
            sm: 2,
          }}
        >
          <Box
            sx={{
              textAlign: {
                xs: "center",
                sm: "left",
              },
            }}
          >
            <Typography
              variant="h4"
              fontWeight={800}
            >
              Caméras
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
            >
              Accès aux applications de surveillance
            </Typography>
          </Box>

          <Chip
            icon={
              <VideocamRoundedIcon />
            }
            label={
              loading
                ? `${total} caméra${
                    total > 1
                      ? "s"
                      : ""
                  }`
                : `${available} / ${total} en ligne`
            }
            color={
              hasOfflineCamera
                ? "error"
                : "success"
            }
            variant="outlined"
            sx={{
              minWidth: {
                xs: 150,
                sm: "auto",
              },
              fontWeight: 700,
            }}
          />
        </Stack>


        {error && (
          <Alert severity="error">
            Impossible de récupérer les données caméras : {error}
          </Alert>
        )}


        {hasOfflineCamera && !loading && (
          <Alert severity="error">
            {unavailable} caméra
            {unavailable > 1 ? "s" : ""}{" "}
            hors ligne.
          </Alert>
        )}


        {/* RECHARGE CAMÉRAS */}

        {recharge && (
          <Card>
            <CardContent
              sx={{
                px: {
                  xs: 1.5,
                  sm: 2,
                },
                py: {
                  xs: 1,
                  sm: 0.8,
                },
                "&:last-child": {
                  pb: {
                    xs: 1,
                    sm: 0.8,
                  },
                },
              }}
            >
              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                alignItems={{
                  xs: "stretch",
                  sm: "center",
                }}
                justifyContent="space-between"
                spacing={{
                  xs: 1,
                  sm: 2,
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                >
                  <Box
                    sx={{
                      width: {
                        xs: 42,
                        sm: 44,
                      },
                      height: {
                        xs: 42,
                        sm: 44,
                      },
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 3,
                      bgcolor:
                        recharge.available &&
                        recharge.active
                          ? "success.main"
                          : recharge.available
                          ? "action.hover"
                          : "warning.main",
                      color:
                        recharge.available &&
                        recharge.active
                          ? "white"
                          : "text.secondary",
                      flexShrink: 0,
                    }}
                  >
                    {recharge.active ? (
                      <BatteryChargingFullRoundedIcon />
                    ) : (
                      <PowerOffRoundedIcon />
                    )}
                  </Box>

                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight={800}
                    >
                      Recharge caméras
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Entrée + Allée
                    </Typography>
                  </Box>
                </Stack>

                <Chip
                  label={
                    !recharge.available
                      ? "Indisponible"
                      : recharge.active
                      ? "Alimentation active"
                      : "Alimentation arrêtée"
                  }
                  color={
                    !recharge.available
                      ? "warning"
                      : recharge.active
                      ? "success"
                      : "default"
                  }
                  variant={
                    recharge.active
                      ? "filled"
                      : "outlined"
                  }
                  sx={{
                    fontWeight: 700,
                  }}
                />
              </Stack>
            </CardContent>
          </Card>
        )}


        {loading && (
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Chargement des caméras…
          </Typography>
        )}


        {/* CARTES CAMÉRAS */}

        <Grid
          container
          spacing={{
            xs: 1,
            md: 1.5,
          }}
        >
          {cameras.map((camera) => {
            const application =
              getCameraApplication(
                camera
              );

            const cameraOffline =
              camera.available === false;

            return (
              <Grid
                key={camera.id}
                size={{
                  xs: 12,
                  md: 6,
                }}
              >
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    borderColor:
                      cameraOffline
                        ? "error.main"
                        : "divider",
                    borderWidth:
                      cameraOffline
                        ? 2
                        : 1,
                  }}
                >
                  <CardContent
                    sx={{
                      px: {
                        xs: 1.25,
                        sm: 1.5,
                      },
                      py: {
                        xs: 0.75,
                        sm: 0.9,
                      },
                      "&:last-child": {
                        pb: {
                          xs: 0.75,
                          sm: 0.9,
                        },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "grid",

                        gridTemplateColumns: {
                          xs: "auto minmax(0, 1fr) 105px",
                          sm: "auto minmax(0, 1fr) 90px 155px",
                        },

                        gridTemplateRows: {
                          xs: "auto auto",
                          sm: "auto",
                        },

                        gridTemplateAreas: {
                          xs: `
                            "icon name app"
                            "icon model action"
                          `,
                          sm: `
                            "icon camera app action"
                          `,
                        },

                        alignItems: "center",

                        columnGap: {
                          xs: 1,
                          sm: 1.25,
                        },

                        rowGap: {
                          xs: 0.15,
                          sm: 0,
                        },

                        minHeight: {
                          xs: 58,
                          sm: 56,
                        },
                      }}
                    >
                      {/* ICÔNE */}

                      <Box
                        gridArea="icon"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent:
                            "center",
                        }}
                      >
                        <VideocamRoundedIcon
                          sx={{
                            fontSize: {
                              xs: 27,
                              sm: 25,
                            },
                            color:
                              cameraOffline
                                ? "error.main"
                                : "text.secondary",
                          }}
                        />
                      </Box>


                      {/* NOM MOBILE */}

                      <Typography
                        gridArea="name"
                        variant="h6"
                        fontWeight={800}
                        noWrap
                        sx={{
                          display: {
                            xs: "block",
                            sm: "none",
                          },
                          lineHeight: 1.15,
                          color:
                            cameraOffline
                              ? "error.main"
                              : "text.primary",
                        }}
                      >
                        {camera.name}
                      </Typography>


                      {/* MODÈLE MOBILE */}

                      <Typography
                        gridArea="model"
                        variant="body2"
                        color="text.secondary"
                        noWrap
                        sx={{
                          display: {
                            xs: "block",
                            sm: "none",
                          },
                          lineHeight: 1.2,
                        }}
                      >
                        {camera.model}
                      </Typography>


                      {/* NOM + MODÈLE PC */}

                      <Box
                        gridArea="camera"
                        sx={{
                          display: {
                            xs: "none",
                            sm: "block",
                          },
                          minWidth: 0,
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight={800}
                          noWrap
                          sx={{
                            lineHeight: 1.15,
                            color:
                              cameraOffline
                                ? "error.main"
                                : "text.primary",
                          }}
                        >
                          {camera.name}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                          sx={{
                            lineHeight: 1.25,
                            mt: 0.25,
                          }}
                        >
                          {camera.model}
                        </Typography>
                      </Box>


                      {/* APPLICATION + ÉTAT */}

                      <Box
                        gridArea="app"
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Stack
                          spacing={0.4}
                          alignItems="center"
                        >
                          <Chip
                            label={
                              application.name
                            }
                            size="small"
                            sx={{
                              fontWeight: 700,
                              height: 26,
                            }}
                          />

                          {cameraOffline && (
                            <Chip
                              label="Hors ligne"
                              color="error"
                              size="small"
                              sx={{
                                fontWeight: 800,
                                height: 23,
                              }}
                            />
                          )}
                        </Stack>
                      </Box>


                      {/* ACTION */}

                      <Box
                        gridArea="action"
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "flex-start",
                          alignSelf: "start",
                          minWidth: 0,
                          transform: {
                            xs: "translateX(20px)",
                            sm: "none",
                          },
                        }}
                      >
                        {iosDevice &&
                        application.shortcutUrl ? (
                          <Button
                            component="a"
                            href={
                              application.shortcutUrl
                            }
                            variant="contained"
                            size="small"
                            endIcon={
                              <ChevronRightRoundedIcon />
                            }
                            sx={{
                              minWidth: 82,
                              height: 28,
                              px: 1,
                              py: 0,
                              borderRadius: 2,
                              textTransform: "none",
                              fontWeight: 700,
                              whiteSpace: "nowrap",
                              fontSize: "0.78rem",
                            }}
                          >
                            Ouvrir l'application
                          </Button>
                        ) : (
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="center"
                            spacing={0.5}
                            sx={{
                              color:
                                "text.secondary",
                            }}
                          >
                            <PhoneIphoneRoundedIcon
                              sx={{
                                fontSize: 17,
                              }}
                            />

                            <Typography
                              variant="caption"
                              fontWeight={600}
                              noWrap
                            >
                              Accès iPhone/iPad
                            </Typography>
                          </Stack>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>


        {!loading &&
          !error &&
          cameras.length === 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Aucune caméra configurée.
            </Typography>
          )}
      </Stack>
    </Box>
  );
}


export default CameraPage;

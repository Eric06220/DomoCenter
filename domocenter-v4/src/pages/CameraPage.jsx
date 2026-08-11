import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import WifiRoundedIcon from "@mui/icons-material/WifiRounded";
import WifiOffRoundedIcon from "@mui/icons-material/WifiOffRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import BatteryChargingFullRoundedIcon from "@mui/icons-material/BatteryChargingFullRounded";
import PowerOffRoundedIcon from "@mui/icons-material/PowerOffRounded";

import useHomeAssistant from "../hooks/useHomeAssistant";

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

  const integrated =
    camerasData?.integrated ?? 0;

  const available =
    camerasData?.available ?? 0;

  const unavailable =
    camerasData?.unavailable ?? 0;

  const notIntegrated =
    camerasData?.notIntegrated ?? 0;

  const recharge =
    camerasData?.recharge ?? null;

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
              Caméras
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
            >
              Surveillance des caméras extérieures et intérieures
            </Typography>
          </Box>

          <Chip
            icon={
              <CheckCircleRoundedIcon />
            }
            label={`${available} caméra${
              available > 1 ? "s" : ""
            } disponible${
              available > 1 ? "s" : ""
            } sur ${integrated}`}
            color={
              unavailable === 0
                ? "success"
                : "warning"
            }
            variant="outlined"
          />
        </Stack>

        {error && (
          <Alert severity="error">
            Impossible de récupérer les données caméras : {error}
          </Alert>
        )}

        {/* RECHARGE CAMÉRAS */}

        {recharge && (
          <Card>
            <CardContent sx={{ p: 2.5 }}>
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
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                >
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
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
                />
              </Stack>
            </CardContent>
          </Card>
        )}

        {!error && !loading && (
          <Alert severity="info">
            {notIntegrated > 0
              ? `${notIntegrated} caméra${
                  notIntegrated > 1 ? "s" : ""
                } ne ${
                  notIntegrated > 1
                    ? "sont"
                    : "est"
                } pas encore intégrée${
                  notIntegrated > 1
                    ? "s"
                    : ""
                } dans Home Assistant.`
              : "Toutes les caméras configurées sont intégrées dans Home Assistant."}
          </Alert>
        )}

        <Grid
          container
          spacing={2}
        >
          {cameras.map(
            (camera) => (
              <Grid
                key={camera.id}
                size={{
                  xs: 12,
                  sm: 6,
                  lg: 4,
                }}
              >
                <Card
                  sx={{
                    height: "100%",
                    overflow: "hidden",

                    borderColor:
                      camera.integrated &&
                      camera.available
                        ? "success.light"
                        : camera.integrated
                        ? "error.light"
                        : "divider",

                    opacity:
                      camera.integrated &&
                      camera.available === false
                        ? 0.7
                        : 1,
                  }}
                >
                  <Box
                    sx={{
                      position:
                        "relative",
                      minHeight: 190,
                      display: "grid",
                      placeItems:
                        "center",
                      bgcolor:
                        camera.integrated &&
                        camera.available
                          ? "#0f172a"
                          : "#374151",
                      color: "white",
                    }}
                  >
                    <Stack
                      alignItems="center"
                      spacing={1}
                    >
                      <VideocamRoundedIcon
                        sx={{
                          fontSize: 54,
                          opacity: 0.9,
                        }}
                      />

                      <Typography
                        variant="body2"
                        sx={{
                          opacity: 0.8,
                        }}
                      >
                        Aperçu vidéo indisponible
                      </Typography>
                    </Stack>

                    <Chip
                      icon={
                        camera.integrated &&
                        camera.available ? (
                          <WifiRoundedIcon />
                        ) : (
                          <WifiOffRoundedIcon />
                        )
                      }
                      label={
                        !camera.integrated
                          ? "Non intégrée"
                          : camera.available
                          ? "Disponible"
                          : "Indisponible"
                      }
                      color={
                        !camera.integrated
                          ? "default"
                          : camera.available
                          ? "success"
                          : "error"
                      }
                      size="small"
                      sx={{
                        position:
                          "absolute",
                        top: 12,
                        right: 12,
                      }}
                    />
                  </Box>

                  <CardContent
                    sx={{ p: 2.5 }}
                  >
                    <Stack spacing={1.75}>
                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight={800}
                        >
                          {camera.name}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {camera.model}
                        </Typography>
                      </Box>

                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.75}
                      >
                        <LocationOnRoundedIcon
                          sx={{
                            fontSize: 18,
                            color:
                              "text.secondary",
                          }}
                        />

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {camera.location}
                        </Typography>
                      </Stack>

                      <Chip
                        label={
                          !camera.integrated
                            ? "À intégrer"
                            : camera.available
                            ? "Connexion disponible"
                            : "Connexion à vérifier"
                        }
                        color={
                          !camera.integrated
                            ? "default"
                            : camera.available
                            ? "success"
                            : "error"
                        }
                        size="small"
                        variant="outlined"
                        sx={{
                          alignSelf:
                            "flex-start",
                        }}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            )
          )}
        </Grid>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Les états affichés proviennent directement de Home Assistant.
          Les enregistrements vidéo ne sont pas stockés dans DomoCenter.
        </Typography>
      </Stack>
    </Box>
  );
}

export default CameraPage;

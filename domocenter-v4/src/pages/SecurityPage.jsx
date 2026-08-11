import {
  useEffect,
  useState,
} from "react";

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

import DoorFrontRoundedIcon from "@mui/icons-material/DoorFrontRounded";
import SensorsRoundedIcon from "@mui/icons-material/SensorsRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import CottageRoundedIcon from "@mui/icons-material/CottageRounded";
import GarageRoundedIcon from "@mui/icons-material/GarageRounded";
import WarehouseRoundedIcon from "@mui/icons-material/WarehouseRounded";
import FenceRoundedIcon from "@mui/icons-material/FenceRounded";
import TouchAppRoundedIcon from "@mui/icons-material/TouchAppRounded";
import BlindsRoundedIcon from "@mui/icons-material/BlindsRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

import useHomeAssistant from "../hooks/useHomeAssistant";

import {
  getAccessData,
  triggerPortal,
  triggerShutter,
} from "../services/homeAssistantApi";

function getLocationIcon(location) {
  switch (location) {
    case "Maison":
      return <HomeRoundedIcon />;

    case "Studio":
      return <CottageRoundedIcon />;

    case "Atelier":
      return <WarehouseRoundedIcon />;

    case "Chalet":
      return <CottageRoundedIcon />;

    case "Extérieur":
      return <GarageRoundedIcon />;

    default:
      return <SensorsRoundedIcon />;
  }
}

function SecurityPage() {
  const {
    dashboard,
    loading,
    error,
  } = useHomeAssistant(10000);

  const [portal, setPortal] =
    useState(null);

  const [shutters, setShutters] =
    useState([]);

  const [accessLoading, setAccessLoading] =
    useState(true);

  const [
    portalCommanding,
    setPortalCommanding,
  ] = useState(false);

  const [
    shutterCommandingId,
    setShutterCommandingId,
  ] = useState(null);

  const [
    accessMessage,
    setAccessMessage,
  ] = useState("");

  const [
    accessError,
    setAccessError,
  ] = useState("");

  const openings =
    dashboard?.security?.openings ?? null;

  const openingSensors =
    openings?.sensors ?? [];

  const openSensors =
    openings?.open ?? 0;

  const unavailableOpenings =
    openings?.unavailable ?? 0;

  const waterLeaks =
    dashboard?.security?.waterLeaks ?? null;

  const waterLeakSensors =
    waterLeaks?.sensors ?? [];

  const waterLeakAlerts =
    waterLeaks?.alert ?? 0;

  const unavailableWaterLeaks =
    waterLeaks?.unavailable ?? 0;

  const smoke =
    dashboard?.security?.smoke ?? null;

  const smokeSensors =
    smoke?.detectors ?? [];

  const smokeAlerts =
    smoke?.smokeAlert ?? 0;

  const hasAlert =
    openSensors > 0 ||
    waterLeakAlerts > 0 ||
    smokeAlerts > 0;

  useEffect(() => {
    let cancelled = false;

    async function loadAccess() {
      try {
        setAccessLoading(true);
        setAccessError("");

        const accessData =
          await getAccessData();

        if (!cancelled) {
          setPortal(
            accessData?.portal ?? null
          );

          setShutters(
            accessData?.shutters ?? []
          );
        }
      } catch (caughtError) {
        if (!cancelled) {
          setAccessError(
            caughtError instanceof Error
              ? caughtError.message
              : "Impossible de récupérer les commandes d'accès."
          );
        }
      } finally {
        if (!cancelled) {
          setAccessLoading(false);
        }
      }
    }

    loadAccess();

    return () => {
      cancelled = true;
    };
  }, []);

  function showAccessMessage(message) {
    setAccessMessage(message);

    window.setTimeout(() => {
      setAccessMessage("");
    }, 2500);
  }

  async function handlePortalTrigger() {
    if (portalCommanding) {
      return;
    }

    try {
      setPortalCommanding(true);
      setAccessMessage("");
      setAccessError("");

      await triggerPortal();

      showAccessMessage(
        "Commande portail envoyée."
      );
    } catch (caughtError) {
      setAccessError(
        caughtError instanceof Error
          ? caughtError.message
          : "Impossible de commander le portail."
      );
    } finally {
      setPortalCommanding(false);
    }
  }

  async function handleShutterCommand(
    shutter,
    action
  ) {
    if (shutterCommandingId) {
      return;
    }

    try {
      setShutterCommandingId(
        shutter.id
      );

      setAccessMessage("");
      setAccessError("");

      await triggerShutter(
        shutter.id,
        action
      );

      showAccessMessage(
        `${shutter.name} : commande ${
          action === "open"
            ? "d'ouverture"
            : "de fermeture"
        } envoyée.`
      );
    } catch (caughtError) {
      setAccessError(
        caughtError instanceof Error
          ? caughtError.message
          : "Impossible de commander le volet."
      );
    } finally {
      setShutterCommandingId(
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
              Sécurité
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
            >
              Surveillance des ouvertures,
              volets, fuites d’eau et détecteurs
              de fumée
            </Typography>
          </Box>

          <Chip
            icon={
              hasAlert ? (
                <WarningAmberRoundedIcon />
              ) : (
                <CheckCircleRoundedIcon />
              )
            }
            label={
              hasAlert
                ? "État à vérifier"
                : "Maison sécurisée"
            }
            color={
              hasAlert
                ? "warning"
                : "success"
            }
            variant="outlined"
          />
        </Stack>

        {error && (
          <Alert severity="error">
            Impossible de récupérer les données
            de sécurité : {error}
          </Alert>
        )}

        {!error && !loading && (
          <Alert
            severity={
              waterLeakAlerts > 0 ||
              smokeAlerts > 0
                ? "error"
                : openSensors > 0
                ? "warning"
                : "success"
            }
          >
            {hasAlert
              ? `${openSensors} ouverture active, ${waterLeakAlerts} fuite d’eau et ${smokeAlerts} alerte fumée.`
              : "Toutes les ouvertures sont fermées, aucune fuite d’eau et aucune alerte fumée."}
          </Alert>
        )}

        {accessError && (
          <Alert
            severity="error"
            onClose={() =>
              setAccessError("")
            }
          >
            {accessError}
          </Alert>
        )}

        {accessMessage && (
          <Alert severity="success">
            {accessMessage}
          </Alert>
        )}

        {/* PORTAIL */}

        <Box>
          <Typography
            variant="h5"
            fontWeight={800}
            sx={{ mb: 0.5 }}
          >
            Portail
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Commande ouverture / fermeture
            du portail
          </Typography>

          <Card>
            <CardContent
              sx={{
                p: 2.5,
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
                      bgcolor: "primary.main",
                      color:
                        "primary.contrastText",
                    }}
                  >
                    <FenceRoundedIcon />
                  </Box>

                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight={800}
                    >
                      {portal?.name ??
                        "Portail"}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {portal?.location ??
                        "Entrée"}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Commande par impulsion —
                      aucun état ouvert / fermé
                    </Typography>
                  </Box>
                </Stack>

                <Button
                  variant="contained"
                  size="large"
                  startIcon={
                    <TouchAppRoundedIcon />
                  }
                  disabled={
                    accessLoading ||
                    portalCommanding ||
                    portal?.available === false
                  }
                  onClick={
                    handlePortalTrigger
                  }
                  sx={{
                    minWidth: {
                      xs: "100%",
                      sm: 210,
                    },
                    minHeight: 48,
                    fontWeight: 800,
                  }}
                >
                  {accessLoading
                    ? "Chargement..."
                    : portalCommanding
                    ? "Commande en cours..."
                    : "Commander le portail"}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* OUVERTURES */}

        <Box>
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
            spacing={1}
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight={800}
              >
                Détecteurs d’ouverture
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Portes et accès surveillés
              </Typography>
            </Box>

            <Stack
              direction="row"
              spacing={1}
            >
              <Chip
                label={`${openSensors} ouvert${
                  openSensors > 1
                    ? "s"
                    : ""
                } sur ${openingSensors.length}`}
                color={
                  openSensors > 0
                    ? "warning"
                    : "success"
                }
                size="small"
              />

              {unavailableOpenings > 0 && (
                <Chip
                  label={`${unavailableOpenings} indisponible${
                    unavailableOpenings > 1
                      ? "s"
                      : ""
                  }`}
                  color="warning"
                  size="small"
                  variant="outlined"
                />
              )}
            </Stack>
          </Stack>

          <Grid
            container
            spacing={2}
          >
            {openingSensors.map(
              (sensor) => (
                <Grid
                  key={sensor.id}
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
                        !sensor.available ||
                        sensor.isOpen
                          ? "warning.light"
                          : "divider",

                      bgcolor:
                        sensor.available &&
                        sensor.isOpen
                          ? "rgba(245, 158, 11, 0.05)"
                          : "background.paper",

                      opacity:
                        sensor.available
                          ? 1
                          : 0.65,
                    }}
                  >
                    <CardContent
                      sx={{ p: 2.5 }}
                    >
                      <Stack spacing={2.25}>
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
                                !sensor.available ||
                                sensor.isOpen
                                  ? "warning.main"
                                  : "success.main",

                              color:
                                "white",
                            }}
                          >
                            <DoorFrontRoundedIcon />
                          </Box>

                          <Chip
                            label={
                              !sensor.available
                                ? "Indisponible"
                                : sensor.isOpen
                                ? "Ouvert"
                                : "Fermé"
                            }
                            color={
                              !sensor.available ||
                              sensor.isOpen
                                ? "warning"
                                : "success"
                            }
                            size="small"
                          />
                        </Stack>

                        <Box>
                          <Typography
                            variant="h6"
                            fontWeight={800}
                          >
                            {sensor.name}
                          </Typography>

                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.75}
                            sx={{
                              mt: 0.5,
                            }}
                          >
                            <Box
                              sx={{
                                display:
                                  "grid",
                                placeItems:
                                  "center",
                                color:
                                  "text.secondary",

                                "& svg": {
                                  fontSize:
                                    18,
                                },
                              }}
                            >
                              {getLocationIcon(
                                sensor.location
                              )}
                            </Box>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              {
                                sensor.location
                              }
                            </Typography>
                          </Stack>
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {!sensor.available
                            ? "Le détecteur ne répond pas actuellement."
                            : sensor.isOpen
                            ? "Une ouverture est actuellement détectée."
                            : "Aucune ouverture détectée."}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              )
            )}
          </Grid>
        </Box>

        {/* VOLETS */}

        <Box>
          <Typography
            variant="h5"
            fontWeight={800}
            sx={{ mb: 0.5 }}
          >
            Volets
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Commandes impulsionnelles
            d’ouverture et de fermeture
          </Typography>

          {accessLoading ? (
            <Alert severity="info">
              Chargement des volets...
            </Alert>
          ) : shutters.length === 0 ? (
            <Alert severity="warning">
              Aucun volet configuré.
            </Alert>
          ) : (
            <Grid
              container
              spacing={2}
            >
              {shutters.map(
                (shutter) => {
                  const commanding =
                    shutterCommandingId ===
                    shutter.id;

                  return (
                    <Grid
                      key={shutter.id}
                      size={{
                        xs: 12,
                        md: 6,
                      }}
                    >
                      <Card>
                        <CardContent
                          sx={{
                            p: 2.5,
                          }}
                        >
                          <Stack
                            spacing={2.5}
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
                                  display:
                                    "grid",
                                  placeItems:
                                    "center",
                                  borderRadius:
                                    3,
                                  bgcolor:
                                    "primary.main",
                                  color:
                                    "primary.contrastText",
                                }}
                              >
                                <BlindsRoundedIcon />
                              </Box>

                              <Box>
                                <Typography
                                  variant="h6"
                                  fontWeight={
                                    800
                                  }
                                >
                                  {
                                    shutter.name
                                  }
                                </Typography>

                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {
                                    shutter.location
                                  }
                                </Typography>
                              </Box>
                            </Stack>

                            <Stack
                              direction={{
                                xs: "column",
                                sm: "row",
                              }}
                              spacing={1.5}
                            >
                              <Button
                                variant="contained"
                                fullWidth
                                startIcon={
                                  <KeyboardArrowUpRoundedIcon />
                                }
                                disabled={
                                  commanding
                                }
                                onClick={() =>
                                  handleShutterCommand(
                                    shutter,
                                    "open"
                                  )
                                }
                              >
                                {commanding
                                  ? "Commande..."
                                  : "Ouvrir"}
                              </Button>

                              <Button
                                variant="outlined"
                                fullWidth
                                startIcon={
                                  <KeyboardArrowDownRoundedIcon />
                                }
                                disabled={
                                  commanding
                                }
                                onClick={() =>
                                  handleShutterCommand(
                                    shutter,
                                    "close"
                                  )
                                }
                              >
                                {commanding
                                  ? "Commande..."
                                  : "Fermer"}
                              </Button>
                            </Stack>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Aucun état ouvert /
                              fermé n’est affiché :
                              DomoCenter ne dispose
                              pas de retour de
                              position du volet.
                            </Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                }
              )}
            </Grid>
          )}
        </Box>

        {/* FUITES D'EAU */}

        <Box>
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
            spacing={1}
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight={800}
              >
                Détecteurs d’inondation
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Surveillance des fuites d’eau
              </Typography>
            </Box>

            <Stack
              direction="row"
              spacing={1}
            >
              <Chip
                label={`${waterLeakAlerts} alerte${
                  waterLeakAlerts > 1
                    ? "s"
                    : ""
                } sur ${waterLeakSensors.length}`}
                color={
                  waterLeakAlerts > 0
                    ? "error"
                    : "success"
                }
                size="small"
              />

              {unavailableWaterLeaks > 0 && (
                <Chip
                  label={`${unavailableWaterLeaks} indisponible${
                    unavailableWaterLeaks > 1
                      ? "s"
                      : ""
                  }`}
                  color="warning"
                  size="small"
                  variant="outlined"
                />
              )}
            </Stack>
          </Stack>

          <Grid
            container
            spacing={2}
          >
            {waterLeakSensors.map(
              (sensor) => (
                <Grid
                  key={sensor.id}
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
                        sensor.leakDetected
                          ? "error.light"
                          : "divider",

                      bgcolor:
                        sensor.leakDetected
                          ? "rgba(220, 38, 38, 0.05)"
                          : "background.paper",

                      opacity:
                        sensor.available
                          ? 1
                          : 0.65,
                    }}
                  >
                    <CardContent
                      sx={{ p: 2.5 }}
                    >
                      <Stack spacing={2}>
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
                                !sensor.available
                                  ? "warning.main"
                                  : sensor.leakDetected
                                  ? "error.main"
                                  : "success.main",

                              color:
                                "white",
                            }}
                          >
                            <WaterDropRoundedIcon />
                          </Box>

                          <Chip
                            label={
                              !sensor.available
                                ? "Indisponible"
                                : sensor.leakDetected
                                ? "Fuite détectée"
                                : "Sec"
                            }
                            color={
                              !sensor.available
                                ? "warning"
                                : sensor.leakDetected
                                ? "error"
                                : "success"
                            }
                            size="small"
                          />
                        </Stack>

                        <Box>
                          <Typography
                            variant="h6"
                            fontWeight={800}
                          >
                            {sensor.name}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {
                              sensor.location
                            }
                          </Typography>
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {!sensor.available
                            ? "Le détecteur ne répond pas actuellement."
                            : sensor.leakDetected
                            ? "Une présence d’eau est actuellement détectée."
                            : "Aucune présence d’eau détectée."}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              )
            )}
          </Grid>
        </Box>

        {/* FUMÉE */}

        <Box>
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
            spacing={1}
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight={800}
              >
                Détecteurs de fumée
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Surveillance de la maison
                et du studio
              </Typography>
            </Box>

            <Chip
              label={`${smokeAlerts} alerte${
                smokeAlerts > 1
                  ? "s"
                  : ""
              } sur ${smokeSensors.length}`}
              color={
                smokeAlerts > 0
                  ? "error"
                  : "success"
              }
              size="small"
            />
          </Stack>

          <Grid
            container
            spacing={2}
          >
            {smokeSensors.map(
              (sensor) => (
                <Grid
                  key={sensor.id}
                  size={{
                    xs: 12,
                    md: 6,
                  }}
                >
                  <Card
                    sx={{
                      height: "100%",

                      borderColor:
                        sensor.smokeDetected
                          ? "error.light"
                          : "divider",

                      bgcolor:
                        sensor.smokeDetected
                          ? "rgba(220, 38, 38, 0.05)"
                          : "background.paper",
                    }}
                  >
                    <CardContent
                      sx={{ p: 2.5 }}
                    >
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
                              display:
                                "grid",
                              placeItems:
                                "center",
                              borderRadius:
                                3,

                              bgcolor:
                                sensor.smokeDetected
                                  ? "error.main"
                                  : "success.main",

                              color:
                                "white",
                            }}
                          >
                            <LocalFireDepartmentRoundedIcon />
                          </Box>

                          <Box>
                            <Typography
                              variant="h6"
                              fontWeight={800}
                            >
                              Détecteur{" "}
                              {sensor.name}
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              {
                                sensor.location
                              }
                            </Typography>
                          </Box>
                        </Stack>

                        <Chip
                          label={
                            sensor.smokeDetected
                              ? "Alerte fumée"
                              : "Normal"
                          }
                          color={
                            sensor.smokeDetected
                              ? "error"
                              : "success"
                          }
                        />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              )
            )}
          </Grid>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Les états affichés proviennent
          directement de Home Assistant.
        </Typography>
      </Stack>
    </Box>
  );
}

export default SecurityPage;

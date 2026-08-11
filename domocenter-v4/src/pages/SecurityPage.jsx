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

import useHomeAssistant from "../hooks/useHomeAssistant";

import {
  getAccessData,
  triggerPortal,
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

  const [portalLoading, setPortalLoading] =
    useState(true);

  const [portalCommanding, setPortalCommanding] =
    useState(false);

  const [portalMessage, setPortalMessage] =
    useState("");

  const [portalError, setPortalError] =
    useState("");

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

  const unavailableSmoke =
    smoke?.unavailable ?? 0;

  const hasAlert =
    openSensors > 0 ||
    waterLeakAlerts > 0 ||
    smokeAlerts > 0;

  useEffect(() => {
    let cancelled = false;

    async function loadPortal() {
      try {
        setPortalLoading(true);
        setPortalError("");

        const accessData =
          await getAccessData();

        if (!cancelled) {
          setPortal(
            accessData?.portal ?? null
          );
        }
      } catch (caughtError) {
        if (!cancelled) {
          setPortalError(
            caughtError instanceof Error
              ? caughtError.message
              : "Impossible de récupérer le portail."
          );
        }
      } finally {
        if (!cancelled) {
          setPortalLoading(false);
        }
      }
    }

    loadPortal();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handlePortalTrigger() {
    if (portalCommanding) {
      return;
    }

    try {
      setPortalCommanding(true);
      setPortalMessage("");
      setPortalError("");

      await triggerPortal();

      setPortalMessage(
        "Commande portail envoyée."
      );

      window.setTimeout(() => {
        setPortalMessage("");
      }, 2500);
    } catch (caughtError) {
      setPortalError(
        caughtError instanceof Error
          ? caughtError.message
          : "Impossible de commander le portail."
      );
    } finally {
      setPortalCommanding(false);
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
              fuites d’eau et détecteurs de fumée
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
            Commande ouverture / fermeture du portail
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
                      color: "primary.contrastText",
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
                    portalLoading ||
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
                  {portalLoading
                    ? "Chargement..."
                    : portalCommanding
                    ? "Commande en cours..."
                    : "Commander le portail"}
                </Button>
              </Stack>

              {portalMessage && (
                <Alert
                  severity="success"
                  sx={{ mt: 2 }}
                >
                  {portalMessage}
                </Alert>
              )}

              {portalError && (
                <Alert
                  severity="error"
                  sx={{ mt: 2 }}
                  onClose={() =>
                    setPortalError("")
                  }
                >
                  {portalError}
                </Alert>
              )}
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

import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
import PoolRoundedIcon from "@mui/icons-material/PoolRounded";
import PowerRoundedIcon from "@mui/icons-material/PowerRounded";
import ElectricMeterRoundedIcon from "@mui/icons-material/ElectricMeterRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import useHomeAssistant from "../hooks/useHomeAssistant";

function formatPower(watts) {
  if (!Number.isFinite(watts)) {
    return "--";
  }

  if (watts >= 1000) {
    return `${(watts / 1000).toFixed(2)} kW`;
  }

  return `${watts.toFixed(1)} W`;
}

function formatValue(metric, decimals = 1) {
  if (!metric?.available || !Number.isFinite(metric.value)) {
    return "--";
  }

  return `${metric.value.toFixed(decimals)} ${metric.unit ?? ""}`.trim();
}

function getDeviceIcon(device) {
  if (device.id?.includes("ecs")) {
    return <WaterDropRoundedIcon />;
  }

  if (device.id === "pompe-piscine") {
    return <PoolRoundedIcon />;
  }

  return <PowerRoundedIcon />;
}

function EnergyPage() {
  const {
    dashboard,
    loading,
    error,
  } = useHomeAssistant(10000);

  const energy =
    dashboard?.energy ?? null;

  const devices =
    energy?.devices ?? [];

  const totalDevices =
    energy?.totalDevices ?? 0;

  const activeDevices =
    energy?.activeDevices ?? 0;

  const unavailableDevices =
    energy?.unavailableDevices ?? 0;

  const totalPower =
    energy?.totalPowerWatts ?? 0;

  const totalEnergy =
    energy?.totalEnergyKwh ?? 0;

  const powerLimit = 6000;

  const powerPercentage =
    Math.min(
      (totalPower / powerLimit) * 100,
      100
    );

  const highConsumption =
    totalPower > 4500;

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
              Énergie
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
            >
              Suivi réel de la consommation électrique
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
                highConsumption ? (
                  <WarningAmberRoundedIcon />
                ) : (
                  <CheckCircleRoundedIcon />
                )
              }
              label={
                highConsumption
                  ? "Consommation élevée"
                  : "Consommation normale"
              }
              color={
                highConsumption
                  ? "warning"
                  : "success"
              }
              variant="outlined"
            />

            {unavailableDevices > 0 && (
              <Chip
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
            Impossible de récupérer les données énergie : {error}
          </Alert>
        )}

        {!error && !loading && (
          <Alert
            severity={
              highConsumption
                ? "warning"
                : "success"
            }
          >
            La consommation instantanée réelle est de{" "}
            <strong>
              {formatPower(totalPower)}
            </strong>.
          </Alert>
        )}

        <Grid
          container
          spacing={2}
        >
          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack spacing={2}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 3,
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                    }}
                  >
                    <BoltRoundedIcon />
                  </Box>

                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={700}
                    >
                      Consommation actuelle
                    </Typography>

                    <Typography
                      variant="h4"
                      fontWeight={800}
                    >
                      {formatPower(totalPower)}
                    </Typography>
                  </Box>

                  <Stack spacing={0.75}>
                    <LinearProgress
                      variant="determinate"
                      value={powerPercentage}
                      color={
                        highConsumption
                          ? "warning"
                          : "primary"
                      }
                      sx={{
                        height: 8,
                        borderRadius: 999,
                      }}
                    />

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {formatPower(totalPower)} sur une référence de 6 kW
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 4,
            }}
          >
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack spacing={2}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 3,
                      bgcolor: "secondary.main",
                      color: "white",
                    }}
                  >
                    <ElectricMeterRoundedIcon />
                  </Box>

                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={700}
                    >
                      Énergie totale
                    </Typography>

                    <Typography
                      variant="h4"
                      fontWeight={800}
                    >
                      {Number.isFinite(totalEnergy)
                        ? `${totalEnergy.toFixed(3)} kWh`
                        : "--"}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Somme des compteurs disponibles
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 4,
            }}
          >
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack spacing={2}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 3,
                      bgcolor: "success.main",
                      color: "white",
                    }}
                  >
                    <PowerRoundedIcon />
                  </Box>

                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={700}
                    >
                      Équipements actifs
                    </Typography>

                    <Typography
                      variant="h4"
                      fontWeight={800}
                    >
                      {activeDevices} / {totalDevices}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Disjoncteurs actuellement activés
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box>
          <Typography
            variant="h5"
            fontWeight={800}
            sx={{ mb: 0.5 }}
          >
            Détail des équipements
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Puissance, tension, intensité et énergie totale
          </Typography>

          <Grid
            container
            spacing={2}
          >
            {devices.map(
              (device) => {
                const active =
                  device.switch?.available &&
                  device.switch?.isOn === true;

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
                          active
                            ? "primary.light"
                            : "divider",

                        bgcolor:
                          active
                            ? "rgba(37, 99, 235, 0.035)"
                            : "background.paper",

                        opacity:
                          device.available
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
                                display: "grid",
                                placeItems: "center",
                                borderRadius: 3,

                                bgcolor:
                                  active
                                    ? "primary.main"
                                    : "action.hover",

                                color:
                                  active
                                    ? "primary.contrastText"
                                    : "text.secondary",
                              }}
                            >
                              {getDeviceIcon(
                                device
                              )}
                            </Box>

                            <Chip
                              label={
                                !device.available
                                  ? "Indisponible"
                                  : active
                                  ? "Actif"
                                  : "Inactif"
                              }
                              color={
                                !device.available
                                  ? "warning"
                                  : active
                                  ? "success"
                                  : "default"
                              }
                              size="small"
                              variant={
                                active
                                  ? "filled"
                                  : "outlined"
                              }
                            />
                          </Stack>

                          <Box>
                            <Typography
                              variant="h6"
                              fontWeight={800}
                            >
                              {device.name}
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              {device.location}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography
                              variant="h5"
                              fontWeight={800}
                            >
                              {formatValue(
                                device.power,
                                1
                              )}
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              {formatValue(
                                device.voltage,
                                1
                              )}{" "}
                              ·{" "}
                              {formatValue(
                                device.current,
                                2
                              )}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              p: 1.5,
                              borderRadius: 2.5,
                              bgcolor: "action.hover",
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Énergie totale
                            </Typography>

                            <Typography
                              variant="body1"
                              fontWeight={800}
                            >
                              {formatValue(
                                device.totalEnergy,
                                3
                              )}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              }
            )}
          </Grid>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Les mesures affichées proviennent directement de Home Assistant.
        </Typography>
      </Stack>
    </Box>
  );
}

export default EnergyPage;

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

const energyDevices = [
  {
    id: "ecs-maison",
    name: "ECS Maison",
    type: "Disjoncteur intelligent Tuya",
    category: "ECS",
    power: 1850,
    voltage: 231,
    current: 8,
    energyToday: 4.6,
    active: true,
  },
  {
    id: "ecs-studio",
    name: "ECS Studio",
    type: "Disjoncteur intelligent Tuya",
    category: "ECS",
    power: 0,
    voltage: 230,
    current: 0,
    energyToday: 2.1,
    active: false,
  },
  {
    id: "pompe-piscine",
    name: "Pompe piscine",
    type: "Disjoncteur intelligent Tuya",
    category: "Piscine",
    power: 920,
    voltage: 232,
    current: 4,
    energyToday: 5.8,
    active: true,
  },
  {
    id: "hp-piscine",
    name: "HP Piscine",
    type: "Prise Tuya avec mesure",
    category: "Prise",
    power: 640,
    voltage: 231,
    current: 2.8,
    energyToday: 3.4,
    active: true,
  },
  {
    id: "lampe-piscine",
    name: "Lampe piscine",
    type: "Prise Tuya avec mesure",
    category: "Prise",
    power: 0,
    voltage: 230,
    current: 0,
    energyToday: 0.7,
    active: false,
  },
];

function formatPower(watts) {
  if (watts >= 1000) {
    return `${(watts / 1000).toFixed(2)} kW`;
  }

  return `${watts} W`;
}

function getDeviceIcon(category) {
  switch (category) {
    case "ECS":
      return <WaterDropRoundedIcon />;

    case "Piscine":
      return <PoolRoundedIcon />;

    case "Prise":
      return <PowerRoundedIcon />;

    default:
      return <BoltRoundedIcon />;
  }
}

function EnergyPage() {
  const totalPower = energyDevices.reduce(
    (total, device) => total + device.power,
    0
  );

  const totalEnergyToday = energyDevices.reduce(
    (total, device) => total + device.energyToday,
    0
  );

  const activeDevices = energyDevices.filter(
    (device) => device.active
  ).length;

  const powerLimit = 6000;

  const powerPercentage = Math.min(
    (totalPower / powerLimit) * 100,
    100
  );

  const highConsumption = totalPower > 4500;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Typography variant="h4" fontWeight={800}>
              Énergie
            </Typography>

            <Typography variant="body1" color="text.secondary">
              Suivi de la consommation électrique des équipements Tuya
            </Typography>
          </Box>

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
            color={highConsumption ? "warning" : "success"}
            variant="outlined"
          />
        </Stack>

        <Alert severity={highConsumption ? "warning" : "success"}>
          La consommation instantanée simulée est de{" "}
          <strong>{formatPower(totalPower)}</strong>.
        </Alert>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
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

                    <Typography variant="h4" fontWeight={800}>
                      {formatPower(totalPower)}
                    </Typography>
                  </Box>

                  <Stack spacing={0.75}>
                    <LinearProgress
                      variant="determinate"
                      value={powerPercentage}
                      color={highConsumption ? "warning" : "primary"}
                      sx={{
                        height: 8,
                        borderRadius: 999,
                      }}
                    />

                    <Typography variant="caption" color="text.secondary">
                      {totalPower} W sur une limite simulée de {powerLimit} W
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
                      Énergie aujourd’hui
                    </Typography>

                    <Typography variant="h4" fontWeight={800}>
                      {totalEnergyToday.toFixed(1)} kWh
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Total simulé des cinq équipements
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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

                    <Typography variant="h4" fontWeight={800}>
                      {activeDevices} / {energyDevices.length}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Disjoncteurs et prises en fonctionnement
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box>
          <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>
            Détail des équipements
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Puissance, tension, intensité et consommation du jour
          </Typography>

          <Grid container spacing={2}>
            {energyDevices.map((device) => (
              <Grid key={device.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <Card
                  sx={{
                    height: "100%",
                    borderColor: device.active
                      ? "primary.light"
                      : "divider",
                    bgcolor: device.active
                      ? "rgba(37, 99, 235, 0.035)"
                      : "background.paper",
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
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
                            bgcolor: device.active
                              ? "primary.main"
                              : "action.hover",
                            color: device.active
                              ? "primary.contrastText"
                              : "text.secondary",
                          }}
                        >
                          {getDeviceIcon(device.category)}
                        </Box>

                        <Chip
                          label={device.active ? "Actif" : "Inactif"}
                          color={device.active ? "success" : "default"}
                          size="small"
                          variant={device.active ? "filled" : "outlined"}
                        />
                      </Stack>

                      <Box>
                        <Typography variant="h6" fontWeight={800}>
                          {device.name}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          {device.type}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="h5" fontWeight={800}>
                          {formatPower(device.power)}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          {device.voltage} V · {device.current} A
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2.5,
                          bgcolor: "action.hover",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Consommation aujourd’hui
                        </Typography>

                        <Typography variant="body1" fontWeight={800}>
                          {device.energyToday.toFixed(1)} kWh
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Typography variant="body2" color="text.secondary">
          Les mesures sont encore simulées. Elles seront remplacées par les
          vraies données de consommation provenant de Home Assistant.
        </Typography>
      </Stack>
    </Box>
  );
}

export default EnergyPage;
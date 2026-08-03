import { useState } from "react";
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
import FenceRoundedIcon from "@mui/icons-material/FenceRounded";
import PowerRoundedIcon from "@mui/icons-material/PowerRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

const initialDevices = [
  {
    id: "spot-piscine",
    name: "Spot piscine",
    location: "Piscine",
    type: "SONOFF 4CH · Canal 1",
    category: "Piscine",
    enabled: true,
  },
  {
    id: "eclairage-piscine",
    name: "Éclairage piscine",
    location: "Piscine",
    type: "SONOFF 4CH · Canal 2",
    category: "Piscine",
    enabled: false,
  },
  {
    id: "palmiers",
    name: "Éclairage palmiers",
    location: "Jardin",
    type: "SONOFF 4CH · Canal 3",
    category: "Jardin",
    enabled: true,
  },
  {
    id: "olivier-allee",
    name: "Éclairage olivier allée",
    location: "Allée",
    type: "SONOFF 4CH · Canal 4",
    category: "Jardin",
    enabled: false,
  },
  {
    id: "hp-piscine",
    name: "HP Piscine",
    location: "Piscine",
    type: "Prise Tuya",
    category: "Prise",
    enabled: false,
  },
  {
    id: "lampe-piscine",
    name: "Lampe piscine",
    location: "Piscine",
    type: "Prise Tuya",
    category: "Piscine",
    enabled: true,
  },
  {
    id: "salon",
    name: "Lumière salon",
    location: "Maison",
    type: "Mini interrupteur Wi-Fi",
    category: "Maison",
    enabled: true,
  },
  {
    id: "couloir",
    name: "Lumière couloir",
    location: "Maison",
    type: "Mini interrupteur Wi-Fi",
    category: "Maison",
    enabled: false,
  },
  {
    id: "pergola",
    name: "Lumière pergola",
    location: "Extérieur",
    type: "Mini interrupteur Wi-Fi",
    category: "Extérieur",
    enabled: false,
  },
  {
    id: "portail",
    name: "Portail",
    location: "Entrée",
    type: "Mini interrupteur Wi-Fi",
    category: "Portail",
    enabled: false,
  },
];

function getDeviceIcon(category) {
  switch (category) {
    case "Piscine":
      return <PoolRoundedIcon />;

    case "Jardin":
      return <ForestRoundedIcon />;

    case "Extérieur":
      return <DeckRoundedIcon />;

    case "Maison":
      return <ChairRoundedIcon />;

    case "Portail":
      return <FenceRoundedIcon />;

    case "Prise":
      return <PowerRoundedIcon />;

    default:
      return <LightbulbRoundedIcon />;
  }
}

function LightingPage() {
  const [devices, setDevices] = useState(initialDevices);

  const activeDevices = devices.filter((device) => device.enabled).length;

  const toggleDevice = (deviceId) => {
    setDevices((currentDevices) =>
      currentDevices.map((device) =>
        device.id === deviceId
          ? {
              ...device,
              enabled: !device.enabled,
            }
          : device
      )
    );
  };

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
              Éclairage
            </Typography>

            <Typography variant="body1" color="text.secondary">
              Commande des éclairages, prises et interrupteurs connectés
            </Typography>
          </Box>

          <Chip
            icon={<CheckCircleRoundedIcon />}
            label={`${activeDevices} équipement${
              activeDevices > 1 ? "s" : ""
            } actif${activeDevices > 1 ? "s" : ""}`}
            color={activeDevices > 0 ? "primary" : "default"}
            variant={activeDevices > 0 ? "filled" : "outlined"}
          />
        </Stack>

        <Alert severity="info">
          Les commandes sont actuellement simulées dans DomoCenter. Elles ne
          pilotent pas encore les vrais équipements.
        </Alert>

        <Grid container spacing={2}>
          {devices.map((device) => (
            <Grid key={device.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  borderColor: device.enabled
                    ? "primary.light"
                    : "divider",
                  bgcolor: device.enabled
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
                          bgcolor: device.enabled
                            ? "primary.main"
                            : "action.hover",
                          color: device.enabled
                            ? "primary.contrastText"
                            : "text.secondary",
                        }}
                      >
                        {getDeviceIcon(device.category)}
                      </Box>

                      <Switch
                        checked={device.enabled}
                        onChange={() => toggleDevice(device.id)}
                        inputProps={{
                          "aria-label": `Activer ou désactiver ${device.name}`,
                        }}
                      />
                    </Stack>

                    <Box>
                      <Typography variant="h6" fontWeight={800}>
                        {device.name}
                      </Typography>

                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.75}
                        sx={{ mt: 0.5 }}
                      >
                        <MeetingRoomRoundedIcon
                          sx={{
                            fontSize: 17,
                            color: "text.secondary",
                          }}
                        />

                        <Typography variant="body2" color="text.secondary">
                          {device.location}
                        </Typography>
                      </Stack>
                    </Box>

                    <Stack spacing={1}>
                      <Typography variant="body2" color="text.secondary">
                        {device.type}
                      </Typography>

                      <Chip
                        label={device.enabled ? "Allumé" : "Éteint"}
                        color={device.enabled ? "success" : "default"}
                        size="small"
                        variant={device.enabled ? "filled" : "outlined"}
                        sx={{
                          alignSelf: "flex-start",
                        }}
                      />
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography variant="body2" color="text.secondary">
          Les interrupteurs modifient uniquement l’état affiché dans cette page.
          La connexion réelle sera ajoutée après l’installation de Home
          Assistant.
        </Typography>
      </Stack>
    </Box>
  );
}

export default LightingPage;
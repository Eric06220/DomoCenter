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

import DoorFrontRoundedIcon from "@mui/icons-material/DoorFrontRounded";
import SensorsRoundedIcon from "@mui/icons-material/SensorsRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import CottageRoundedIcon from "@mui/icons-material/CottageRounded";
import GarageRoundedIcon from "@mui/icons-material/GarageRounded";
import WarehouseRoundedIcon from "@mui/icons-material/WarehouseRounded";

const openingSensors = [
  {
    id: "entree",
    name: "Entrée",
    location: "Maison",
    open: false,
  },
  {
    id: "salon",
    name: "Salon",
    location: "Maison",
    open: true,
  },
  {
    id: "appentis",
    name: "Appentis",
    location: "Extérieur",
    open: false,
  },
  {
    id: "studio",
    name: "Studio",
    location: "Studio",
    open: false,
  },
  {
    id: "atelier",
    name: "Atelier",
    location: "Atelier",
    open: false,
  },
  {
    id: "chalet",
    name: "Chalet",
    location: "Chalet",
    open: false,
  },
];

const smokeSensors = [
  {
    id: "fumee-maison",
    name: "Maison",
    location: "Maison principale",
    alert: false,
  },
  {
    id: "fumee-studio",
    name: "Studio",
    location: "Studio",
    alert: false,
  },
];

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
  const openSensors = openingSensors.filter((sensor) => sensor.open).length;

  const smokeAlerts = smokeSensors.filter((sensor) => sensor.alert).length;

  const hasAlert = openSensors > 0 || smokeAlerts > 0;

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
              Sécurité
            </Typography>

            <Typography variant="body1" color="text.secondary">
              Surveillance des ouvertures et des détecteurs de fumée
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
            label={hasAlert ? "État à vérifier" : "Maison sécurisée"}
            color={hasAlert ? "warning" : "success"}
            variant="outlined"
          />
        </Stack>

        <Alert severity={hasAlert ? "warning" : "success"}>
          {hasAlert
            ? `${openSensors} ouverture détectée et ${smokeAlerts} alerte fumée.`
            : "Toutes les ouvertures sont fermées et aucun détecteur de fumée n’est en alerte."}
        </Alert>

        <Box>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            spacing={1}
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography variant="h5" fontWeight={800}>
                Détecteurs d’ouverture
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Portes et accès surveillés
              </Typography>
            </Box>

            <Chip
              label={`${openSensors} ouvert${openSensors > 1 ? "s" : ""} sur ${
                openingSensors.length
              }`}
              color={openSensors > 0 ? "warning" : "success"}
              size="small"
            />
          </Stack>

          <Grid container spacing={2}>
            {openingSensors.map((sensor) => (
              <Grid key={sensor.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <Card
                  sx={{
                    height: "100%",
                    borderColor: sensor.open ? "warning.light" : "divider",
                    bgcolor: sensor.open
                      ? "rgba(245, 158, 11, 0.05)"
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
                            bgcolor: sensor.open
                              ? "warning.main"
                              : "success.main",
                            color: "white",
                          }}
                        >
                          <DoorFrontRoundedIcon />
                        </Box>

                        <Chip
                          label={sensor.open ? "Ouvert" : "Fermé"}
                          color={sensor.open ? "warning" : "success"}
                          size="small"
                        />
                      </Stack>

                      <Box>
                        <Typography variant="h6" fontWeight={800}>
                          {sensor.name}
                        </Typography>

                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.75}
                          sx={{ mt: 0.5 }}
                        >
                          <Box
                            sx={{
                              display: "grid",
                              placeItems: "center",
                              color: "text.secondary",
                              "& svg": {
                                fontSize: 18,
                              },
                            }}
                          >
                            {getLocationIcon(sensor.location)}
                          </Box>

                          <Typography variant="body2" color="text.secondary">
                            {sensor.location}
                          </Typography>
                        </Stack>
                      </Box>

                      <Typography variant="body2" color="text.secondary">
                        {sensor.open
                          ? "Une ouverture est actuellement détectée."
                          : "Aucune ouverture détectée."}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            spacing={1}
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography variant="h5" fontWeight={800}>
                Détecteurs de fumée
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Surveillance de la maison et du studio
              </Typography>
            </Box>

            <Chip
              label={`${smokeAlerts} alerte${
                smokeAlerts > 1 ? "s" : ""
              } sur ${smokeSensors.length}`}
              color={smokeAlerts > 0 ? "error" : "success"}
              size="small"
            />
          </Stack>

          <Grid container spacing={2}>
            {smokeSensors.map((sensor) => (
              <Grid key={sensor.id} size={{ xs: 12, md: 6 }}>
                <Card
                  sx={{
                    height: "100%",
                    borderColor: sensor.alert ? "error.light" : "divider",
                    bgcolor: sensor.alert
                      ? "rgba(220, 38, 38, 0.05)"
                      : "background.paper",
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      justifyContent="space-between"
                      spacing={2}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Box
                          sx={{
                            width: 52,
                            height: 52,
                            display: "grid",
                            placeItems: "center",
                            borderRadius: 3,
                            bgcolor: sensor.alert
                              ? "error.main"
                              : "success.main",
                            color: "white",
                          }}
                        >
                          <LocalFireDepartmentRoundedIcon />
                        </Box>

                        <Box>
                          <Typography variant="h6" fontWeight={800}>
                            Détecteur {sensor.name}
                          </Typography>

                          <Typography variant="body2" color="text.secondary">
                            {sensor.location}
                          </Typography>
                        </Box>
                      </Stack>

                      <Chip
                        label={sensor.alert ? "Alerte fumée" : "Normal"}
                        color={sensor.alert ? "error" : "success"}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Typography variant="body2" color="text.secondary">
          Les états sont encore simulés. Ils seront remplacés par les données
          réelles de Home Assistant.
        </Typography>
      </Stack>
    </Box>
  );
}

export default SecurityPage;
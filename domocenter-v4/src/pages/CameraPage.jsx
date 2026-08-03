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
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

const cameras = [
  {
    id: "portail",
    name: "Portail",
    model: "ANRAN P3 Max",
    location: "Portail",
    online: true,
  },
  {
    id: "entree",
    name: "Entrée",
    model: "ANRAN S02",
    location: "Entrée",
    online: true,
  },
  {
    id: "allee",
    name: "Allée",
    model: "ANRAN S02",
    location: "Allée",
    online: true,
  },
  {
    id: "studio",
    name: "Studio",
    model: "ANRAN S02",
    location: "Studio",
    online: true,
  },
  {
    id: "chalet",
    name: "Chalet",
    model: "ANRAN P3 Max",
    location: "Chalet",
    online: true,
  },
  {
    id: "atelier",
    name: "Atelier",
    model: "HI3516",
    location: "Atelier",
    online: false,
  },
  {
    id: "sam",
    name: "Salle à manger",
    model: "iCam365",
    location: "Maison",
    online: true,
  },
];

function CameraPage() {
  const onlineCameras = cameras.filter((camera) => camera.online).length;

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
              Caméras
            </Typography>

            <Typography variant="body1" color="text.secondary">
              Surveillance des caméras extérieures et intérieures
            </Typography>
          </Box>

          <Chip
            icon={<CheckCircleRoundedIcon />}
            label={`${onlineCameras} caméra${
              onlineCameras > 1 ? "s" : ""
            } en ligne sur ${cameras.length}`}
            color={
              onlineCameras === cameras.length ? "success" : "warning"
            }
            variant="outlined"
          />
        </Stack>

        <Alert severity="info">
          Les aperçus vidéo sont encore simulés. Les vrais flux seront ajoutés
          après la connexion à Home Assistant.
        </Alert>

        <Grid container spacing={2}>
          {cameras.map((camera) => (
            <Grid key={camera.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  overflow: "hidden",
                  borderColor: camera.online
                    ? "success.light"
                    : "error.light",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    minHeight: 190,
                    display: "grid",
                    placeItems: "center",
                    bgcolor: camera.online ? "#0f172a" : "#374151",
                    color: "white",
                  }}
                >
                  <Stack alignItems="center" spacing={1}>
                    <VideocamRoundedIcon sx={{ fontSize: 54, opacity: 0.9 }} />

                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Aperçu vidéo indisponible
                    </Typography>
                  </Stack>

                  <Chip
                    icon={
                      camera.online ? (
                        <WifiRoundedIcon />
                      ) : (
                        <WifiOffRoundedIcon />
                      )
                    }
                    label={camera.online ? "En ligne" : "Hors ligne"}
                    color={camera.online ? "success" : "error"}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                    }}
                  />

                  {camera.online && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 12,
                        right: 12,
                        width: 38,
                        height: 38,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: "50%",
                        bgcolor: "rgba(255, 255, 255, 0.16)",
                        backdropFilter: "blur(6px)",
                      }}
                    >
                      <PlayCircleRoundedIcon />
                    </Box>
                  )}
                </Box>

                <CardContent sx={{ p: 2.5 }}>
                  <Stack spacing={1.75}>
                    <Box>
                      <Typography variant="h6" fontWeight={800}>
                        {camera.name}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {camera.model}
                      </Typography>
                    </Box>

                    <Stack direction="row" alignItems="center" spacing={0.75}>
                      <LocationOnRoundedIcon
                        sx={{
                          fontSize: 18,
                          color: "text.secondary",
                        }}
                      />

                      <Typography variant="body2" color="text.secondary">
                        {camera.location}
                      </Typography>
                    </Stack>

                    <Chip
                      label={
                        camera.online
                          ? "Connexion disponible"
                          : "Connexion à vérifier"
                      }
                      color={camera.online ? "success" : "error"}
                      size="small"
                      variant="outlined"
                      sx={{ alignSelf: "flex-start" }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography variant="body2" color="text.secondary">
          Pour éviter de surcharger le Raspberry Pi, les enregistrements vidéo
          ne seront pas stockés directement dans DomoCenter.
        </Typography>
      </Stack>
    </Box>
  );
}

export default CameraPage;
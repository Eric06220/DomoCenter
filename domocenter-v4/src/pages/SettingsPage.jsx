import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import HubRoundedIcon from "@mui/icons-material/HubRounded";
import WifiRoundedIcon from "@mui/icons-material/WifiRounded";
import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import RouterRoundedIcon from "@mui/icons-material/RouterRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";

const initialSettings = {
  homeAssistantUrl: "http://homeassistant.local:8123",
  accessToken: "",
  connectionMode: "local",
  darkMode: false,
  notifications: true,
  securityAlerts: true,
  energyAlerts: true,
  cameraAlerts: false,
  language: "fr",
  refreshInterval: 10,
};

function SettingsPage() {
  const [settings, setSettings] = useState(initialSettings);
  const [saved, setSaved] = useState(false);

  const handleChange = (field) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;

    setSettings((currentSettings) => ({
      ...currentSettings,
      [field]: value,
    }));

    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
  };

  const handleReset = () => {
    setSettings(initialSettings);
    setSaved(false);
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
              Paramètres
            </Typography>

            <Typography variant="body1" color="text.secondary">
              Configuration de DomoCenter et de la future connexion à Home
              Assistant
            </Typography>
          </Box>

          <Chip
            icon={<SettingsRoundedIcon />}
            label="Configuration locale"
            color="primary"
            variant="outlined"
          />
        </Stack>

        {saved && (
          <Alert
            severity="success"
            icon={<CheckCircleRoundedIcon />}
            onClose={() => setSaved(false)}
          >
            Les paramètres ont été enregistrés dans l’interface.
          </Alert>
        )}

        <Alert severity="info" icon={<InfoRoundedIcon />}>
          Home Assistant n’est pas encore connecté. Ces réglages préparent la
          communication entre le mini-PC, Home Assistant et DomoCenter.
        </Alert>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box
                      sx={{
                        width: 46,
                        height: 46,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: 3,
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                      }}
                    >
                      <HubRoundedIcon />
                    </Box>

                    <Box>
                      <Typography variant="h6" fontWeight={800}>
                        Home Assistant
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Paramètres de connexion à votre serveur domotique
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider />

                  <TextField
                    fullWidth
                    label="Adresse de Home Assistant"
                    value={settings.homeAssistantUrl}
                    onChange={handleChange("homeAssistantUrl")}
                    placeholder="http://homeassistant.local:8123"
                    helperText="Adresse locale utilisée pour la communication avec Home Assistant."
                  />

                  <TextField
                    fullWidth
                    label="Jeton d’accès longue durée"
                    type="password"
                    value={settings.accessToken}
                    onChange={handleChange("accessToken")}
                    placeholder="Saisir le jeton Home Assistant"
                    helperText="Le jeton sera créé plus tard dans votre profil Home Assistant."
                  />

                  <FormControl fullWidth>
                    <InputLabel id="connection-mode-label">
                      Mode de connexion
                    </InputLabel>

                    <Select
                      labelId="connection-mode-label"
                      label="Mode de connexion"
                      value={settings.connectionMode}
                      onChange={handleChange("connectionMode")}
                    >
                      <MenuItem value="local">Réseau local</MenuItem>
                      <MenuItem value="remote">
                        Accès distant sécurisé
                      </MenuItem>
                      <MenuItem value="demo">Mode démonstration</MenuItem>
                    </Select>
                  </FormControl>

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      bgcolor: "action.hover",
                    }}
                  >
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      justifyContent="space-between"
                      spacing={2}
                    >
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <RouterRoundedIcon color="primary" />

                        <Box>
                          <Typography fontWeight={800}>
                            État de la connexion
                          </Typography>

                          <Typography variant="body2" color="text.secondary">
                            En attente de l’installation de Home Assistant
                          </Typography>
                        </Box>
                      </Stack>

                      <Chip
                        label="Non connecté"
                        color="default"
                        variant="outlined"
                      />
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, lg: 5 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box
                      sx={{
                        width: 46,
                        height: 46,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: 3,
                        bgcolor: "secondary.main",
                        color: "white",
                      }}
                    >
                      <WifiRoundedIcon />
                    </Box>

                    <Box>
                      <Typography variant="h6" fontWeight={800}>
                        Synchronisation
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Fréquence d’actualisation des équipements
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider />

                  <FormControl fullWidth>
                    <InputLabel id="refresh-interval-label">
                      Actualisation
                    </InputLabel>

                    <Select
                      labelId="refresh-interval-label"
                      label="Actualisation"
                      value={settings.refreshInterval}
                      onChange={handleChange("refreshInterval")}
                    >
                      <MenuItem value={5}>Toutes les 5 secondes</MenuItem>
                      <MenuItem value={10}>Toutes les 10 secondes</MenuItem>
                      <MenuItem value={30}>Toutes les 30 secondes</MenuItem>
                      <MenuItem value={60}>Toutes les minutes</MenuItem>
                    </Select>
                  </FormControl>

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      bgcolor: "action.hover",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Une actualisation courte affichera plus rapidement les
                      changements, mais sollicitera davantage le mini-PC
                      et le réseau local.
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2.5}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box
                      sx={{
                        width: 46,
                        height: 46,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: 3,
                        bgcolor: "warning.main",
                        color: "white",
                      }}
                    >
                      <PaletteRoundedIcon />
                    </Box>

                    <Box>
                      <Typography variant="h6" fontWeight={800}>
                        Apparence
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Préférences visuelles de l’interface
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.darkMode}
                        onChange={handleChange("darkMode")}
                      />
                    }
                    label={
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                      >
                        <DarkModeRoundedIcon fontSize="small" />

                        <Box>
                          <Typography fontWeight={700}>
                            Mode sombre
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            Préparation du futur thème sombre
                          </Typography>
                        </Box>
                      </Stack>
                    }
                  />

                  <FormControl fullWidth>
                    <InputLabel id="language-label">Langue</InputLabel>

                    <Select
                      labelId="language-label"
                      label="Langue"
                      value={settings.language}
                      onChange={handleChange("language")}
                      startAdornment={
                        <LanguageRoundedIcon
                          sx={{
                            mr: 1,
                            color: "text.secondary",
                          }}
                        />
                      }
                    >
                      <MenuItem value="fr">Français</MenuItem>
                      <MenuItem value="en">English</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2.5}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box
                      sx={{
                        width: 46,
                        height: 46,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: 3,
                        bgcolor: "success.main",
                        color: "white",
                      }}
                    >
                      <NotificationsRoundedIcon />
                    </Box>

                    <Box>
                      <Typography variant="h6" fontWeight={800}>
                        Notifications
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Choix des alertes affichées par DomoCenter
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications}
                        onChange={handleChange("notifications")}
                      />
                    }
                    label="Activer les notifications"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.securityAlerts}
                        onChange={handleChange("securityAlerts")}
                        disabled={!settings.notifications}
                      />
                    }
                    label="Alertes de sécurité"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.energyAlerts}
                        onChange={handleChange("energyAlerts")}
                        disabled={!settings.notifications}
                      />
                    }
                    label="Alertes de consommation électrique"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.cameraAlerts}
                        onChange={handleChange("cameraAlerts")}
                        disabled={!settings.notifications}
                      />
                    }
                    label="Alertes des caméras"
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card>
          <CardContent sx={{ p: 3 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "stretch", sm: "center" }}
              justifyContent="space-between"
              spacing={2}
            >
              <Box>
                <Typography variant="h6" fontWeight={800}>
                  Enregistrer la configuration
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Les paramètres sont actuellement conservés uniquement pendant
                  l’utilisation de la page.
                </Typography>
              </Box>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
              >
                <Button
                  variant="outlined"
                  color="inherit"
                  startIcon={<RestartAltRoundedIcon />}
                  onClick={handleReset}
                >
                  Réinitialiser
                </Button>

                <Button
                  variant="contained"
                  startIcon={<SaveRoundedIcon />}
                  onClick={handleSave}
                >
                  Enregistrer
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Typography variant="body2" color="text.secondary">
          Ces paramètres seront ensuite enregistrés durablement et reliés à
          Home Assistant.
        </Typography>
      </Stack>
    </Box>
  );
}

export default SettingsPage;
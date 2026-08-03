import { NavLink, Route, Routes } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  Chip,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import HubRoundedIcon from "@mui/icons-material/HubRounded";
import CircleIcon from "@mui/icons-material/Circle";

import DashboardPage from "./pages/DashboardPage";
import LightingPage from "./pages/LightingPage";
import CameraPage from "./pages/CameraPage";
import SecurityPage from "./pages/SecurityPage";
import EnergyPage from "./pages/EnergyPage";
import SettingsPage from "./pages/SettingsPage";

const drawerWidth = 260;

const menuItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: <HomeRoundedIcon />,
  },
  {
    label: "Éclairage",
    path: "/lighting",
    icon: <LightbulbRoundedIcon />,
  },
  {
    label: "Caméras",
    path: "/cameras",
    icon: <VideocamRoundedIcon />,
  },
  {
    label: "Sécurité",
    path: "/security",
    icon: <SecurityRoundedIcon />,
  },
  {
    label: "Énergie",
    path: "/energy",
    icon: <BoltRoundedIcon />,
  },
  {
    label: "Paramètres",
    path: "/settings",
    icon: <SettingsRoundedIcon />,
  },
];

function App() {
  return (
    <>
      <CssBaseline />

      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            borderBottom: "1px solid",
            borderColor: "rgba(255, 255, 255, 0.12)",
          }}
        >
          <Toolbar sx={{ minHeight: 68 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
              sx={{ width: "100%" }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Avatar
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: "rgba(255, 255, 255, 0.16)",
                  }}
                >
                  <HubRoundedIcon />
                </Avatar>

                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={800}
                    sx={{ lineHeight: 1.15 }}
                  >
                    DomoCenter
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      color: "rgba(255, 255, 255, 0.75)",
                    }}
                  >
                    Centre de contrôle domotique
                  </Typography>
                </Box>
              </Stack>

              <Chip
                icon={
                  <CircleIcon
                    sx={{
                      fontSize: "10px !important",
                    }}
                  />
                }
                label="Mode simulation"
                size="small"
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.14)",
                  color: "white",
                  "& .MuiChip-icon": {
                    color: "#86efac",
                  },
                }}
              />
            </Stack>
          </Toolbar>
        </AppBar>

        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            },
          }}
        >
          <Toolbar sx={{ minHeight: 68 }} />

          <Stack
            sx={{
              height: "100%",
              py: 2,
            }}
          >
            <Box sx={{ px: 2, mb: 1 }}>
              <Typography
                variant="overline"
                color="text.secondary"
                fontWeight={800}
                sx={{
                  letterSpacing: 1.2,
                }}
              >
                Navigation
              </Typography>
            </Box>

            <List sx={{ px: 0.5 }}>
              {menuItems.map((item) => (
                <ListItemButton
                  key={item.path}
                  component={NavLink}
                  to={item.path}
                  end={item.path === "/"}
                  sx={{
                    minHeight: 48,
                    color: "text.secondary",

                    "& .MuiListItemIcon-root": {
                      color: "inherit",
                    },

                    "&:hover": {
                      bgcolor: "action.hover",
                      color: "primary.main",
                    },

                    "&.active": {
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      boxShadow: "0 8px 18px rgba(37, 99, 235, 0.2)",

                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 42,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: 700,
                    }}
                  />
                </ListItemButton>
              ))}
            </List>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ px: 2 }}>
              <Divider sx={{ mb: 2 }} />

              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Avatar
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: "secondary.main",
                    fontSize: 15,
                    fontWeight: 800,
                  }}
                >
                  DC
                </Avatar>

                <Box>
                  <Typography variant="body2" fontWeight={700}>
                    Maison
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    DomoCenter v4
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minWidth: 0,
            minHeight: "100vh",
            bgcolor: "background.default",
          }}
        >
          <Toolbar sx={{ minHeight: 68 }} />

          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/lighting" element={<LightingPage />} />
            <Route path="/cameras" element={<CameraPage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/energy" element={<EnergyPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Box>
      </Box>
    </>
  );
}

export default App;
import { Box, List, ListItemButton, ListItemText, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <Box
      sx={{
        width: 240,
        bgcolor: "#1f2937",
        color: "white",
        minHeight: "100vh",
        p: 2,
      }}
    >
      <Typography variant="h6" sx={{ mb: 3 }}>
        Navigation
      </Typography>

      <List>
        <ListItemButton
          component={NavLink}
          to="/"
          sx={{ color: "white" }}
        >
          <ListItemText primary="🏠 Dashboard" />
        </ListItemButton>

        <ListItemButton component={NavLink} to="/lighting" sx={{ color: "white" }}>
          <ListItemText primary="💡 Éclairage" />
        </ListItemButton>

        <ListItemButton component={NavLink} to="/cameras" sx={{ color: "white" }}>
          <ListItemText primary="📹 Caméras" />
        </ListItemButton>

        <ListItemButton component={NavLink} to="/security" sx={{ color: "white" }}>
          <ListItemText primary="🔒 Sécurité" />
        </ListItemButton>

        <ListItemButton component={NavLink} to="/energy" sx={{ color: "white" }}>
          <ListItemText primary="⚡ Énergie" />
        </ListItemButton>

        <ListItemButton component={NavLink} to="/settings" sx={{ color: "white" }}>
          <ListItemText primary="⚙️ Paramètres" />
        </ListItemButton>
      </List>
    </Box>
  );
}

export default Sidebar;
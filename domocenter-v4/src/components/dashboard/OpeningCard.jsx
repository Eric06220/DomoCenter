import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import DoorFrontRoundedIcon from "@mui/icons-material/DoorFrontRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";

function OpeningCard({ name, location, isOpen, available = true }) {
  const statusLabel = !available
    ? "Indisponible"
    : isOpen
      ? "Ouvert"
      : "Fermé";

  const statusColor = !available
    ? "default"
    : isOpen
      ? "warning"
      : "success";

  return (
    <Card
      sx={{
        height: "100%",
        borderColor: isOpen ? "warning.light" : "divider",
        bgcolor: isOpen
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
                bgcolor: !available
                  ? "action.disabledBackground"
                  : isOpen
                    ? "warning.main"
                    : "success.main",
                color: !available ? "text.disabled" : "white",
              }}
            >
              <DoorFrontRoundedIcon />
            </Box>

            <Chip
              label={statusLabel}
              color={statusColor}
              size="small"
              variant={available ? "filled" : "outlined"}
            />
          </Stack>

          <Box>
            <Typography variant="h6" fontWeight={800}>
              {name}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {location}
            </Typography>
          </Box>

          <Stack direction="row" alignItems="center" spacing={1}>
            {available ? (
              isOpen ? (
                <LockOpenRoundedIcon color="warning" fontSize="small" />
              ) : (
                <LockRoundedIcon color="success" fontSize="small" />
              )
            ) : (
              <DoorFrontRoundedIcon color="disabled" fontSize="small" />
            )}

            <Typography variant="body2" color="text.secondary">
              {!available
                ? "Aucun état reçu depuis Home Assistant."
                : isOpen
                  ? "Une ouverture est actuellement détectée."
                  : "Aucune ouverture détectée."}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default OpeningCard;
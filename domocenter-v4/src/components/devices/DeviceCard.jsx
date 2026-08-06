import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Switch,
  Typography,
} from "@mui/material";

import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";
import PowerRoundedIcon from "@mui/icons-material/PowerRounded";

function getDeviceIcon(icon) {
  if (icon === "outlet") {
    return <PowerRoundedIcon />;
  }

  return <LightbulbRoundedIcon />;
}

function getDeviceType(icon) {
  if (icon === "outlet") {
    return "Prise commandée";
  }

  return "Éclairage connecté";
}

function DeviceCard({
  device,
  pending = false,
  controlsDisabled = false,
  onToggle,
}) {
  const isOn = Boolean(device.displayedIsOn);
  const available = Boolean(device.available);

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        borderColor: !available
          ? "warning.main"
          : isOn
            ? "primary.light"
            : "divider",
        bgcolor: isOn
          ? "rgba(37, 99, 235, 0.035)"
          : "background.paper",
        transition: (theme) =>
          theme.transitions.create(
            ["border-color", "background-color"],
            {
              duration:
                theme.transitions.duration.short,
            }
          ),
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
                  ? "warning.main"
                  : isOn
                    ? "primary.main"
                    : "action.hover",
                color:
                  !available || isOn
                    ? "white"
                    : "text.secondary",
                transition: (theme) =>
                  theme.transitions.create(
                    ["background-color", "color"],
                    {
                      duration:
                        theme.transitions.duration.short,
                    }
                  ),
              }}
            >
              {getDeviceIcon(device.icon)}
            </Box>

            {pending ? (
              <CircularProgress
                size={26}
                sx={{ m: 1 }}
              />
            ) : (
              <Switch
                checked={isOn}
                disabled={
                  !available || controlsDisabled
                }
                onChange={() => onToggle(device)}
                inputProps={{
                  "aria-label":
                    `Activer ou désactiver ${device.name}`,
                }}
              />
            )}
          </Stack>

          <Box>
            <Typography
              variant="h6"
              fontWeight={800}
            >
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

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {device.location}
              </Typography>
            </Stack>
          </Box>

          <Stack spacing={1}>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {device.displayType ??
                getDeviceType(device.icon)}
            </Typography>

            <Chip
              label={
                !available
                  ? "Indisponible"
                  : isOn
                    ? "Allumé"
                    : "Éteint"
              }
              color={
                !available
                  ? "warning"
                  : isOn
                    ? "success"
                    : "default"
              }
              size="small"
              variant={
                !available || isOn
                  ? "filled"
                  : "outlined"
              }
              sx={{
                alignSelf: "flex-start",
              }}
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default DeviceCard;

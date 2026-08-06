import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import PowerOffRoundedIcon from "@mui/icons-material/PowerOffRounded";
import PowerSettingsNewRoundedIcon from "@mui/icons-material/PowerSettingsNewRounded";

import DeviceCard from "./DeviceCard";

function DeviceGroup({
  title,
  icon,
  devices,
  pendingDeviceIds = [],
  controlsDisabled = false,
  groupPending = false,
  onToggleDevice,
  onSetAll,
}) {
  const availableDevices = devices.filter(
    (device) => device.available
  );

  const groupControlledDevices =
    availableDevices.filter(
      (device) => device.groupControl !== false
    );

  const activeCount = availableDevices.filter(
    (device) => device.displayedIsOn
  ).length;

  const groupActiveCount =
    groupControlledDevices.filter(
      (device) => device.displayedIsOn
    ).length;

  const unavailableCount =
    devices.length - availableDevices.length;

  const allGroupDevicesOn =
    groupControlledDevices.length > 0 &&
    groupActiveCount ===
      groupControlledDevices.length;

  const allGroupDevicesOff =
    groupActiveCount === 0;

  return (
    <Stack spacing={2}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{
          xs: "stretch",
          md: "center",
        }}
        justifyContent="space-between"
        spacing={2}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              display: "grid",
              placeItems: "center",
              borderRadius: 3,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>

          <Box>
            <Typography
              variant="h6"
              fontWeight={800}
            >
              {title}
            </Typography>

            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                mt: 0.5,
                flexWrap: "wrap",
                rowGap: 1,
              }}
            >
              <Chip
                size="small"
                label={`${activeCount} / ${availableDevices.length} allumé${
                  activeCount > 1 ? "s" : ""
                }`}
                color={
                  activeCount > 0
                    ? "primary"
                    : "default"
                }
                variant={
                  activeCount > 0
                    ? "filled"
                    : "outlined"
                }
              />

              {unavailableCount > 0 && (
                <Chip
                  size="small"
                  label={`${unavailableCount} indisponible${
                    unavailableCount > 1 ? "s" : ""
                  }`}
                  color="warning"
                />
              )}
            </Stack>
          </Box>
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
        >
          <Button
            variant="outlined"
            startIcon={
              <PowerSettingsNewRoundedIcon />
            }
            disabled={
              controlsDisabled ||
              groupPending ||
              groupControlledDevices.length === 0 ||
              allGroupDevicesOn
            }
            onClick={() =>
              onSetAll(
                groupControlledDevices,
                true
              )
            }
          >
            Tout allumer
          </Button>

          <Button
            variant="outlined"
            color="inherit"
            startIcon={<PowerOffRoundedIcon />}
            disabled={
              controlsDisabled ||
              groupPending ||
              groupControlledDevices.length === 0 ||
              allGroupDevicesOff
            }
            onClick={() =>
              onSetAll(
                groupControlledDevices,
                false
              )
            }
          >
            Tout éteindre
          </Button>
        </Stack>
      </Stack>

      <Divider />

      <Grid container spacing={2}>
        {devices.map((device) => (
          <Grid
            key={device.id}
            size={{ xs: 12, sm: 6, lg: 4 }}
          >
            <DeviceCard
              device={device}
              pending={pendingDeviceIds.includes(
                device.id
              )}
              controlsDisabled={
                controlsDisabled || groupPending
              }
              onToggle={onToggleDevice}
            />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}

export default DeviceGroup;

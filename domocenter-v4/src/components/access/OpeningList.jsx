import {
  Box,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import DoorFrontRoundedIcon from "@mui/icons-material/DoorFrontRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";

function getOpeningStatus(sensor) {
  if (!sensor.available) {
    return {
      label: "Indisponible",
      color: "warning",
      backgroundColor: "rgba(237, 108, 2, 0.04)",
      iconColor: "warning.main",
    };
  }

  if (sensor.isOpen) {
    return {
      label: "Ouverte",
      color: "error",
      backgroundColor: "rgba(211, 47, 47, 0.04)",
      iconColor: "error.main",
    };
  }

  return {
    label: "Fermée",
    color: "success",
    backgroundColor: "transparent",
    iconColor: "success.main",
  };
}

function OpeningRow({ sensor }) {
  const status = getOpeningStatus(sensor);

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      alignItems={{
        xs: "stretch",
        sm: "center",
      }}
      justifyContent="space-between"
      spacing={1.5}
      sx={{
        minHeight: 76,
        pl: 2,
        pr: 2,
        py: 1.5,
        bgcolor: status.backgroundColor,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{
          minWidth: 0,
          flexGrow: 1,
        }}
      >
        <Box
          sx={{
            width: 34,
            height: 34,
            display: "grid",
            placeItems: "center",
            borderRadius: 2,
            bgcolor: "action.hover",
            color: status.iconColor,
            flexShrink: 0,
          }}
        >
          <DoorFrontRoundedIcon
            sx={{ fontSize: 20 }}
          />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="body1"
            noWrap
            sx={{
              fontSize: "0.98rem",
              fontWeight: 600,
              lineHeight: 1.2,
              color: "text.primary",
            }}
          >
            {sensor.name}
          </Typography>

          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
            sx={{ mt: 0.25 }}
          >
            <LocationOnRoundedIcon
              sx={{
                fontSize: 15,
                color: "text.secondary",
              }}
            />

            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
            >
              {sensor.location}
            </Typography>
          </Stack>
        </Box>
      </Stack>

      <Box
        sx={{
          display: "flex",
          justifyContent: {
            xs: "flex-start",
            sm: "flex-end",
          },
          alignItems: "center",
          width: {
            xs: "100%",
            sm: 132,
          },
          pr: {
            xs: 0,
            sm: 1,
          },
          flexShrink: 0,
          height: "100%",
        }}
      >
        <Chip
          label={status.label}
          color={status.color}
          size="small"
          variant={
            sensor.available
              ? "filled"
              : "outlined"
          }
          sx={{
            minWidth: 96,
          }}
        />
      </Box>
    </Stack>
  );
}

function OpeningList({
  sensors = [],
  openCount = 0,
}) {
  return (
    <Stack spacing={2}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{
          xs: "flex-start",
          sm: "center",
        }}
        justifyContent="space-between"
        spacing={1}
      >
        <Typography
          variant="h6"
          fontWeight={800}
        >
          Ouvertures
        </Typography>

        <Chip
          size="small"
          label={`${openCount} / ${sensors.length} ouverte${
            openCount > 1 ? "s" : ""
          }`}
          color={
            openCount > 0
              ? "error"
              : "success"
          }
          variant="filled"
        />
      </Stack>

      <Grid container spacing={2}>
        {sensors.map((sensor) => (
          <Grid
            key={sensor.id}
            size={{ xs: 12, md: 6 }}
          >
            <Paper
              variant="outlined"
              sx={{
                height: "100%",
                overflow: "hidden",
              }}
            >
              <OpeningRow sensor={sensor} />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}

export default OpeningList;

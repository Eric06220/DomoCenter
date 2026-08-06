import {
  Box,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

function DeviceHeader({
  title,
  subtitle,
  active = 0,
  unavailable = 0,
}) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{
        xs: "flex-start",
        sm: "center",
      }}
      spacing={2}
    >
      <Box>
        <Typography
          variant="h4"
          fontWeight={800}
        >
          {title}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
        >
          {subtitle}
        </Typography>
      </Box>

      <Chip
        icon={
          unavailable > 0
            ? <WarningAmberRoundedIcon />
            : <CheckCircleRoundedIcon />
        }
        label={
          unavailable > 0
            ? `${unavailable} indisponible${
                unavailable > 1 ? "s" : ""
              }`
            : `${active} actif${
                active > 1 ? "s" : ""
              }`
        }
        color={
          unavailable > 0
            ? "warning"
            : active > 0
              ? "primary"
              : "default"
        }
        variant={
          unavailable > 0 || active > 0
            ? "filled"
            : "outlined"
        }
      />
    </Stack>
  );
}

export default DeviceHeader;

import {
  Stack,
  Typography,
} from "@mui/material";

function getBatteryState(level) {
  if (!Number.isFinite(level)) {
    return {
      symbol: "❓",
      color: "text.secondary",
    };
  }

  if (level < 10) {
    return {
      symbol: "🔴",
      color: "error.main",
    };
  }

  if (level < 20) {
    return {
      symbol: "🟠",
      color: "warning.main",
    };
  }

  return {
    symbol: "✅",
    color: "success.main",
  };
}

function BatteryStatus({
  level,
  showWhenUnavailable = false,
}) {
  const available = Number.isFinite(level);

  if (!available && !showWhenUnavailable) {
    return null;
  }

  const state = getBatteryState(level);

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.5}
      sx={{ whiteSpace: "nowrap" }}
    >
      <Typography
        component="span"
        variant="body2"
      >
        🔋
      </Typography>

      <Typography
        component="span"
        variant="body2"
        fontWeight={600}
        color={state.color}
      >
        {available
          ? `${Math.round(level)} %`
          : "--"}
      </Typography>

      <Typography
        component="span"
        variant="body2"
      >
        {state.symbol}
      </Typography>
    </Stack>
  );
}

export default BatteryStatus;

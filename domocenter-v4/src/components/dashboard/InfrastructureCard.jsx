import {
  Box,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

function getStatusColor(value, warningThreshold, criticalThreshold) {
  if (!Number.isFinite(value)) {
    return "inherit";
  }

  if (value >= criticalThreshold) {
    return "error.main";
  }

  if (value >= warningThreshold) {
    return "warning.main";
  }

  return "success.main";
}

function InfrastructureCard({
  title,
  metric,
  icon,
  warningThreshold = 70,
  criticalThreshold = 85,
  progress = false,
}) {
  const available =
    Boolean(metric?.available) &&
    Number.isFinite(metric?.value);

  const value = available ? metric.value : null;
  const unit = metric?.unit ?? "";

  const statusColor = available
    ? getStatusColor(
        value,
        warningThreshold,
        criticalThreshold
      )
    : "text.disabled";

  const progressValue =
    progress && available
      ? Math.min(100, Math.max(0, value))
      : 0;

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                display: "grid",
                placeItems: "center",
                borderRadius: 3,
                bgcolor: "action.hover",
                color: statusColor,
                flexShrink: 0,
              }}
            >
              {icon}
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                {title}
              </Typography>

              <Typography
                variant="h5"
                fontWeight={800}
                color={statusColor}
              >
                {available
                  ? `${value.toFixed(1)} ${unit}`
                  : "Indisponible"}
              </Typography>
            </Box>
          </Stack>

          {progress && (
            <LinearProgress
              variant="determinate"
              value={progressValue}
              color={
                !available
                  ? "inherit"
                  : value >= criticalThreshold
                    ? "error"
                    : value >= warningThreshold
                      ? "warning"
                      : "success"
              }
              sx={{
                height: 8,
                borderRadius: 999,
              }}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default InfrastructureCard;
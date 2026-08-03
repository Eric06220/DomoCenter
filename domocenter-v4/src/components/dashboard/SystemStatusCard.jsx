import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloudDoneRoundedIcon from "@mui/icons-material/CloudDoneRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SensorsRoundedIcon from "@mui/icons-material/SensorsRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

function formatRelativeTime(timestamp) {
  if (!timestamp) {
    return "date inconnue";
  }

  const timestampMs = new Date(timestamp).getTime();

  if (!Number.isFinite(timestampMs)) {
    return "date inconnue";
  }

  const elapsedSeconds = Math.max(
    0,
    Math.floor((Date.now() - timestampMs) / 1000)
  );

  if (elapsedSeconds < 60) {
    return `il y a ${elapsedSeconds} seconde${
      elapsedSeconds > 1 ? "s" : ""
    }`;
  }

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);

  if (elapsedMinutes < 60) {
    return `il y a ${elapsedMinutes} minute${
      elapsedMinutes > 1 ? "s" : ""
    }`;
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60);

  return `il y a ${elapsedHours} heure${
    elapsedHours > 1 ? "s" : ""
  }`;
}

function clampPercentage(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, value));
}

function calculateGlobalStatus({
  homeAssistantConnected,
  domoCenterConnected,
  tuyaConnected,
  internetConnected,
  cpuTemperature,
  cpuUsage,
  memoryUsage,
  diskUsage,
}) {
  const criticalReasons = [];
  const warningReasons = [];

  if (!homeAssistantConnected) {
    criticalReasons.push("Home Assistant inaccessible");
  }

  if (!domoCenterConnected) {
    criticalReasons.push("DomoCenter indisponible");
  }

  if (!tuyaConnected) {
    criticalReasons.push("Tuya inaccessible");
  }

  if (!internetConnected) {
    criticalReasons.push("connexion Internet indisponible");
  }

  if (
    Number.isFinite(cpuTemperature) &&
    cpuTemperature >= 75
  ) {
    criticalReasons.push("température CPU critique");
  } else if (
    Number.isFinite(cpuTemperature) &&
    cpuTemperature >= 60
  ) {
    warningReasons.push("température CPU élevée");
  }

  if (
    Number.isFinite(cpuUsage) &&
    cpuUsage >= 95
  ) {
    criticalReasons.push("CPU saturé");
  } else if (
    Number.isFinite(cpuUsage) &&
    cpuUsage >= 80
  ) {
    warningReasons.push("utilisation CPU élevée");
  }

  if (
    Number.isFinite(memoryUsage) &&
    memoryUsage >= 90
  ) {
    criticalReasons.push("mémoire critique");
  } else if (
    Number.isFinite(memoryUsage) &&
    memoryUsage >= 75
  ) {
    warningReasons.push("mémoire élevée");
  }

  if (
    Number.isFinite(diskUsage) &&
    diskUsage >= 90
  ) {
    criticalReasons.push("disque presque plein");
  } else if (
    Number.isFinite(diskUsage) &&
    diskUsage >= 80
  ) {
    warningReasons.push("espace disque faible");
  }

  if (criticalReasons.length > 0) {
    return {
      label: "Critique",
      color: "error",
      description: criticalReasons.join(" · "),
    };
  }

  if (warningReasons.length > 0) {
    return {
      label: "À surveiller",
      color: "warning",
      description: warningReasons.join(" · "),
    };
  }

  return {
    label: "Bon",
    color: "success",
    description:
      "Tous les services et indicateurs système sont normaux",
  };
}

function MetricItem({
  label,
  value,
  progress,
  description,
}) {
  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="baseline"
        spacing={2}
        sx={{ mb: 0.75 }}
      >
        <Typography variant="body2" fontWeight={700}>
          {label}
        </Typography>

        <Typography variant="body2" fontWeight={800}>
          {value}
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={clampPercentage(progress)}
        sx={{
          height: 8,
          borderRadius: 999,
        }}
      />

      {description && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 0.5 }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
}

function ServiceItem({
  label,
  online,
  description,
  icon,
}) {
  return (
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
          bgcolor: online
            ? "success.main"
            : "error.main",
          color: "white",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography fontWeight={800}>
          {label}
        </Typography>

        <Typography
          variant="body2"
          color={
            online
              ? "success.main"
              : "error.main"
          }
        >
          {description}
        </Typography>
      </Box>
    </Stack>
  );
}

function SystemStatusCard({
  dashboard,
  refreshing = false,
  onRefresh,
}) {
  const system = dashboard?.system;
  const services = dashboard?.services;
  const infrastructure = dashboard?.infrastructure;

  const homeAssistant = system?.homeAssistant;
  const tuya = system?.tuya;
  const cache = system?.cache;

  const homeAssistantConnected = Boolean(
    services?.homeAssistant?.online ??
      homeAssistant?.connected
  );

  const domoCenterConnected = Boolean(
    services?.domoCenter?.online
  );

  const tuyaConnected = Boolean(
    services?.tuya?.online ??
      tuya?.connected
  );

  const internetConnected = Boolean(
    services?.internet?.online
  );

  const unavailableCount =
    homeAssistant?.unavailableEntityCount ?? 0;

  const tuyaLastUpdate =
    services?.tuya?.lastUpdate ??
    tuya?.latestDataUpdate ??
    null;

  const cpuTemperature =
    infrastructure?.cpuTemperature?.available
      ? infrastructure.cpuTemperature.value
      : null;

  const cpuUsage =
    infrastructure?.cpuUsage?.available
      ? infrastructure.cpuUsage.value
      : null;

  const memoryUsage =
    infrastructure?.memoryUsage?.available
      ? infrastructure.memoryUsage.value
      : null;

  const diskUsed =
    infrastructure?.diskUsed?.available
      ? infrastructure.diskUsed.value
      : null;

  const diskFree =
    infrastructure?.diskFree?.available
      ? infrastructure.diskFree.value
      : null;

  const diskTotal =
    Number.isFinite(diskUsed) &&
    Number.isFinite(diskFree)
      ? diskUsed + diskFree
      : null;

  const diskUsage =
    Number.isFinite(diskUsed) &&
    Number.isFinite(diskTotal) &&
    diskTotal > 0
      ? (diskUsed / diskTotal) * 100
      : null;

  const globalStatus = calculateGlobalStatus({
    homeAssistantConnected,
    domoCenterConnected,
    tuyaConnected,
    internetConnected,
    cpuTemperature,
    cpuUsage,
    memoryUsage,
    diskUsage,
  });

  return (
    <Card>
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={3}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "stretch", md: "center" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Chip
                label={`État général : ${globalStatus.label}`}
                color={globalStatus.color}
                sx={{ mb: 1.5 }}
              />

              <Typography variant="h6" fontWeight={800}>
                Centre de supervision
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {globalStatus.description}
              </Typography>
            </Box>

            <Button
              variant="outlined"
              startIcon={<RefreshRoundedIcon />}
              onClick={onRefresh}
              disabled={refreshing}
            >
              {refreshing
                ? "Synchronisation..."
                : "Synchroniser"}
            </Button>
          </Stack>

          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={800}
              sx={{ mb: 2 }}
            >
              Santé du Raspberry Pi
            </Typography>

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 6 }}>
                <MetricItem
                  label="Utilisation CPU"
                  value={
                    Number.isFinite(cpuUsage)
                      ? `${cpuUsage.toFixed(0)} %`
                      : "Indisponible"
                  }
                  progress={cpuUsage}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <MetricItem
                  label="Mémoire"
                  value={
                    Number.isFinite(memoryUsage)
                      ? `${memoryUsage.toFixed(1)} %`
                      : "Indisponible"
                  }
                  progress={memoryUsage}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <MetricItem
                  label="Température CPU"
                  value={
                    Number.isFinite(cpuTemperature)
                      ? `${cpuTemperature.toFixed(1)} °C`
                      : "Indisponible"
                  }
                  progress={
                    Number.isFinite(cpuTemperature)
                      ? (cpuTemperature / 80) * 100
                      : 0
                  }
                  description="Surveillance à partir de 60 °C"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <MetricItem
                  label="Disque utilisé"
                  value={
                    Number.isFinite(diskUsage)
                      ? `${diskUsage.toFixed(1)} %`
                      : "Indisponible"
                  }
                  progress={diskUsage}
                  description={
                    Number.isFinite(diskUsed) &&
                    Number.isFinite(diskTotal)
                      ? `${diskUsed.toFixed(
                          1
                        )} / ${diskTotal.toFixed(1)} GiB`
                      : null
                  }
                />
              </Grid>
            </Grid>
          </Box>

          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={800}
              sx={{ mb: 2 }}
            >
              Services
            </Typography>

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <ServiceItem
                  label="Home Assistant"
                  online={homeAssistantConnected}
                  description={
                    homeAssistantConnected
                      ? "Connecté"
                      : "Inaccessible"
                  }
                  icon={<CloudDoneRoundedIcon />}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <ServiceItem
                  label="DomoCenter"
                  online={domoCenterConnected}
                  description={
                    domoCenterConnected
                      ? "Opérationnel"
                      : "Indisponible"
                  }
                  icon={<CheckCircleRoundedIcon />}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <ServiceItem
                  label="Tuya"
                  online={tuyaConnected}
                  description={
                    tuyaConnected
                      ? `Synchronisé ${formatRelativeTime(
                          tuyaLastUpdate
                        )}`
                      : "Inaccessible"
                  }
                  icon={<CheckCircleRoundedIcon />}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <ServiceItem
                  label="Internet"
                  online={internetConnected}
                  description={
                    internetConnected
                      ? "Connecté"
                      : "Inaccessible"
                  }
                  icon={<CloudDoneRoundedIcon />}
                />
              </Grid>
            </Grid>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            spacing={1}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
            >
              {unavailableCount > 0 ? (
                <WarningAmberRoundedIcon
                  color="warning"
                  fontSize="small"
                />
              ) : (
                <SensorsRoundedIcon
                  color="primary"
                  fontSize="small"
                />
              )}

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {homeAssistant?.entityCount ?? 0} entités ·{" "}
                {unavailableCount} indisponible
                {unavailableCount > 1 ? "s" : ""}
              </Typography>
            </Stack>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Cache :{" "}
              {cache?.fromCache
                ? "données en cache"
                : "données fraîches"}{" "}
              · {cache?.durationSeconds ?? 10} secondes
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default SystemStatusCard;

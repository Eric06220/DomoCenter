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
  tuyaWarning,
  tuyaCritical,
  internetConnected,
  homeAssistantVmOnline,
  cpuUsage,
  memoryUsage,
  systemDiskUsage,
  backupDiskUsage,
}) {
  const criticalReasons = [];
  const warningReasons = [];

  if (!homeAssistantConnected) {
    criticalReasons.push(
      "Home Assistant inaccessible"
    );
  }

  if (!homeAssistantVmOnline) {
    criticalReasons.push(
      "VM Home Assistant arrêtée"
    );
  }

  if (!domoCenterConnected) {
    criticalReasons.push(
      "DomoCenter indisponible"
    );
  }

  if (!tuyaConnected) {
    criticalReasons.push(
      "Tuya inaccessible"
    );
  }

  if (tuyaCritical) {
    criticalReasons.push(
      "données Tuya probablement figées"
    );
  } else if (tuyaWarning) {
    warningReasons.push(
      "données Tuya à vérifier"
    );
  }

  if (!internetConnected) {
    criticalReasons.push(
      "connexion Internet indisponible"
    );
  }

  if (
    Number.isFinite(cpuUsage) &&
    cpuUsage >= 95
  ) {
    criticalReasons.push(
      "CPU saturé"
    );
  } else if (
    Number.isFinite(cpuUsage) &&
    cpuUsage >= 80
  ) {
    warningReasons.push(
      "utilisation CPU élevée"
    );
  }

  if (
    Number.isFinite(memoryUsage) &&
    memoryUsage >= 90
  ) {
    criticalReasons.push(
      "mémoire critique"
    );
  } else if (
    Number.isFinite(memoryUsage) &&
    memoryUsage >= 80
  ) {
    warningReasons.push(
      "mémoire élevée"
    );
  }

  if (
    Number.isFinite(systemDiskUsage) &&
    systemDiskUsage >= 90
  ) {
    criticalReasons.push(
      "SSD système presque plein"
    );
  } else if (
    Number.isFinite(systemDiskUsage) &&
    systemDiskUsage >= 80
  ) {
    warningReasons.push(
      "espace SSD système faible"
    );
  }

  if (
    Number.isFinite(backupDiskUsage) &&
    backupDiskUsage >= 95
  ) {
    criticalReasons.push(
      "disque de sauvegarde presque plein"
    );
  } else if (
    Number.isFinite(backupDiskUsage) &&
    backupDiskUsage >= 85
  ) {
    warningReasons.push(
      "espace sauvegarde faible"
    );
  }

  if (criticalReasons.length > 0) {
    return {
      label: "Critique",
      color: "error",
      description:
        criticalReasons.join(" · "),
    };
  }

  if (warningReasons.length > 0) {
    return {
      label: "À surveiller",
      color: "warning",
      description:
        warningReasons.join(" · "),
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
  statusColor,
}) {
  const effectiveColor =
    statusColor ??
    (online ? "success" : "error");

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
          bgcolor: `${effectiveColor}.main`,
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
          color={`${effectiveColor}.main`}
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

  const tuyaHealth =
    tuya?.health ?? null;

  const tuyaWarning =
    tuyaHealth?.warning === true;

  const tuyaCritical =
    tuyaHealth?.critical === true;

  const tuyaHealthLabel =
    tuyaHealth?.label ??
    services?.tuya?.healthLabel ??
    "Tuya";

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

  const cpuUsage =
    Number.isFinite(
      infrastructure?.cpu?.usage
    )
      ? infrastructure.cpu.usage
      : null;

  const memoryUsage =
    Number.isFinite(
      infrastructure?.memory?.usage
    )
      ? infrastructure.memory.usage
      : null;

  const systemDisk =
    infrastructure?.disks?.system ?? null;

  const backupDisk =
    infrastructure?.disks?.backup ?? null;

  const systemDiskUsage =
    systemDisk?.available === true &&
    Number.isFinite(systemDisk?.usage)
      ? systemDisk.usage
      : null;

  const backupDiskUsage =
    backupDisk?.available === true &&
    Number.isFinite(backupDisk?.usage)
      ? backupDisk.usage
      : null;

  const homeAssistantVmOnline =
    infrastructure
      ?.homeAssistantVm
      ?.online === true;

  const globalStatus = calculateGlobalStatus({
    homeAssistantConnected,
    domoCenterConnected,
    tuyaConnected,
    tuyaWarning,
    tuyaCritical,
    internetConnected,
    homeAssistantVmOnline,
    cpuUsage,
    memoryUsage,
    systemDiskUsage,
    backupDiskUsage,
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
              Santé du mini-PC
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
                  description={
                    Number.isFinite(
                      infrastructure?.memory?.usedGiB
                    ) &&
                    Number.isFinite(
                      infrastructure?.memory?.totalGiB
                    )
                      ? `${infrastructure.memory.usedGiB.toFixed(
                          1
                        )} / ${infrastructure.memory.totalGiB.toFixed(
                          1
                        )} GiB`
                      : null
                  }
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <MetricItem
                  label="SSD système C:"
                  value={
                    Number.isFinite(systemDiskUsage)
                      ? `${systemDiskUsage.toFixed(1)} %`
                      : "Indisponible"
                  }
                  progress={systemDiskUsage}
                  description={
                    Number.isFinite(systemDisk?.usedGiB) &&
                    Number.isFinite(systemDisk?.totalGiB)
                      ? `${systemDisk.usedGiB.toFixed(
                          1
                        )} / ${systemDisk.totalGiB.toFixed(
                          1
                        )} GiB`
                      : null
                  }
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <MetricItem
                  label="Sauvegarde D:"
                  value={
                    Number.isFinite(backupDiskUsage)
                      ? `${backupDiskUsage.toFixed(1)} %`
                      : "Indisponible"
                  }
                  progress={backupDiskUsage}
                  description={
                    Number.isFinite(backupDisk?.usedGiB) &&
                    Number.isFinite(backupDisk?.totalGiB)
                      ? `${backupDisk.usedGiB.toFixed(
                          1
                        )} / ${backupDisk.totalGiB.toFixed(
                          1
                        )} GiB`
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
              <Grid size={{ xs: 6, sm: 6, lg: 3 }}>
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

              <Grid size={{ xs: 6, sm: 6, lg: 3 }}>
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

              <Grid size={{ xs: 6, sm: 6, lg: 3 }}>
                <ServiceItem
                  label="Tuya"
                  online={tuyaConnected}
                  statusColor={
                    !tuyaConnected
                      ? "error"
                      : tuyaCritical
                      ? "error"
                      : tuyaWarning
                      ? "warning"
                      : "success"
                  }
                  description={
                    !tuyaConnected
                      ? "Inaccessible"
                      : tuyaHealthLabel
                  }
                  icon={
                    tuyaCritical || tuyaWarning ? (
                      <WarningAmberRoundedIcon />
                    ) : (
                      <CheckCircleRoundedIcon />
                    )
                  }
                />
              </Grid>

              <Grid size={{ xs: 6, sm: 6, lg: 3 }}>
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

import { Box, Grid, Typography } from "@mui/material";
import MemoryIcon from "@mui/icons-material/Memory";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import StorageIcon from "@mui/icons-material/Storage";
import DnsIcon from "@mui/icons-material/Dns";

import InfrastructureCard from "./InfrastructureCard";

function InfrastructureSection({
  infrastructure,
  loading = false,
}) {
  if (!infrastructure) {
    return null;
  }

  const diskUsed = infrastructure.diskUsed?.value ?? 0;
  const diskFree = infrastructure.diskFree?.value ?? 0;

  const diskTotal = diskUsed + diskFree;

  const diskUsage = diskTotal
    ? (diskUsed / diskTotal) * 100
    : 0;

  const diskMetric = {
    available: true,
    value: diskUsage,
    unit: "%",
  };
  
  
  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>
        Infrastructure
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 2 }}
      >
        État du Raspberry Pi et de Home Assistant
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <InfrastructureCard
            title="Température CPU"
            metric={infrastructure.cpuTemperature}
            icon={<ThermostatIcon />}
            warningThreshold={60}
            criticalThreshold={75}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <InfrastructureCard
            title="Utilisation CPU"
            metric={infrastructure.cpuUsage}
            icon={<MemoryIcon />}
            progress
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <InfrastructureCard
            title="Mémoire"
            metric={infrastructure.memoryUsage}
            icon={<DnsIcon />}
            progress
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
        <InfrastructureCard
          title={`Disque (${diskUsed.toFixed(1)} / ${diskTotal.toFixed(1)} GiB)`}
          metric={diskMetric}
          icon={<StorageIcon />}
          progress
        />
        
        </Grid>
      </Grid>
    </Box>
  );
}

export default InfrastructureSection;

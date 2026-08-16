import {
  Alert,
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import BeachAccessRoundedIcon from "@mui/icons-material/BeachAccessRounded";
import BuildRoundedIcon from "@mui/icons-material/BuildRounded";

import SectionCard from "../common/SectionCard";

const MODES = [
  {
    id: "present",
    label: "Présent",
    icon: <HomeRoundedIcon />,
    color: "success",
  },
  {
    id: "absent",
    label: "Absent",
    icon: <LockRoundedIcon />,
    color: "warning",
  },
  {
    id: "vacation",
    label: "Congés",
    icon: <BeachAccessRoundedIcon />,
    color: "info",
  },
  {
    id: "maintenance",
    label: "Maintenance",
    icon: <BuildRoundedIcon />,
    color: "secondary",
  },
];

function HouseModeSummary({
  mode,
  loading = false,
  changing = false,
  error = "",
  onChange,
}) {
  const currentMode =
    MODES.find(
      (item) =>
        item.id === mode
    ) ?? MODES[0];

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
      }}
    >
      <SectionCard
        title="Mode maison"
        icon={currentMode.icon}
      >
        <Stack spacing={2}>
          <Typography
            variant="body1"
            fontWeight={700}
          >
            Mode actif :{" "}
            {currentMode.label}
          </Typography>

          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1}
            flexWrap="wrap"
            useFlexGap
          >
            {MODES.map(
              (item) => {
                const active =
                  item.id === mode;

                return (
                  <Button
                    key={item.id}
                    variant={
                      active
                        ? "contained"
                        : "outlined"
                    }
                    color={
                      item.color
                    }
                    startIcon={
                      item.icon
                    }
                    disabled={
                      loading ||
                      changing
                    }
                    onClick={() =>
                      onChange(
                        item.id
                      )
                    }
                    sx={{
                      textTransform:
                        "none",
                      fontWeight: 700,
                    }}
                  >
                    {item.label}
                  </Button>
                );
              }
            )}
          </Stack>
        </Stack>
      </SectionCard>
    </Box>
  );
}

export default HouseModeSummary;

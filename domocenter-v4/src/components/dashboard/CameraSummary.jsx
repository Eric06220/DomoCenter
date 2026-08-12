import {
  Box,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import SectionCard from "../common/SectionCard";

function CameraSummary({
  cameras,
  loading = false,
}) {
  const integrated =
    cameras?.integrated ?? 0;

  const available =
    cameras?.available ?? 0;

  const unavailable =
    cameras?.unavailable ?? 0;

  const notIntegrated =
    cameras?.notIntegrated ?? 0;

  const hasFailure =
    unavailable > 0;

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        height: "100%",
      }}
    >
      <SectionCard
        title="Caméras"
        icon={<VideocamRoundedIcon />}
        action={
          <Chip
            size="small"
            label={`${available} / ${integrated} disponibles`}
            color={
              hasFailure
                ? "error"
                : "success"
            }
            variant="outlined"
          />
        }
      >
        {loading ? (
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Chargement des caméras…
          </Typography>
        ) : hasFailure ? (
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
          >
            <WarningAmberRoundedIcon
              sx={{
                color: "error.main",
                fontSize: 20,
              }}
            />

            <Typography
              variant="body1"
              fontWeight={600}
              color="error.main"
            >
              {unavailable} caméra
              {unavailable > 1 ? "s" : ""}{" "}
              indisponible
              {unavailable > 1 ? "s" : ""}.
            </Typography>
          </Stack>
        ) : (
          <Stack spacing={0.5}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
            >
              <CheckCircleRoundedIcon
                sx={{
                  color: "success.main",
                  fontSize: 20,
                }}
              />

              <Typography variant="body1">
                Toutes les caméras intégrées sont disponibles.
              </Typography>
            </Stack>

            {notIntegrated > 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
              >
                {notIntegrated} caméra
                {notIntegrated > 1 ? "s" : ""}{" "}
                non intégrée
                {notIntegrated > 1 ? "s" : ""}.
              </Typography>
            )}
          </Stack>
        )}
      </SectionCard>
    </Box>
  );
}

export default CameraSummary;

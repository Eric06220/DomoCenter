import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import FenceRoundedIcon from "@mui/icons-material/FenceRounded";

function PortalCard({
  portal,
  pending = false,
  onTrigger,
}) {
  const available = Boolean(portal?.available);

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 2.5 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{
            xs: "stretch",
            sm: "center",
          }}
          justifyContent="space-between"
          spacing={3}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                display: "grid",
                placeItems: "center",
                borderRadius: 3,
                bgcolor: available
                  ? "primary.main"
                  : "warning.main",
                color: "white",
                flexShrink: 0,
              }}
            >
              <FenceRoundedIcon />
            </Box>

            <Box>
              <Typography
                variant="h6"
                fontWeight={800}
              >
                {portal?.name ?? "Portail"}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Envoie une impulsion à la motorisation du portail.
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="contained"
            size="large"
            disabled={!available || pending}
            onClick={onTrigger}
            startIcon={
              pending ? (
                <CircularProgress
                  size={20}
                  color="inherit"
                />
              ) : (
                <FenceRoundedIcon />
              )
            }
          >
            {pending
              ? "Commande en cours…"
              : "Déclencher"}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default PortalCard;

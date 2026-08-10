import {
  Box,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

function SectionCard({
  title,
  icon,
  action,
  children,
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        height: "100%",
        p: 2,
        borderRadius: 3,
      }}
    >
      <Stack spacing={2}>
        {(title || icon || action) && (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ minWidth: 0 }}
            >
              {icon && (
                <Box
                  sx={{
                    display: "grid",
                    placeItems: "center",
                    color: "primary.main",
                  }}
                >
                  {icon}
                </Box>
              )}

              {title && (
                <Typography
                  variant="h6"
                  fontWeight={800}
                  noWrap
                >
                  {title}
                </Typography>
              )}
            </Stack>

            {action && (
              <Box sx={{ flexShrink: 0 }}>
                {action}
              </Box>
            )}
          </Stack>
        )}

        {children}
      </Stack>
    </Paper>
  );
}

export default SectionCard;

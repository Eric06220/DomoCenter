import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import App from "./App.jsx";
import "./index.css";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563eb",
      dark: "#1d4ed8",
      light: "#60a5fa",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#0f766e",
    },
    background: {
      default: "#f4f6f8",
      paper: "#ffffff",
    },
    success: {
      main: "#16a34a",
    },
    warning: {
      main: "#f59e0b",
    },
    error: {
      main: "#dc2626",
    },
  },

  shape: {
    borderRadius: 14,
  },

  typography: {
    fontFamily:
      '"Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',

    h4: {
      fontWeight: 700,
    },

    h5: {
      fontWeight: 700,
    },

    h6: {
      fontWeight: 700,
    },

    button: {
      fontWeight: 700,
      textTransform: "none",
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          minWidth: 320,
          minHeight: "100vh",
          backgroundColor: "#f4f6f8",
        },

        "*": {
          boxSizing: "border-box",
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },

    MuiCard: {
      defaultProps: {
        elevation: 0,
      },

      styleOverrides: {
        root: {
          border: "1px solid #e5e7eb",
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",

          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 12px 30px rgba(15, 23, 42, 0.1)",
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingLeft: 18,
          paddingRight: 18,
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          marginLeft: 10,
          marginRight: 10,
          marginBottom: 4,
        },
      },
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
import { createTheme } from "@mui/material/styles";

export const getTheme = (mode: "light" | "dark") =>
    createTheme({
        palette: {
            mode,
            primary: {
                main: mode === "light" ? "#1976d2" : "#90caf9",
            },
            background: {
                default: mode === "light" ? "#f5f5f5" : "#121212",
                paper: mode === "light" ? "#fff" : "#1e1e1e",
            },
        },
    });
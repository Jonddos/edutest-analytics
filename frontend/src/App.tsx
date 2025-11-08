import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import Home from "./pages/Home";
import Evaluation from "./pages/Evaluation";
import Questions from "./pages/Questions";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TakeEvaluation from "./pages/TakeEvaluation";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import DashboardLayout from "./components/DashboardLayout";
import Analytics from "./pages/Analytics";
import Landing from "./pages/Landing";

interface AppProps {
    mode: "light" | "dark";
    toggleColorMode: () => void;
}

export default function App({ mode, toggleColorMode }: AppProps) {
    const theme = createTheme({
        palette: {
            mode,
            primary: { main: "#3b82f6" },
            secondary: { main: "#10b981" },
            background: {
                default: mode === "light" ? "#f9fafb" : "#0f172a",
                paper: mode === "light" ? "#ffffff" : "#1e293b",
            },
        },
        typography: {
            fontFamily: "Inter, Poppins, sans-serif",
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Routes>
                    {/* 🔓 Rutas públicas (redirigen si ya está logeado) */}
                    <Route
                        path="/"
                        element={
                            <PublicRoute>
                                <Landing />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <PublicRoute>
                                <Register />
                            </PublicRoute>
                        }
                    />

                    {/* 👨‍🎓 Ruta pública para estudiantes */}
                    <Route path="/take/:id" element={<TakeEvaluation />} />

                    {/* 🔒 Rutas protegidas */}
                    <Route
                        path="/home"
                        element={
                            <ProtectedRoute>
                                <DashboardLayout mode={mode} toggleColorMode={toggleColorMode}>
                                    <Home />
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/evaluation"
                        element={
                            <ProtectedRoute>
                                <DashboardLayout mode={mode} toggleColorMode={toggleColorMode}>
                                    <Evaluation />
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/evaluation/:id/questions"
                        element={
                            <ProtectedRoute>
                                <DashboardLayout mode={mode} toggleColorMode={toggleColorMode}>
                                    <Questions />
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/analytics"
                        element={
                            <ProtectedRoute>
                                <DashboardLayout mode={mode} toggleColorMode={toggleColorMode}>
                                    <Analytics />
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

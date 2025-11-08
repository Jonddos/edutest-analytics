import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Evaluation from "./pages/Evaluation";
import Questions from "./pages/Questions";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TakeEvaluation from "./pages/TakeEvaluation";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import Analytics from "./pages/Analytics";
import Landing from "./pages/Landing.tsx";

interface AppProps {
    mode: "light" | "dark";
    toggleColorMode: () => void;
}


export default function App({ mode, toggleColorMode }: AppProps) {
    return (
        <BrowserRouter>
            <Routes>
                {/* 🔓 Rutas públicas */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* 👨‍🎓 Ruta pública para estudiantes */}
                <Route path="/take/:id" element={<TakeEvaluation />} />

                {/* 🔒 Rutas protegidas para docentes */}
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
    );
}

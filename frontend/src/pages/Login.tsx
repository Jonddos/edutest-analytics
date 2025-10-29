import { useState } from "react";
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Stack,
    CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosClient";
import { toast } from "react-toastify";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!form.email || !form.password) {
            toast.warning("Por favor completa todos los campos");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post("/auth/login", form);
            const token = res.data.access_token;

            localStorage.setItem("token", token);
            localStorage.setItem("role", res.data.role);

            toast.success(`Inicio de sesión exitoso como ${res.data.role === "teacher" ? "docente" : "usuario"} 🎉`);
            setTimeout(() => navigate("/"), 1200);
        } catch (err: any) {
            if (err.response?.data?.detail) {
                toast.error(err.response.data.detail);
            } else {
                toast.error("Error al iniciar sesión");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container sx={{ mt: 8 }}>
            <Paper sx={{ p: 4, maxWidth: 450, mx: "auto" }}>
                <Typography variant="h4" gutterBottom textAlign="center">
                    Iniciar sesión
                </Typography>
                <Stack spacing={3}>
                    <TextField
                        label="Correo electrónico"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Contraseña"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                    />
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : "Entrar"}
                    </Button>

                    <Typography textAlign="center">
                        ¿No tienes cuenta?{" "}
                        <Button onClick={() => navigate("/register")} variant="text">
                            Regístrate
                        </Button>
                    </Typography>
                </Stack>
            </Paper>
        </Container>
    );
}

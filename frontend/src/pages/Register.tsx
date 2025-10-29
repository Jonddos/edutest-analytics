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

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!form.name || !form.email || !form.password) {
            toast.warning("Completa todos los campos");
            return;
        }

        setLoading(true);
        try {
             await api.post("/auth/register", form);
            toast.success("Registro exitoso 🎉");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err: any) {
            if (err.response?.data?.detail) {
                toast.error(err.response.data.detail);
            } else {
                toast.error("Error al registrar usuario");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container sx={{ mt: 8 }}>
            <Paper sx={{ p: 4, maxWidth: 450, mx: "auto" }}>
                <Typography variant="h4" gutterBottom textAlign="center">
                    Crear cuenta
                </Typography>
                <Stack spacing={3}>
                    <TextField
                        label="Nombre"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                    />
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
                        {loading ? <CircularProgress size={24} /> : "Registrarse"}
                    </Button>
                    <Typography textAlign="center">
                        ¿Ya tienes cuenta?{" "}
                        <Button onClick={() => navigate("/login")} variant="text">
                            Inicia sesión
                        </Button>
                    </Typography>
                </Stack>
            </Paper>
        </Container>
    );
}

import {
    Box,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Button,
} from "@mui/material";
import {
    Home as HomeIcon,
    Quiz as QuizIcon,
    BarChart as BarChartIcon,
    HelpOutline as HelpIcon,
    ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("role");
        navigate("/login", { replace: true });
    };

    return (
        <Box sx={{ p: 4 }}>
            {/* Encabezado */}
            <Paper
                sx={{
                    p: 3,
                    mb: 4,
                    textAlign: "center",
                    backgroundColor: "background.paper",
                    boxShadow: 2,
                }}
            >
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Bienvenido a EduTest Analytics 📊
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Administra evaluaciones, permite a los estudiantes realizar pruebas y
                    analiza el rendimiento académico con reportes automáticos.
                </Typography>
            </Paper>

            {/* Guía de uso */}
            <Paper sx={{ p: 3, boxShadow: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Guía rápida de uso
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    A continuación encontrarás una breve descripción de las principales
                    secciones del sistema para que puedas empezar a usarlo fácilmente.
                </Typography>

                <List>
                    <ListItem>
                        <ListItemIcon>
                            <HomeIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Inicio"
                            secondary="Vista general con información de bienvenida y acceso rápido a las principales funciones."
                        />
                    </ListItem>

                    <ListItem>
                        <ListItemIcon>
                            <QuizIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Evaluaciones"
                            secondary="Crea, edita o elimina evaluaciones. Define el número de preguntas y asigna evaluaciones a los estudiantes."
                        />
                    </ListItem>

                    <ListItem>
                        <ListItemIcon>
                            <BarChartIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Analítica"
                            secondary="Visualiza reportes de desempeño por estudiante, grupo o evaluación. Obtén métricas automáticas generadas por EduTest Analytics."
                        />
                    </ListItem>

                    <ListItem>
                        <ListItemIcon>
                            <HelpIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Soporte"
                            secondary="Consulta la documentación, contacta al equipo técnico o revisa actualizaciones del sistema."
                        />
                    </ListItem>
                </List>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                    Recomendaciones
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    • Mantén tus credenciales seguras. <br />
                    • No compartas evaluaciones sin autorización. <br />
                    • Cierra sesión al terminar tu trabajo. <br />
                    • Revisa la sección de Analítica para identificar áreas de mejora.
                </Typography>

                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<ExitToAppIcon />}
                    onClick={handleLogout}
                >
                    Cerrar sesión
                </Button>
            </Paper>
        </Box>
    );
}

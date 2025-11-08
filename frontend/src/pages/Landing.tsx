import {
    Box,
    Button,
    Container,
    Typography,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Landing() {
    const [open, setOpen] = useState<null | string>(null);

    const handleOpen = (id: string) => setOpen(id);
    const handleClose = () => setOpen(null);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                bgcolor: "background.default",
                color: "text.primary",
            }}
        >
            {/* HEADER */}
            <Box
                component="header"
                sx={{
                    p: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    bgcolor: "primary.main",
                    color: "white",
                }}
            >
                <Typography variant="h6" fontWeight="bold">
                    EduTest Analytics
                </Typography>
                <Box>
                    <Button component={Link} to="/login" color="inherit">
                        Iniciar sesión
                    </Button>
                    <Button component={Link} to="/register" color="inherit">
                        Registrarse
                    </Button>
                </Box>
            </Box>

            {/* HERO */}
            <Container sx={{ textAlign: "center", py: 10 }}>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                    Analiza. Comprende. Mejora.
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                    EduTest Analytics combina la educación con la ingeniería de software
                    para fortalecer la evaluación académica mediante análisis de datos,
                    promoviendo decisiones basadas en evidencia y mejora continua.
                </Typography>

                <Button
                    variant="contained"
                    size="large"
                    component={Link}
                    to="/login"
                    sx={{ mr: 2 }}
                >
                    Iniciar sesión
                </Button>
                <Button
                    variant="outlined"
                    size="large"
                    component={Link}
                    to="/register"
                >
                    Crear cuenta
                </Button>
            </Container>

            {/* SECCIÓN DE CALIDAD */}
            <Box
                sx={{
                    bgcolor: "grey.100",
                    py: 10,
                    mt: 4,
                }}
            >
                <Container>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        textAlign="center"
                        gutterBottom
                    >
                        Enfoque en Calidad de Software 🧩
                    </Typography>
                    <Typography
                        variant="body1"
                        textAlign="center"
                        color="text.secondary"
                        sx={{ mb: 6, maxWidth: 800, mx: "auto" }}
                    >
                        Este proyecto sigue los lineamientos de las{" "}
                        <strong>Normas Internacionales de Calidad de Software</strong>,
                        asegurando un desarrollo estructurado, mantenible y orientado a la
                        mejora continua.
                    </Typography>

                    <Grid container spacing={3}>
                        {/* ISO/IEC 25010 */}
                        <Grid component="div">
                            <Paper
                                sx={{
                                    p: 3,
                                    textAlign: "center",
                                    height: "100%",
                                    borderTop: 4,
                                    borderColor: "primary.main",
                                }}
                                elevation={2}
                            >
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    ISO/IEC 25010
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Modelo de calidad que evalúa atributos como usabilidad,
                                    seguridad, rendimiento y mantenibilidad.
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => handleOpen("25010")}
                                >
                                    Ver más
                                </Button>
                            </Paper>
                        </Grid>

                        {/* ISO/IEC 12207 */}
                        <Grid component="div">
                            <Paper
                                sx={{
                                    p: 3,
                                    textAlign: "center",
                                    height: "100%",
                                    borderTop: 4,
                                    borderColor: "secondary.main",
                                }}
                                elevation={2}
                            >
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    ISO/IEC 12207
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Norma que define los procesos del ciclo de vida del software,
                                    desde la planificación hasta la entrega y mantenimiento.
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => handleOpen("12207")}
                                >
                                    Ver más
                                </Button>
                            </Paper>
                        </Grid>

                        <Grid component="div">
                            <Paper
                                sx={{
                                    p: 3,
                                    textAlign: "center",
                                    height: "100%",
                                    borderTop: 4,
                                    borderColor: "success.main",
                                }}
                                elevation={2}
                            >
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Mejora Continua
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Promueve la integración de métricas, retroalimentación y
                                    optimización de procesos en cada iteración del sistema.
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => handleOpen("mejora")}
                                >
                                    Ver más
                                </Button>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* FOOTER */}
            <Box
                component="footer"
                sx={{
                    p: 2,
                    textAlign: "center",
                    bgcolor: "grey.200",
                    color: "text.secondary",
                    mt: "auto",
                }}
            >
                © {new Date().getFullYear()} EduTest Analytics — Desarrollado por
                Jonathan Ortiz
            </Box>

            {/* === MODALES EXPLICATIVOS === */}

            {/* ISO 25010 */}
            <Dialog open={open === "25010"} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>ISO/IEC 25010 — Modelo de Calidad del Software</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        La norma ISO/IEC 25010 define ocho características clave de calidad
                        del software: funcionalidad, confiabilidad, usabilidad,
                        eficiencia, mantenibilidad, portabilidad, seguridad y compatibilidad.
                        Este modelo se utiliza como referencia para evaluar la calidad de los
                        sistemas desarrollados y orientar las mejoras continuas.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cerrar</Button>
                </DialogActions>
            </Dialog>

            {/* ISO 12207 */}
            <Dialog open={open === "12207"} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>ISO/IEC 12207 — Ciclo de Vida del Software</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        La norma ISO/IEC 12207 establece un marco estructurado para la
                        gestión del ciclo de vida del software, abarcando procesos como
                        adquisición, desarrollo, operación, mantenimiento y retiro.
                        Facilita la trazabilidad y control en todas las etapas del proyecto,
                        asegurando coherencia entre los entregables.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cerrar</Button>
                </DialogActions>
            </Dialog>

            {/* Mejora continua */}
            <Dialog open={open === "mejora"} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Principio de Mejora Continua</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Este principio busca garantizar que el sistema evolucione con base en
                        métricas de desempeño, retroalimentación de usuarios y auditorías
                        internas. En EduTest Analytics, este enfoque impulsa la calidad
                        pedagógica y técnica, asegurando que cada versión supere a la
                        anterior en funcionalidad, accesibilidad y rendimiento.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

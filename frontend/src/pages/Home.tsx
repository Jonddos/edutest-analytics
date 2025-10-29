import {Container, Paper, Typography} from "@mui/material";

export default function Home() {
    return (
        <Container sx={{ mt: 5 }}>
            <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="h4" gutterBottom>
                    Bienvenido a EduTest Analytics 📊
                </Typography>
                <Typography variant="body1">
                    Administra evaluaciones, permite a los estudiantes realizar pruebas y
                    analiza el rendimiento académico con reportes automáticos.
                </Typography>
            </Paper>
        </Container>
    );
}
import { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Stack,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosClient";

interface Evaluation {
    id: number;
    title: string;
    teacher_name: string;
}

export default function EvaluationPage() {
    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const navigate = useNavigate();

    const fetchEvaluations = async () => {
        try {
            const res = await api.get("/evaluations/");
            setEvaluations(res.data);
        } catch (err) {
            console.error("Error al obtener evaluaciones");
        }
    };

    const handleCreate = async () => {
        try {
            await api.post("/evaluations/", { title });
            setOpen(false);
            setTitle("");
            fetchEvaluations();
        } catch (err) {
            alert("Error al crear evaluación (verifica que seas docente)");
        }
    };

    useEffect(() => {
        fetchEvaluations();
    }, []);

    return (
        <Container sx={{ mt: 5 }}>
            <Paper sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5">Mis Evaluaciones</Typography>
                    <Button variant="contained" onClick={() => setOpen(true)}>
                        Nueva evaluación
                    </Button>
                </Stack>

                <Table sx={{ mt: 3 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Título</TableCell>
                            <TableCell>Docente</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {evaluations.map((ev) => (
                            <TableRow key={ev.id} hover>
                                <TableCell>{ev.title}</TableCell>
                                <TableCell>{ev.teacher_name}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate(`/evaluation/${ev.id}/questions`)}
                                    >
                                        Editar preguntas
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        sx={{ ml: 1 }}
                                        onClick={() => navigate(`/analytics?id=${ev.id}`)}
                                    >
                                        Ver analítica
                                    </Button>

                                    <Button
                                        variant="text"
                                        onClick={() =>
                                            navigator.clipboard.writeText(
                                                `${window.location.origin}/take/${ev.id}`
                                            )
                                        }
                                        sx={{ ml: 1 }}
                                    >
                                        Copiar link
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Nueva evaluación</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Título"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleCreate} variant="contained">
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

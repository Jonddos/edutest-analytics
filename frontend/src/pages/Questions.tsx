import { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Paper,
    Button,
    Stack,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Box,
} from "@mui/material";
import { useParams } from "react-router-dom";
import api from "../api/axiosClient";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import NewQuestionDialog from "../components/NewQuestionDialog";

interface Question {
    id: number;
    text: string;
    options: string[];
}

export default function Questions() {
    const { id } = useParams();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [open, setOpen] = useState(false);

    const fetchQuestions = async () => {
        try {
            const res = await api.get(`/evaluations/${id}/questions`);
            setQuestions(res.data);
        } catch {
            toast.error("Error al cargar las preguntas ❌");
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [id]);

    return (
        <Container sx={{ mt: 5 }}>
            <Paper sx={{ p: 3 }}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography variant="h5">Preguntas de la evaluación</Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpen(true)}
                    >
                        Nueva pregunta
                    </Button>
                </Stack>

                <Table sx={{ mt: 2 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Texto</TableCell>
                            <TableCell>Opciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {questions.map((q) => (
                            <TableRow key={q.id}>
                                <TableCell>
                                    <Typography sx={{ whiteSpace: "pre-wrap" }}>{q.text}</Typography>
                                </TableCell>
                                <TableCell>{q.options.join(", ")}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {questions.length === 0 && (
                    <Box mt={3}>
                        <Typography color="text.secondary" align="center">
                            No hay preguntas aún. Usa el botón “Nueva pregunta” para agregar una.
                        </Typography>
                    </Box>
                )}
            </Paper>

            {/* 🔹 Aquí se usa el nuevo componente */}
            <NewQuestionDialog
                open={open}
                onClose={() => setOpen(false)}
                evaluationId={Number(id)}
                onSaved={fetchQuestions}
            />
        </Container>
    );
}

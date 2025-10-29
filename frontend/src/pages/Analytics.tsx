import { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Paper,
    CircularProgress,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import api from "../api/axiosClient";

interface QuestionAccuracy {
    question_id: number;
    text: string;
    accuracy_pct: number;
}

interface StatsResponse {
    total_attempts: number;
    avg_score: number;
    max_score: number;
    min_score: number;
    per_question_accuracy: QuestionAccuracy[];
}

interface Evaluation {
    id: number;
    title: string;
    teacher_name: string;
}

interface Attempt {
    student_name: string;
    score: number;
    correct: number;
    incorrect: number;
    total: number;
}

export default function Analytics() {
    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
    const [selectedEval, setSelectedEval] = useState<string>("");
    const [stats, setStats] = useState<StatsResponse | null>(null);
    const [attempts, setAttempts] = useState<Attempt[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Cargar evaluaciones disponibles
    useEffect(() => {
        api.get("/evaluations/")
            .then((res) => setEvaluations(res.data))
            .catch(() => setError("Error cargando evaluaciones"));
    }, []);

    // Cargar estadísticas
    const fetchStats = async () => {
        if (!selectedEval) return;
        setLoading(true);
        try {
            const [statsRes, attemptsRes] = await Promise.all([
                api.get(`/evaluations/${selectedEval}/stats`),
                api.get(`/evaluations/${selectedEval}/attempts`),
            ]);
            setStats(statsRes.data);
            setAttempts(attemptsRes.data);
            setError("");
        } catch (err) {
            setError("Error al cargar datos de analítica");
            setStats(null);
            setAttempts([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container sx={{ mt: 5 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Panel de Analítica 📈
                </Typography>

                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                    <FormControl sx={{ minWidth: 250 }}>
                        <InputLabel>Seleccione una evaluación</InputLabel>
                        <Select
                            value={selectedEval}
                            label="Seleccione una evaluación"
                            onChange={(e) => setSelectedEval(e.target.value)}
                        >
                            {evaluations.map((ev) => (
                                <MenuItem key={ev.id} value={ev.id}>
                                    {ev.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        onClick={fetchStats}
                        disabled={!selectedEval}
                    >
                        Consultar
                    </Button>
                </Stack>

                {loading && (
                    <Stack alignItems="center" sx={{ mt: 5 }}>
                        <CircularProgress />
                    </Stack>
                )}

                {error && (
                    <Typography color="error" sx={{ mt: 3 }}>
                        {error}
                    </Typography>
                )}

                {stats && !loading && (
                    <>
                        <Paper sx={{ p: 3, mb: 4, textAlign: "center" }}>
                            <Typography variant="h6">Resumen general</Typography>
                            <Typography>Total intentos: {stats.total_attempts}</Typography>
                            <Typography>Promedio: {stats.avg_score.toFixed(2)}</Typography>
                            <Typography>Máximo: {stats.max_score}</Typography>
                            <Typography>Mínimo: {stats.min_score}</Typography>
                        </Paper>

                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Precisión por pregunta (% de aciertos)
                        </Typography>

                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={stats.per_question_accuracy}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="question_id" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="accuracy_pct" fill="#1976d2" name="Aciertos %" />
                            </BarChart>
                        </ResponsiveContainer>

                        <Typography variant="h6" sx={{ mt: 5, mb: 2 }}>
                            Resultados individuales 🧑‍🎓
                        </Typography>

                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Estudiante</TableCell>
                                        <TableCell>Aciertos</TableCell>
                                        <TableCell>Errores</TableCell>
                                        <TableCell>Total</TableCell>
                                        <TableCell>Puntaje</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {attempts.map((a, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{a.student_name}</TableCell>
                                            <TableCell>{a.correct}</TableCell>
                                            <TableCell>{a.incorrect}</TableCell>
                                            <TableCell>{a.total}</TableCell>
                                            <TableCell>{a.score}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}
            </Paper>
        </Container>
    );
}

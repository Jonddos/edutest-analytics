import { useEffect, useState } from "react";
import {
    Container,
    Paper,
    Typography,
    FormControlLabel,
    Radio,
    Button,
    Stack,
    TextField,
    Alert,
    CircularProgress,
    IconButton,
    Drawer,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
    Checkbox,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useParams } from "react-router-dom";
import api from "../api/axiosClient";

interface Question {
    id: number;
    text: string;
    options: string[];
    multiple: boolean;
}

interface AttemptResult {
    attempt_id: number;
    student_name: string;
    score: number;
    total_questions: number;
}

const ISO_TOPICS = [
    {
        title: "📘 ¿Qué es la calidad del software?",
        body:
            "Es el grado en que un sistema cumple requisitos y satisface necesidades del usuario. " +
            "Incluye confiabilidad, eficiencia, seguridad y mantenibilidad.",
    },
    {
        title: "📏 ISO 9001 (Gestión de la calidad)",
        body:
            "Norma para sistemas de gestión de calidad. Promueve procesos definidos, control de cambios y mejora continua.",
    },
    {
        title: "💻 ISO/IEC 25010 (Modelo de calidad)",
        body:
            "Ocho características: funcionalidad, rendimiento, compatibilidad, usabilidad, fiabilidad, seguridad, " +
            "mantenibilidad y portabilidad. Úsalo como checklist al diseñar y evaluar.",
    },
    {
        title: "🧱 CMMI (Madurez de procesos)",
        body:
            "Marco para mejorar procesos de desarrollo. Enfatiza medición, evidencia y mejora continua.",
    },
    {
        title: "🔍 Verificación vs Validación",
        body:
            "Verificación: ¿construimos el producto bien? Validación: ¿construimos el producto correcto?",
    },
    {
        title: "🧩 Pruebas y control de calidad",
        body:
            "Incluye pruebas unitarias, de integración, revisión de código y auditorías para prevenir defectos.",
    },
    {
        title: "📊 Mejora continua (PDCA / Kaizen)",
        body:
            "Iterar: Planear, Hacer, Verificar, Actuar. Cambios pequeños y constantes que elevan la calidad.",
    },
];

export default function TakeEvaluation() {
    const { id } = useParams();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<number[][]>([]);
    const [loading, setLoading] = useState(true);
    const [studentName, setStudentName] = useState("");
    const [started, setStarted] = useState(false);
    const [result, setResult] = useState<AttemptResult | null>(null);
    const [error, setError] = useState("");
    const [guideOpen, setGuideOpen] = useState(false);

    // 1️⃣ Cargar preguntas
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await api.get(`/evaluations/${id}/questions`);
                setQuestions(res.data);

                // Inicializa respuestas vacías: [[]] para múltiple, [-1] para única
                const initial = res.data.map((q: Question) =>
                    q.multiple ? [] : [-1]
                );
                setAnswers(initial);
            } catch (err) {
                setError("Error al cargar preguntas");
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [id]);

    // 2️⃣ Cambiar respuesta
    const handleSelect = (qIndex: number, optionIndex: number) => {
        const q = questions[qIndex];
        const newAnswers = [...answers];

        if (q.multiple) {
            // Múltiple: marcar/desmarcar
            if (newAnswers[qIndex].includes(optionIndex)) {
                newAnswers[qIndex] = newAnswers[qIndex].filter((i) => i !== optionIndex);
            } else {
                newAnswers[qIndex] = [...newAnswers[qIndex], optionIndex];
            }
        } else {
            // Única: reemplazar
            newAnswers[qIndex] = [optionIndex];
        }
        setAnswers(newAnswers);
    };

    // 3️⃣ Enviar intento
    const handleSubmit = async () => {
        try {
            const res = await api.post(`/evaluations/${id}/submit`, {
                student_name: studentName || "Estudiante",
                answers,
            });
            setResult(res.data);
        } catch (err) {
            setError("Error al enviar la evaluación");
        }
    };

    if (loading) {
        return (
            <Container sx={{ mt: 10, textAlign: "center" }}>
                <CircularProgress />
            </Container>
        );
    }

    if (!started) {
        return (
            <Container sx={{ mt: 8 }}>
                <Paper sx={{ p: 4, textAlign: "center" }}>
                    <Typography variant="h5" gutterBottom>
                        Ingresa tu nombre para iniciar la evaluación
                    </Typography>
                    <TextField
                        label="Tu nombre"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        fullWidth
                        sx={{ mt: 2 }}
                    />
                    <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                        <Button
                            variant="contained"
                            disabled={!studentName.trim()}
                            onClick={() => setStarted(true)}
                        >
                            Comenzar
                        </Button>
                        <Button
                            startIcon={<MenuBookIcon />}
                            variant="outlined"
                            onClick={() => setGuideOpen(true)}
                        >
                            Ver guía ISO
                        </Button>
                    </Stack>
                </Paper>

                <Drawer anchor="right" open={guideOpen} onClose={() => setGuideOpen(false)}>
                    <div style={{ width: 420, padding: 16 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">Guía rápida de normas ISO y calidad</Typography>
                            <IconButton onClick={() => setGuideOpen(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Stack>
                        <Divider sx={{ my: 2 }} />
                        {ISO_TOPICS.map((t, i) => (
                            <Accordion key={i} sx={{ mb: 1 }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography fontWeight={600}>{t.title}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                                        {t.body}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </div>
                </Drawer>
            </Container>
        );
    }

    if (result) {
        return (
            <Container sx={{ mt: 5 }}>
                <Paper sx={{ p: 4, textAlign: "center" }}>
                    <Typography variant="h4" gutterBottom>
                        ¡Evaluación completada! ✅
                    </Typography>
                    <Typography variant="h6">Estudiante: {result.student_name}</Typography>
                    <Typography variant="h5" sx={{ mt: 2 }}>
                        Puntaje: {result.score} / {result.total_questions}
                    </Typography>
                    <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                        <Button href={`/take/${id}`} variant="outlined">
                            Reintentar
                        </Button>
                        <Button
                            startIcon={<MenuBookIcon />}
                            variant="contained"
                            onClick={() => setGuideOpen(true)}
                        >
                            Repasar guía ISO
                        </Button>
                    </Stack>
                </Paper>
            </Container>
        );
    }

    // 4️⃣ Vista principal de preguntas
    return (
        <Container sx={{ mt: 5 }}>
            <Paper sx={{ p: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4">Evaluación #{id}</Typography>
                    <Button
                        startIcon={<MenuBookIcon />}
                        variant="outlined"
                        onClick={() => setGuideOpen(true)}
                    >
                        Abrir guía ISO
                    </Button>
                </Stack>

                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

                <Stack spacing={4} sx={{ mt: 3 }}>
                    {questions.map((q, qi) => (
                        <Paper key={q.id} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                {qi + 1}. {q.text}
                            </Typography>

                            {q.multiple ? (
                                q.options.map((opt, oi) => (
                                    <FormControlLabel
                                        key={oi}
                                        control={
                                            <Checkbox
                                                checked={answers[qi].includes(oi)}
                                                onChange={() => handleSelect(qi, oi)}
                                            />
                                        }
                                        label={opt}
                                    />
                                ))
                            ) : (
                                q.options.map((opt, oi) => (
                                    <FormControlLabel
                                        key={oi}
                                        control={
                                            <Radio
                                                checked={answers[qi][0] === oi}
                                                onChange={() => handleSelect(qi, oi)}
                                            />
                                        }
                                        label={opt}
                                    />
                                ))
                            )}
                        </Paper>
                    ))}
                </Stack>

                <Stack direction="row" justifyContent="center" sx={{ mt: 4 }} spacing={2}>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleSubmit}
                        disabled={answers.some((a) => a.length === 0 || a.includes(-1))}
                    >
                        Enviar evaluación
                    </Button>
                </Stack>
            </Paper>
        </Container>
    );
}

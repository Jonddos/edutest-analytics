import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    IconButton,
    Checkbox,
    FormControlLabel,
    Stack,
    Typography,
    Radio,
    RadioGroup,
    FormGroup,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useState } from "react";
import api from "../api/axiosClient";
import { toast } from "react-toastify";

interface Props {
    open: boolean;
    onClose: () => void;
    evaluationId: number;
    onSaved?: () => void;
}

export default function NewQuestionDialog({
                                              open,
                                              onClose,
                                              evaluationId,
                                              onSaved,
                                          }: Props) {
    const [text, setText] = useState("");
    const [options, setOptions] = useState<string[]>([""]);
    const [correctIndexes, setCorrectIndexes] = useState<number[]>([]);
    const [multipleChoice, setMultipleChoice] = useState(true);
    const [saving, setSaving] = useState(false);

    // === Funciones de formulario ===
    const addOption = () => setOptions([...options, ""]);
    const removeOption = (index: number) => {
        setOptions(options.filter((_, i) => i !== index));
        setCorrectIndexes(correctIndexes.filter((i) => i !== index));
    };
    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const toggleCorrect = (index: number) => {
        if (multipleChoice) {
            // Selección múltiple
            if (correctIndexes.includes(index)) {
                setCorrectIndexes(correctIndexes.filter((i) => i !== index));
            } else {
                setCorrectIndexes([...correctIndexes, index]);
            }
        } else {
            // Opción única
            setCorrectIndexes([index]);
        }
    };

    const handleSave = async () => {
        if (!text.trim()) {
            toast.warning("Debes escribir una pregunta");
            return;
        }
        if (options.some((o) => !o.trim())) {
            toast.warning("Completa todas las opciones");
            return;
        }
        if (correctIndexes.length === 0) {
            toast.warning("Selecciona al menos una respuesta correcta");
            return;
        }

        setSaving(true);
        try {
            await api.post(`/evaluations/${evaluationId}/questions`, {
                text,
                options,
                correct_index: correctIndexes, // ✅ envía un array de números
                multiple: multipleChoice,
            });
            toast.success("Pregunta guardada ✅");
            onSaved?.();
            onClose();
            setText("");
            setOptions([""]);
            setCorrectIndexes([]);
        } catch (err: any) {
            toast.error("Error al guardar la pregunta");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Nueva pregunta</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="Texto de la pregunta"
                        multiline
                        rows={3}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        fullWidth
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={multipleChoice}
                                onChange={(e) => setMultipleChoice(e.target.checked)}
                            />
                        }
                        label="Permitir múltiples respuestas correctas"
                    />

                    <Typography variant="subtitle1">Opciones</Typography>

                    {options.map((opt, index) => (
                        <Stack
                            key={index}
                            direction="row"
                            spacing={1}
                            alignItems="center"
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={correctIndexes.includes(index)}
                                        onChange={() => toggleCorrect(index)}
                                    />
                                }
                                label=""
                            />
                            <TextField
                                fullWidth
                                value={opt}
                                label={`Opción ${index + 1}`}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                            />
                            <IconButton
                                color="error"
                                onClick={() => removeOption(index)}
                                disabled={options.length <= 1}
                            >
                                <Delete />
                            </IconButton>
                        </Stack>
                    ))}

                    <Button startIcon={<Add />} onClick={addOption}>
                        Agregar opción
                    </Button>

                    {/* === Vista previa dinámica === */}
                    {text.trim() && (
                        <Stack sx={{ mt: 3, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
                            <Typography variant="h6">Vista previa 🧩</Typography>
                            <Typography sx={{ mb: 1 }}>{text}</Typography>

                            {multipleChoice ? (
                                <FormGroup>
                                    {options.map((opt, i) => (
                                        <FormControlLabel
                                            key={i}
                                            control={<Checkbox />}
                                            label={opt || `Opción ${i + 1}`}
                                        />
                                    ))}
                                </FormGroup>
                            ) : (
                                <RadioGroup>
                                    {options.map((opt, i) => (
                                        <FormControlLabel
                                            key={i}
                                            control={<Radio />}
                                            label={opt || `Opción ${i + 1}`}
                                        />
                                    ))}
                                </RadioGroup>
                            )}
                        </Stack>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? "Guardando..." : "Guardar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

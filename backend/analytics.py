from sqlalchemy.orm import Session
from models import Evaluation, Question, Attempt, AttemptAnswer
from sqlalchemy import func
import pandas as pd


def generar_analitica(evaluation_id: int, db: Session):
    ev = db.query(Evaluation).get(evaluation_id)
    if not ev:
        return {"error": "Evaluación no encontrada"}

    # === obtener preguntas ===
    qs = db.query(Question).filter(Question.evaluation_id == evaluation_id).all()
    if not qs:
        return {"error": "No hay preguntas registradas"}

    # === obtener intentos y respuestas ===
    attempts = db.query(Attempt).filter(Attempt.evaluation_id == evaluation_id).all()
    answers = db.query(AttemptAnswer).join(Attempt).filter(Attempt.evaluation_id == evaluation_id).all()

    if not attempts or not answers:
        return {"error": "No hay datos suficientes para análisis"}

    # Convertir a DataFrames para pandas
    df_attempts = pd.DataFrame([{
        "attempt_id": a.id,
        "student_name": a.student_name,
        "score": a.score
    } for a in attempts])

    df_answers = pd.DataFrame([{
        "attempt_id": ans.attempt_id,
        "question_id": ans.question_id,
        "selected_index": ans.selected_index
    } for ans in answers])

    df_questions = pd.DataFrame([{
        "question_id": q.id,
        "text": q.text,
        "options": q.options_joined.split("||"),
        "correct_index": q.correct_index
    } for q in qs])

    # === Normalizar correct_index ===
    def normalize_correct(x):
        if isinstance(x, str):
            return [int(i) for i in x.split(",") if i.strip().isdigit()]
        elif isinstance(x, list):
            # Aplana si es [[1,2]]
            flat = []
            for e in x:
                if isinstance(e, list):
                    flat.extend(e)
                else:
                    flat.append(int(e))
            return flat
        elif x is None:
            return []
        else:
            return [int(x)]

    df_questions["correct_index"] = df_questions["correct_index"].apply(normalize_correct)

    # === Calcular precisión por pregunta ===
    per_question_stats = []
    for _, qrow in df_questions.iterrows():
        qid = qrow["question_id"]
        correct_indices = set(qrow["correct_index"])

        # Respuestas asociadas a esa pregunta
        df_q = df_answers[df_answers["question_id"] == qid]

        total_respuestas = len(df_q["attempt_id"].unique())
        if total_respuestas == 0:
            accuracy = 0.0
        else:
            # Agrupar las respuestas por intento (para comparar conjunto completo)
            correctas = 0
            for attempt_id, group in df_q.groupby("attempt_id"):
                seleccionadas = set(group["selected_index"].tolist())
                if seleccionadas == correct_indices:
                    correctas += 1
            accuracy = round((correctas / total_respuestas) * 100, 2)

        per_question_stats.append({
            "question_id": qid,
            "text": qrow["text"],
            "accuracy_pct": accuracy
        })

    # === estadísticas generales ===
    total_attempts = len(df_attempts)
    avg_score = float(df_attempts["score"].mean()) if total_attempts > 0 else 0.0
    max_score = int(df_attempts["score"].max()) if total_attempts > 0 else 0
    min_score = int(df_attempts["score"].min()) if total_attempts > 0 else 0

    return {
        "evaluation_title": ev.title,
        "teacher_name": ev.teacher_name,
        "total_attempts": total_attempts,
        "avg_score": round(avg_score, 2),
        "max_score": max_score,
        "min_score": min_score,
        "per_question_accuracy": per_question_stats
    }

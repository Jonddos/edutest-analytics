from fastapi import FastAPI, Depends, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import Base, engine, get_db
from auth import router as auth_router, get_current_user
from models import User, Evaluation, Question, Attempt, AttemptAnswer
from analytics import generar_analitica

# === CREACIÓN DE LA APP ===
app = FastAPI(title="EduTest Analytics API")

# === CORS ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.options("/{rest_of_path:path}")
async def preflight_handler(request: Request):
    return {}

# === BASE DE DATOS ===
Base.metadata.create_all(bind=engine)

# === ROUTERS ===
app.include_router(auth_router)

# ================================
#       MODELOS Pydantic
# ================================

class UserCreate(BaseModel):
    name: str
    email: EmailStr

class EvaluationCreate(BaseModel):
    title: str

class QuestionCreate(BaseModel):
    text: str
    options: List[str]
    correct_index: List[int]   # ✅ lista de respuestas correctas
    multiple: bool = False

class AttemptSubmit(BaseModel):
    student_name: str
    answers: List[List[int]]   # ✅ soporta múltiples selecciones por pregunta


# ================================
#            RUTAS
# ================================

@app.get("/")
def root():
    return {"message": "EduTest Analytics API with JWT 🔐"}

# Crear usuario
@app.post("/users/")
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    exists = db.query(User).filter(User.email == payload.email).first()
    if exists:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    u = User(name=payload.name, email=payload.email)
    db.add(u)
    db.commit()
    db.refresh(u)
    return {"id": u.id, "name": u.name, "email": u.email}


# Crear evaluación
@app.post("/evaluations/")
def create_evaluation(
    payload: EvaluationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ev = Evaluation(title=payload.title, teacher_name=current_user.name)
    db.add(ev)
    db.commit()
    db.refresh(ev)
    return {"id": ev.id, "title": ev.title, "teacher_name": ev.teacher_name}


# Agregar pregunta a una evaluación
@app.post("/evaluations/{evaluation_id}/questions")
def add_question(
    evaluation_id: int,
    payload: QuestionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ev = db.query(Evaluation).get(evaluation_id)
    if not ev:
        raise HTTPException(status_code=404, detail="Evaluación no encontrada")

    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Solo docentes pueden agregar preguntas")

    if any(i >= len(payload.options) or i < 0 for i in payload.correct_index):
        raise HTTPException(status_code=400, detail="Índice de respuesta correcta fuera de rango")

    q = Question(
        evaluation_id=ev.id,
        text=payload.text,
        options_joined="||".join(payload.options),
        correct_index=payload.correct_index,  # ✅ lista JSON
        multiple=payload.multiple,
    )
    db.add(q)
    db.commit()
    db.refresh(q)
    return {
        "id": q.id,
        "text": q.text,
        "options": q.options(),
        "correct_index": q.correct_index,
        "multiple": q.multiple,
    }


# Listar preguntas de una evaluación
@app.get("/evaluations/{evaluation_id}/questions")
def list_questions(evaluation_id: int, db: Session = Depends(get_db)):
    ev = db.query(Evaluation).get(evaluation_id)
    if not ev:
        raise HTTPException(status_code=404, detail="Evaluación no encontrada")

    qs = db.query(Question).filter(Question.evaluation_id == evaluation_id).all()
    return [
        {
            "id": q.id,
            "text": q.text,
            "options": q.options(),
            "correct_index": q.correct_index,
            "multiple": q.multiple,
        }
        for q in qs
    ]


# Enviar intento de estudiante
@app.post("/evaluations/{evaluation_id}/submit")
def submit_attempt(evaluation_id: int, payload: AttemptSubmit, db: Session = Depends(get_db)):
    qs = db.query(Question).filter(Question.evaluation_id == evaluation_id).order_by(Question.id).all()
    if not qs:
        raise HTTPException(status_code=400, detail="La evaluación no tiene preguntas")
    if len(payload.answers) != len(qs):
        raise HTTPException(status_code=400, detail="Cantidad de respuestas no coincide con preguntas")

    score = 0
    attempt = Attempt(evaluation_id=evaluation_id, student_name=payload.student_name, score=0)
    db.add(attempt)
    db.flush()  # obtener el ID del intento

    for q, selected_list in zip(qs, payload.answers):
        # Normaliza la lista de respuestas seleccionadas
        if not isinstance(selected_list, list):
            selected_list = [selected_list]

        # Guarda todas las respuestas seleccionadas
        for sel in selected_list:
            ans = AttemptAnswer(
                attempt_id=attempt.id,
                question_id=q.id,
                selected_index=int(sel)
            )
            db.add(ans)

        # --- Normaliza el campo correct_index ---
        correct_raw = q.correct_index

        # Caso 1: viene como string tipo "1,2"
        if isinstance(correct_raw, str):
            correct_indices = [int(x) for x in correct_raw.split(",") if x.strip().isdigit()]

        # Caso 2: ya es lista de ints o lista dentro de lista
        elif isinstance(correct_raw, list):
            # Aplana si es [[1,2]]
            correct_indices = []
            for c in correct_raw:
                if isinstance(c, list):
                    correct_indices.extend(c)
                else:
                    correct_indices.append(int(c))

        # Caso 3: número simple
        else:
            correct_indices = [int(correct_raw)]

        # --- Comparación flexible ---
        if set(map(int, selected_list)) == set(correct_indices):
            score += 1

    attempt.score = score
    db.commit()
    db.refresh(attempt)

    return {
        "attempt_id": attempt.id,
        "student_name": attempt.student_name,
        "score": score,
        "total_questions": len(qs)
    }


# Analítica simple
@app.get("/evaluations/{evaluation_id}/stats")
def evaluation_stats(evaluation_id: int, db: Session = Depends(get_db)):
    ev = db.query(Evaluation).get(evaluation_id)
    if not ev:
        raise HTTPException(status_code=404, detail="Evaluación no encontrada")

    total_attempts = db.query(Attempt).filter(Attempt.evaluation_id == evaluation_id).count()
    if total_attempts == 0:
        return {
            "total_attempts": 0,
            "avg_score": 0,
            "max_score": 0,
            "min_score": 0,
            "per_question_accuracy": []
        }

    # === Cálculos globales ===
    avg_score = db.query(func.avg(Attempt.score)).filter(Attempt.evaluation_id == evaluation_id).scalar() or 0
    max_score = db.query(func.max(Attempt.score)).filter(Attempt.evaluation_id == evaluation_id).scalar() or 0
    min_score = db.query(func.min(Attempt.score)).filter(Attempt.evaluation_id == evaluation_id).scalar() or 0

    # === Calcular precisión por pregunta ===
    qs = db.query(Question).filter(Question.evaluation_id == evaluation_id).all()
    per_question_accuracy = []

    for q in qs:
        answers = (
            db.query(AttemptAnswer)
            .join(Attempt)
            .filter(Attempt.evaluation_id == evaluation_id, AttemptAnswer.question_id == q.id)
            .all()
        )

        total_respondieron = len(set(a.attempt_id for a in answers))
        if total_respondieron == 0:
            accuracy_pct = 0.0
        else:
            correct_count = 0

            # Normaliza el campo correct_index
            correct_raw = q.correct_index
            if isinstance(correct_raw, str):
                correct_indices = [int(x) for x in correct_raw.split(",") if x.strip().isdigit()]
            elif isinstance(correct_raw, list):
                correct_indices = []
                for c in correct_raw:
                    if isinstance(c, list):
                        correct_indices.extend(c)
                    else:
                        correct_indices.append(int(c))
            else:
                correct_indices = [int(correct_raw)]

            # Agrupa respuestas por intento
            attempts_dict = {}
            for ans in answers:
                attempts_dict.setdefault(ans.attempt_id, []).append(ans.selected_index)

            # Calcula precisión
            for selected_list in attempts_dict.values():
                if set(selected_list) == set(correct_indices):
                    correct_count += 1

            accuracy_pct = round((correct_count / total_respondieron) * 100, 2)

        per_question_accuracy.append({
            "question_id": q.id,
            "text": q.text,
            "accuracy_pct": accuracy_pct
        })

    return {
        "total_attempts": total_attempts,
        "avg_score": round(float(avg_score), 2),
        "max_score": int(max_score),
        "min_score": int(min_score),
        "per_question_accuracy": per_question_accuracy
    }


@app.get("/evaluations/")
def list_evaluations(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Solo docentes pueden listar evaluaciones")
    evaluations = db.query(Evaluation).filter(Evaluation.teacher_name == current_user.name).all()
    return [{"id": ev.id, "title": ev.title, "teacher_name": ev.teacher_name} for ev in evaluations]

# Listar intentos de estudiantes con detalles
@app.get("/evaluations/{evaluation_id}/attempts")
def list_attempts(evaluation_id: int, db: Session = Depends(get_db)):
    attempts = (
        db.query(Attempt)
        .filter(Attempt.evaluation_id == evaluation_id)
        .order_by(Attempt.id.desc())
        .all()
    )
    if not attempts:
        return []

    data = []
    for a in attempts:
        # Obtener respuestas de ese intento
        answers = db.query(AttemptAnswer).filter(AttemptAnswer.attempt_id == a.id).all()

        correct = 0
        incorrect = 0
        total = len(set(ans.question_id for ans in answers))

        for qid in set(ans.question_id for ans in answers):
            question = db.query(Question).get(qid)
            selected = [ans.selected_index for ans in answers if ans.question_id == qid]

            # Normalizar correct_index igual que en submit_attempt
            correct_raw = question.correct_index
            if isinstance(correct_raw, str):
                correct_indices = [int(x) for x in correct_raw.split(",") if x.strip().isdigit()]
            elif isinstance(correct_raw, list):
                correct_indices = []
                for c in correct_raw:
                    if isinstance(c, list):
                        correct_indices.extend(c)
                    else:
                        correct_indices.append(int(c))
            else:
                correct_indices = [int(correct_raw)]

            if set(selected) == set(correct_indices):
                correct += 1
            else:
                incorrect += 1

        data.append({
            "student_name": a.student_name,
            "score": a.score,
            "correct": correct,
            "incorrect": incorrect,
            "total": total
        })

    return data
from sqlalchemy import Column, Integer, String, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy.dialects.postgresql import JSON

# Usuario (docente o estudiante)
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)  # ✅ cambiar a este nombre
    role = Column(String, default="teacher")          # 👈 por defecto docente
    is_active = Column(Boolean, default=True)

# Evaluación (examen)
class Evaluation(Base):
    __tablename__ = "evaluations"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    teacher_name = Column(String(120), nullable=False)

    questions = relationship("Question", back_populates="evaluation", cascade="all, delete-orphan")
    attempts = relationship("Attempt", back_populates="evaluation", cascade="all, delete-orphan")

# Pregunta de opción múltiple
class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True)
    evaluation_id = Column(Integer, ForeignKey("evaluations.id"))
    text = Column(String, nullable=False)
    options_joined = Column(String, nullable=False)
    correct_index = Column(JSON, nullable=False)  # Guarda lista [1, 3]
    multiple = Column(Boolean, default=False)

    evaluation = relationship("Evaluation", back_populates="questions")

    def options(self):
        return self.options_joined.split("||")

# Intento (envío de respuestas)
class Attempt(Base):
    __tablename__ = "attempts"
    id = Column(Integer, primary_key=True, index=True)
    evaluation_id = Column(Integer, ForeignKey("evaluations.id", ondelete="CASCADE"), nullable=False)
    student_name = Column(String(120), nullable=False)
    score = Column(Integer, nullable=False)  # número de aciertos

    evaluation = relationship("Evaluation", back_populates="attempts")
    answers = relationship("AttemptAnswer", back_populates="attempt", cascade="all, delete-orphan")

# Respuesta por pregunta dentro de un intento
class AttemptAnswer(Base):
    __tablename__ = "attempt_answers"
    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("attempts.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    selected_index = Column(Integer, nullable=False)  # índice que eligió el estudiante

    attempt = relationship("Attempt", back_populates="answers")

# 🧩 EduTest Analytics – Backend (FastAPI)

**Autor:** Jonathan Ortiz Ruiz  
**Deploy:** [https://edutest-backend-q6nh.onrender.com](https://edutest-backend-q6nh.onrender.com)

---

## 📘 Descripción

El backend de **EduTest Analytics** proporciona la lógica central del sistema: autenticación segura, gestión de evaluaciones, almacenamiento de resultados y generación de estadísticas analíticas.  
Está desarrollado con **FastAPI** y sigue normas internacionales de **calidad de software (ISO/IEC 25010 y 12207)** para garantizar confiabilidad, mantenibilidad y seguridad.

---

## ⚙️ Tecnologías Principales

| Componente | Tecnología |
|-------------|-------------|
| Framework | FastAPI |
| ORM | SQLAlchemy |
| Base de Datos | PostgreSQL |
| Autenticación | JWT (JSON Web Tokens) |
| Despliegue | Render.com |
| Entorno | Python 3.11+ |

---

## 📂 Estructura del Proyecto

```
backend/
│── main.py                 # Punto de entrada de la API
│── auth.py                 # Módulo de autenticación
│── models.py               # Definición de modelos SQLAlchemy
│── database.py             # Configuración de conexión a PostgreSQL
│── analytics.py            # Generación de reportes y estadísticas
│── utils.py                # Funciones auxiliares (hash, JWT)
│── requirements.txt        # Dependencias del backend
└── venv/                   # Entorno virtual (no subir a GitHub)
```

---

## 🚀 Ejecución Local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Jonddos/edutest-analytics.git
   cd backend
   ```

2. Crea un entorno virtual e instala dependencias:
   ```bash
   python -m venv venv
   source venv/bin/activate     # (Linux/Mac)
   venv\Scripts\activate        # (Windows)
   pip install -r requirements.txt
   ```

3. Configura tus variables de entorno:
   ```bash
   export DB_USER=admin
   export DB_PASS=admin
   export DB_HOST=localhost
   export DB_PORT=5432
   export DB_NAME=edutest
   export SECRET_KEY="supersecretkey"
   ```

4. Ejecuta el servidor:
   ```bash
   uvicorn main:app --reload
   ```

5. Abre la documentación interactiva:
   👉 [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 🧠 Endpoints Principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/auth/register` | Registrar nuevo usuario |
| `POST` | `/auth/login` | Iniciar sesión y obtener token |
| `POST` | `/evaluations/` | Crear evaluación (docente) |
| `POST` | `/evaluations/{id}/questions` | Agregar preguntas |
| `POST` | `/evaluations/{id}/submit` | Enviar intento de estudiante |
| `GET`  | `/evaluations/{id}/stats` | Obtener analítica de resultados |

---

## 🧾 Licencia

MIT © 2025 — Jonathan Ortiz Ruiz

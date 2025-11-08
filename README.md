# 🎓 EduTest Analytics

> **EduTest Analytics** es una plataforma web educativa desarrollada con **React + TypeScript + Vite** que combina la educación con la ingeniería de software para **fortalecer la evaluación académica mediante el análisis de datos**, fomentando decisiones basadas en evidencia y mejora continua.

---

## 🚀 Características principales

- 📊 **Analítica educativa:** reportes automáticos sobre rendimiento académico.
- 🧩 **Cumplimiento de normas ISO/IEC 25010 y 12207** (calidad de software).
- 👨‍🏫 **Gestión de evaluaciones:** creación, edición y seguimiento.
- 👩‍🎓 **Ejecución de pruebas:** interfaz amigable para estudiantes.
- 🔐 **Autenticación y rutas protegidas** (roles docentes y usuarios).
- 🌙 **Modo oscuro y claro** con soporte de Material UI Theme.
- 🧠 **Arquitectura escalable** y separación de capas (frontend/backend).

---

## 🏗️ Tecnologías utilizadas

| Categoría | Tecnologías |
|------------|--------------|
| **Frontend** | React + TypeScript + Vite |
| **UI Framework** | Material UI (MUI v5) |
| **Gestión de estado y hooks** | React Hooks (useState, useEffect, useNavigate) |
| **Ruteo** | React Router DOM v6 |
| **Notificaciones** | React Toastify |
| **HTTP Client** | Axios |
| **Backend** | Node.js + Express + JWT (ver carpeta `/backend` o enlace del API) |
| **Despliegue** | Render.com |

---

## 📁 Estructura del proyecto

```
edutest-analytics/
├── backend/                 # API REST (Node.js / Express)
├── frontend/                # Aplicación web (React + Vite)
│   ├── src/
│   │   ├── api/             # Axios client y peticiones HTTP
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/           # Vistas principales (Login, Home, etc.)
│   │   ├── hooks/           # Hooks personalizados (useAuth)
│   │   ├── App.tsx          # Configuración principal de rutas
│   │   └── main.tsx         # Punto de entrada de React
│   ├── public/              # Archivos estáticos (favicon, logos)
│   └── vite.config.ts       # Configuración del bundler
└── README.md                # Este documento
```

---

## ⚙️ Instalación y configuración

### 🔹 1. Clonar el repositorio
```bash
git clone https://github.com/tuusuario/edutest-analytics.git
cd edutest-analytics
```

### 🔹 2. Instalar dependencias del frontend
```bash
cd frontend
npm install
```

### 🔹 3. Configurar variables de entorno
Crea un archivo `.env` en `/frontend` con tus credenciales del backend:

```env
VITE_API_BASE_URL=https://edutest-backend-q6nh.onrender.com
```

*(Ajusta la URL si tu backend corre localmente o en otro entorno).*

---

## 🔐 Autenticación y seguridad

El sistema usa **JWT (JSON Web Token)**.  
El token se guarda en `localStorage` al iniciar sesión.

```js
// Ejemplo
localStorage.setItem("authToken", token);
```

- `ProtectedRoute` bloquea el acceso a rutas internas sin token.
- `PublicRoute` redirige a `/home` si el usuario ya está autenticado.
- Los roles (`teacher` o `student`) se almacenan también en `localStorage`.

---

## 🧭 Flujo de navegación

| Ruta | Descripción | Tipo |
|------|--------------|------|
| `/` | Landing Page | Pública |
| `/login` | Inicio de sesión | Pública |
| `/register` | Registro de usuario | Pública |
| `/home` | Dashboard principal | Protegida |
| `/evaluation` | Gestión de evaluaciones | Protegida |
| `/analytics` | Panel de analítica | Protegida |
| `/take/:id` | Realización de pruebas | Pública para estudiantes |

---

## 🧩 Normas de calidad de software aplicadas

Este proyecto sigue los principios de las normas internacionales:

- **ISO/IEC 25010:** Calidad del producto de software (usabilidad, seguridad, rendimiento, mantenibilidad).
- **ISO/IEC 12207:** Procesos del ciclo de vida del software (planificación, desarrollo, mantenimiento y retiro).
- **Buenas prácticas DevOps:** modularidad, control de versiones, CI/CD y despliegue automatizado.

---

## 🧠 Cómo usar EduTest Analytics

1. **Inicia sesión** con tus credenciales (o regístrate si no tienes cuenta).
2. Serás redirigido automáticamente a `/home`.
3. En el panel lateral:
   - **Inicio:** muestra una guía rápida y acceso a recursos.
   - **Evaluaciones:** administra pruebas académicas.
   - **Analítica:** visualiza reportes automáticos de rendimiento.
4. Puedes **cerrar sesión** desde el encabezado.

---

## 🧪 Scripts disponibles

### 🚀 Ejecutar en modo desarrollo
```bash
npm run dev
```

### 🏗️ Compilar para producción
```bash
npm run build
```

### 🔎 Previsualizar build
```bash
npm run preview
```

---

## ☁️ Despliegue en Render

El proyecto está actualmente desplegado en:

- 🌐 **Frontend:** [https://edutest-front.onrender.com](https://edutest-front.onrender.com)  
- ⚙️ **Backend:** [https://edutest-backend-q6nh.onrender.com](https://edutest-backend-q6nh.onrender.com)

---

## 👨‍💻 Autor

**Jonathan Ortiz Ruiz**  
Desarrollador Full Stack • ADSI – SENA  
📧 [jonddos.dev@gmail.com](mailto:jonddos.dev@gmail.com)  
💼 [LinkedIn](https://linkedin.com/in/jonddos) • [GitHub](https://github.com/jonddos)

---

## 🧾 Licencia

Este proyecto se distribuye bajo la licencia **MIT**, lo que permite su uso, modificación y distribución con fines académicos o profesionales citando la fuente.

---

> _“EduTest Analytics — Una herramienta educativa impulsada por datos y calidad de software.”_

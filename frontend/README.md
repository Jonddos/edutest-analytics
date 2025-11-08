# 🎓 EduTest Analytics – Frontend (React + Material UI)

**Autor:** Jonathan Ortiz Ruiz  
**Deploy:** [https://edutest-front.onrender.com](https://edutest-front.onrender.com)

---

## 📘 Descripción

Interfaz web para la plataforma **EduTest Analytics**, enfocada en la gestión de evaluaciones académicas, registro de estudiantes, aplicación de pruebas y visualización de métricas de rendimiento.  
Desarrollado con **React**, **Vite** y **Material UI**, el proyecto aplica principios de usabilidad y accesibilidad basados en la norma **ISO/IEC 25010**.

---

## ⚙️ Tecnologías Principales

| Componente | Tecnología |
|-------------|-------------|
| Framework | React 18 + Vite |
| UI Library | Material UI (MUI) |
| Estado Global | React Hooks |
| Enrutamiento | React Router DOM |
| Cliente API | Axios |
| Estilo | Tailwind + MUI |
| Despliegue | Render.com |

---

## 📂 Estructura del Proyecto

```
frontend/
│── src/
│   ├── api/axiosClient.ts       # Configuración de Axios
│   ├── components/              # Componentes reutilizables (Navbar, Layouts)
│   ├── pages/                   # Páginas principales (Login, Home, Analytics)
│   ├── hooks/                   # Hooks personalizados
│   └── main.tsx                 # Punto de entrada
│── public/
│── package.json
│── vite.config.ts
└── README.md
```

---

## 🚀 Ejecución Local

1. Instala dependencias:
   ```bash
   npm install
   ```

2. Crea un archivo `.env` con la URL del backend:
   ```
   VITE_API_URL=https://edutest-backend-q6nh.onrender.com
   ```

3. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre el navegador en:
   👉 [http://localhost:5173](http://localhost:5173)

---

## 🧾 Licencia

MIT © 2025 — Jonathan Ortiz Ruiz

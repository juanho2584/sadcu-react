# SADCU - Sistema de Administración de Alumnos (Karate & Defensa Personal)

SADCU es una aplicación web moderna diseñada para la gestión, administración y comunicación interactiva de alumnos e instructores de una academia de Karate y Defensa Personal. La aplicación cuenta con una landing page pública e informativa, junto con un portal privado con accesos diferenciados para administradores y alumnos.

---

## 🚀 Tecnologías Principales

El proyecto está desarrollado utilizando un stack tecnológico moderno, responsive y de alto rendimiento:

- **Frontend Core**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Base de Datos y Backend-as-a-Service**: [Supabase](https://supabase.com/) (PostgreSQL, Storage, Row Level Security)
- **Estilos**: [Bootstrap 5](https://getbootstrap.com/) y CSS personalizado (para un diseño premium y responsive)
- **Iconos**: [Bootstrap Icons](https://icons.getbootstrap.com/)
- **Animaciones**: [AOS (Animate On Scroll)](https://michalsnik.github.io/aos/)
- **Enrutamiento**: [React Router DOM v7](https://reactrouter.com/)

---

## 📋 Características Principales

### 🌐 Área Pública (Landing Page)
- **Hero & Presentación**: Sección de bienvenida con animaciones fluidas.
- **Nosotros**: Historia, misión y valores de la academia.
- **Disciplinas**: Listado detallado de las artes marciales y clases dictadas.
- **Instructores**: Presentación del equipo docente.
- **Galería**: Visualización dinámica de imágenes de entrenamientos y eventos.
- **Testimonios / Comentarios**: Muro de comentarios interactivo para usuarios registrados.
- **Contacto**: Información de contacto y formulario integrado.

### 🔐 Autenticación y Autorización
- Acceso seguro mediante inicio de sesión con roles asignados (`admin` y `alumno`).
- Rutas protegidas mediante un componente guardián (`ProtectedRoute.jsx`).

### 🛠️ Portal del Administrador (`/admin`)
- **Dashboard / Estadísticas**: Resumen de alumnos activos, inactivos y total de inscriptos.
- **Gestión de Alumnos (CRUD)**:
  - Crear, editar, activar/desactivar y eliminar perfiles de alumnos.
  - Validación de campos críticos en tiempo real (DNI, email y nombre de usuario).
- **Gestión de Comentarios**: Moderación y eliminación directa de comentarios ofensivos o desactualizados.

### 👤 Portal del Alumno (`/alumno`)
- **Mi Perfil**: Vista personalizada de la información académica y personal del alumno.
- **Comunidad**: Posibilidad de publicar comentarios en el muro general de la landing page.

---

## 📁 Estructura del Directorio

```bash
sadcu-react/
├── public/                 # Recursos estáticos públicos (imágenes, logos)
├── src/
│   ├── assets/             # Recursos multimedia importados en componentes
│   ├── components/         # Componentes reutilizables e individuales
│   │   ├── Alumnos.jsx         # Panel CRUD de alumnos (Admin)
│   │   ├── Comentarios.jsx     # Sección de muro de comentarios
│   │   ├── Contacto.jsx        # Componente de contacto
│   │   ├── Disciplinas.jsx     # Listado de artes marciales
│   │   ├── Footer.jsx          # Pie de página general
│   │   ├── Galeria.jsx         # Galería interactiva
│   │   ├── Hero.jsx            # Banner de bienvenida
│   │   ├── Instructores.jsx    # Sección de profesores
│   │   ├── Navbar.jsx          # Barra de navegación superior
│   │   ├── Nosotros.jsx        # Información institucional
│   │   ├── ProtectedRoute.jsx  # Guardián de seguridad para rutas
│   │   └── Sidebar.jsx         # Menú lateral del panel administrativo
│   ├── context/            # Contextos globales de React (State Management)
│   │   ├── AppContext.jsx      # Comentarios e interacciones generales
│   │   └── AuthContext.jsx     # Gestión de usuarios, autenticación y Supabase
│   ├── pages/              # Vistas o páginas completas de la aplicación
│   │   ├── Admin.jsx           # Vista del portal de Administración
│   │   ├── Alumno.jsx          # Vista del portal del Alumno
│   │   ├── Home.jsx            # Landing page principal
│   │   └── Login.jsx           # Formulario de Acceso y Registro
│   ├── utils/              # Funciones auxiliares y configuración
│   │   └── supabase.js         # Cliente de conexión con Supabase
│   ├── App.css             # Estilos globales y variables CSS de diseño
│   ├── App.jsx             # Definición de rutas y estructura base
│   ├── main.jsx            # Punto de entrada de la aplicación
│   └── aosConfig.js        # Configuración centralizada de animaciones AOS
├── .env example            # Plantilla para variables de entorno
├── eslint.config.js        # Configuración de linter (ESLint)
├── package.json            # Scripts de ejecución y dependencias del proyecto
├── supabase_setup.sql      # Script único y definitivo de configuración de base de datos
└── vite.config.js          # Configuración de empaquetado Vite
```

---

## 🛠️ Configuración e Instalación

### 1. Clonar el repositorio e instalar dependencias
Asegúrate de tener instalado [Node.js](https://nodejs.org/). Luego, ejecuta:
```bash
npm install
```

### 2. Configurar las Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto (basándote en `.env example`):
```bash
VITE_SUPABASE_URL=tu-url-de-supabase
VITE_SUPABASE_KEY=tu-anon-key-de-supabase
```

### 3. Configurar la Base de Datos en Supabase
1. Ve a tu consola de [Supabase](https://database.new).
2. Abre la sección de **SQL Editor**.
3. Copia y ejecuta todo el contenido de [`supabase_setup.sql`](./supabase_setup.sql).
   * *Este script creará las tablas necesarias (`usuarios`, `comentarios`, `categorias_actividades`, `galeria_imagenes`), inicializará los Buckets de almacenamiento en Supabase Storage (`perfiles` y `actividades`), cargará categorías por defecto y creará los usuarios administradores y alumnos iniciales.*

### 4. Ejecutar el Servidor de Desarrollo
Para levantar el servidor localmente con Hot Module Replacement (HMR):
```bash
npm run dev
```
La aplicación estará disponible por defecto en [http://localhost:5173](http://localhost:5173).

---

## 👥 Cuentas de Acceso Preconfiguradas (Datos Semilla)

Para realizar pruebas e ingresar a la aplicación directamente, puedes utilizar las siguientes credenciales insertadas por el script SQL:

### 🔑 Perfiles Administradores (Acceso a `/admin`)
- **Usuario**: `CarlaSadcu` | **Contraseña**: `Sadcu2024!`
- **Usuario**: `FacuSadcu`  | **Contraseña**: `Sadcu2024!`
- **Usuario**: `OmarSadcu`  | **Contraseña**: `Sadcu2024!`

### 🔑 Perfil Alumno de Muestra (Acceso a `/alumno`)
- **Usuario**: `mariagonzalez` | **Contraseña**: `Maria2023!`
- **Usuario**: `carlosrodriguez` | **Contraseña**: `Carlos456@`
- **Usuario**: `anamartinez`     | **Contraseña**: `Alumno789$`

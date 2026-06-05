# UniPilar — Plataforma Estudiantil UNA

> Universidad Nacional de Pilar - Plataforma de Estudio y Gestión Académica

## 🚀 Visión

UniPilar fusiona lo mejor de dos proyectos previos (FRRF y UniTools) para crear una plataforma completa para estudiantes de la Universidad Nacional de Pilar:

- **Frontend**: UI moderna con apuntes, quizzes interactivos y chat IA (offline/online)
- **Backend**: Microservicios con autenticación JWT, upload de archivos y datos académicos
- **PWA**: Instalable como app en el celular, funciona offline
- **Escalable**: Arquitectura de microservicios lista para producción

---

## 📁 Estructura del Proyecto

```
unipilar/
├── client/                    # Frontend (Vanilla JS + PWA)
│   ├── index.html            # Single Page Application
│   ├── assets/
│   │   ├── app.js            # Lógica principal
│   │   ├── sw.js             # Service Worker (offline)
│   │   └── manifest.json     # PWA manifest
│   └── .env
│
├── services/
│   ├── auth/                 # Microservicio de autenticación
│   │   ├── src/
│   │   │   ├── controllers/  # authController.js (register, login, refresh)
│   │   │   ├── middlewares/  # authMiddleware.js, uploadMiddleware.js
│   │   │   ├── models/       # User.js
│   │   │   ├── routes/       # authRoutes.js
│   │   │   ├── config/       # database.js, cors.js
│   │   │   └── app.js        # Entry point
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── .env.example
│   │
│   ├── image/                # Microservicio de uploads (por implementar)
│   │   └── src/
│   │
│   └── academic/             # Microservicio académico (por implementar)
│       └── src/
│
├── docker-compose.yml        # Orquestación de servicios (por configurar)
├── .github/workflows/        # CI/CD pipeline (por configurar)
└── README.md
```

---

## ✨ Features Implementadas

### Frontend (client/)
✅ UI moderna con glass morphism y particle animations  
✅ 4 materias con apuntes y quizzes: Programación, Base de Datos, Sistemas Operativos, Fundamentos  
✅ Chat IA con modo offline (keywords) y online (Gemini API)  
✅ Detección de intención para navegación entre materias  
✅ Login/Register modals conectados a auth-service  
✅ Responsive design completo (mobile-first)  
✅ PWA ready (service worker, manifest)  

### Auth Service (services/auth/)
✅ Registro con legajo estudiantil  
✅ Login por email o legajo  
✅ JWT access token + refresh token  
✅ Validación de input con express-validator  
✅ Rate limiting (express-rate-limit)  
✅ Password hashing con bcrypt  
✅ CORS configurado  
✅ Health check endpoint  

---

## 🛠️ Tecnologías

**Frontend:**
- Vanilla JavaScript (ES6+)
- HTML5 + CSS3 (Custom Properties, Grid, Flexbox)
- Font Awesome icons
- Google Fonts (Inter)

**Backend:**
- Node.js + Express
- PostgreSQL + Sequelize ORM
- JWT authentication
- bcryptjs para password hashing
- express-validator para validación
- express-rate-limit para rate limiting

**Infraestructura:**
- Docker + Docker Compose
- GitHub Actions (CI/CD)
- Nginx (reverse proxy, por configurar)

---

## 🏃‍♂️ Cómo Ejecutar (Development)

### 1. Prerrequisitos
- Node.js >= 18
- PostgreSQL >= 14
- npm o yarn

### 2. Setup del Auth Service

```bash
cd services/auth

# Copiar variables de entorno
cp .env.example .env

# Editar .env con tus credenciales de PostgreSQL
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=unipilar
# DB_USER=unipilar_user
# DB_PASSWORD=tu_password
# JWT_SECRET=tu_secreto_super_seguro

# Instalar dependencias
npm install

# Iniciar servidor
npm run dev
```

El auth service estará corriendo en `http://localhost:4001`

### 3. Ejecutar Frontend

```bash
# Opción A: Servidor estático simple
cd client
npx serve -s . -l 3000

# Opción B: Live Server (VS Code extension)
# Click derecho en index.html → Open with Live Server
```

El frontend estará en `http://localhost:3001`

---

## 📡 Endpoints API

### Auth Service (`http://localhost:4001/api/auth`)

| Method | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| POST | `/register` | ❌ | Registrar estudiante |
| POST | `/login` | ❌ | Login con email/legajo |
| POST | `/refresh` | ❌ | Renovar access token |
| GET | `/me` | ✅ | Obtener perfil del usuario |

#### Ejemplo: Registro

```bash
curl -X POST http://localhost:4001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@email.com",
    "legajo": "12345",
    "password": "securepass123",
    "careerId": "uuid-de-carrera",
    "year": 2,
    "turno": "manana"
  }'
```

#### Ejemplo: Login

```bash
curl -X POST http://localhost:4001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "legajo": "12345",
    "password": "securepass123"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "name": "Juan Pérez",
    "email": "juan@email.com",
    "legajo": "12345",
    "year": 2,
    "turno": "manana",
    "role": "student"
  }
}
```

---

## 🔐 Variables de Entorno

### Auth Service (.env)

```env
NODE_ENV=development
PORT=4001

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=unipilar
DB_USER=unipilar_user
DB_PASSWORD=tu_password

# JWT
JWT_SECRET=cambia_esto_en_produccion
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=cambia_esto_tambien
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:4001
REACT_APP_GEMINI_API_KEY=tu_api_key_opcional
```

---

## 🧪 Testing

```bash
cd services/auth
npm test
```

---

## 📊 Base de Datos - Modelo User

```sql
Table: users
- id: UUID (primary key)
- name: VARCHAR(100)
- email: VARCHAR(255) (unique)
- legajo: VARCHAR(20) (unique)
- password: VARCHAR(255) (hashed)
- careerId: UUID (foreign key → careers)
- year: INTEGER (1-10)
- turno: ENUM('manana', 'tarde', 'noche')
- role: ENUM('student', 'admin')
- createdAt: TIMESTAMP
- updatedAt: TIMESTAMP
```

---

## 🚀 Próximos Pasos (Por Implementar)

### Image Service (services/image/)
- [ ] Upload de imágenes con multer
- [ ] Validación de tipos (jpg, png, pdf)
- [ ] Tamaño máximo (5MB)
- [ ] Fix path traversal security
- [ ] Thumbnail generation con sharp
- [ ] Auth required para upload/delete

### Academic Service (services/academic/)
- [ ] Modelos: Career, Subject, Grade, Schedule
- [ ] Endpoints para carreras, materias, notas, horarios
- [ ] Seeds con carreras reales de la UNA
- [ ] Relación con User model

### Frontend
- [ ] Service Worker completo (offline mode)
- [ ] PWA manifest con iconos
- [ ] Sección de horarios
- [ ] Sección de calificaciones
- [ ] Upload de trabajos prácticos

### Infraestructura
- [ ] Docker Compose (unificar DB, servicios, frontend)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Nginx reverse proxy
- [ ] HTTPS con Let's Encrypt

---

## 🎯 Carreras de la UNA (Para Seeds)

- Contador Público Nacional
- Licenciatura en Administración
- Licenciatura en Higiene y Seguridad en el Trabajo
- Tecnicatura en Enfermería
- Abogacía
- (Agregar más según necesidad)

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

---

## 📄 Licencia

Este proyecto es de código abierto para uso educativo en la Universidad Nacional de Pilar.

---

## 👥 Equipo

Desarrollado como proyecto fusión de FRRF + UniTools para estudiantes de la UNA.

---

## 📞 Soporte

Si tenés problemas o sugerencias, creá un issue en el repositorio.

---

**Hecho con ❤️ para la Universidad Nacional de Pilar**

# 🚀 Quick Start - UniPilar

## Opción 1: Docker Compose (Recomendado)

```bash
# 1. Clonar el proyecto
cd e:\Peliculas\FRRF-main\unipilar

# 2. Copiar archivos de entorno
copy services\auth\.env.example services\auth\.env
copy services\academic\.env.example services\academic\.env

# 3. Levantar todo con Docker
docker-compose up --build

# 4. Abrir en el navegador
# Frontend: http://localhost:3001
# Auth API: http://localhost:4001
# Academic API: http://localhost:4003
```

---

## Opción 2: Desarrollo Local

### Prerrequisitos
- Node.js >= 18
- PostgreSQL >= 14
- npm

### Pasos

#### 1. Configurar Base de Datos

```sql
-- En PostgreSQL
CREATE DATABASE unipilar;
CREATE USER unipilar_user WITH PASSWORD 'tu_password_seguro';
GRANT ALL PRIVILEGES ON DATABASE unipilar TO unipilar_user;
```

#### 2. Setup Auth Service

```bash
cd services\auth

# Copiar .env
copy .env.example .env

# Editar .env con tus credenciales
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=unipilar
# DB_USER=unipilar_user
# DB_PASSWORD=tu_password
# JWT_SECRET=cambia_esto_por_algo_seguro

# Instalar dependencias
npm install

# Iniciar servidor
npm run dev
```

#### 3. Setup Academic Service

```bash
cd services\academic

# Copiar .env
copy .env.example .env

# Editar .env (mismas credenciales que auth)

# Instalar dependencias
npm install

# Iniciar servidor
npm run dev
```

#### 4. Ejecutar Frontend

```bash
cd client

# Opción A: Servidor estático simple
npx serve -s . -l 3001

# Opción B: Live Server (VS Code)
# Click derecho en index.html → Open with Live Server
```

---

## 📡 Endpoints Disponibles

### Auth Service (http://localhost:4001)

```bash
# Registrar estudiante
POST /api/auth/register
{
  "name": "Juan Pérez",
  "email": "juan@email.com",
  "legajo": "12345",
  "password": "securepass123"
}

# Login
POST /api/auth/login
{
  "legajo": "12345",
  "password": "securepass123"
}

# Obtener perfil (requiere token)
GET /api/auth/me
Authorization: Bearer YOUR_TOKEN
```

### Academic Service (http://localhost:4003)

```bash
# Listar carreras
GET /api/academic/careers

# Listar materias
GET /api/academic/subjects?careerId=CAREER_UUID

# Ver notas del estudiante (requiere auth)
GET /api/academic/grades?userId=USER_UUID
Authorization: Bearer YOUR_TOKEN

# Ver horarios
GET /api/academic/schedules?turno=manana
```

---

## 🧪 Probar la Aplicación

1. Abrir http://localhost:3001
2. Hacer clic en "Ingresar"
3. Registrarse con legajo, email y contraseña
4. Explorar materias, quizzes y chat IA

---

## 📊 Seeds (Datos de Prueba)

Para cargar carreras de la UNA:

```bash
cd services\academic
npx sequelize-cli db:seed:all --config src/config/database.js --seeders-path src/seeds
```

---

## 🐛 Troubleshooting

### Error: "Database connection failed"
- Verificar que PostgreSQL esté corriendo
- Verificar credenciales en .env
- Verificar que la base de datos exista

### Error: "Port already in use"
- Cambiar puertos en .env (4001, 4003, 3000)
- O matar procesos que usen esos puertos

### Error: "Module not found"
```bash
cd services\auth
npm install

cd services\academic
npm install
```

---

## 📝 Variables de Entorno Importantes

### Auth Service
- `JWT_SECRET`: Clave secreta para tokens (¡cambiar en producción!)
- `DB_PASSWORD`: Contraseña de PostgreSQL

### Academic Service
- `AUTH_SERVICE_URL`: URL del auth service (para validar tokens)
- `DB_PASSWORD`: Misma que auth service

### Frontend
- `REACT_APP_API_URL`: URL del auth service (default: http://localhost:4001)
- `CLIENT_PORT`: Puerto del frontend (default: 3001)

---

## 🎯 Próximos Pasos

1. ✅ Setup completado
2. 📝 Crear cuenta de estudiante
3. 📚 Explorar materias y quizzes
4. 💬 Probar chat IA (offline/online)
5. 🔧 Configurar image service (pendiente)
6. 🎨 Personalizar con datos de la UNA

---

**¿Necesitás ayuda?** Revisá el [README.md](README.md) completo.

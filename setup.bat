@echo off
echo ========================================
echo  UniPilar - Setup Script
echo  Universidad Nacional de Pilar
echo ========================================
echo.

REM Check if .env exists in auth service
if not exist "services\auth\.env" (
    echo [1/4] Creating auth service .env file...
    copy "services\auth\.env.example" "services\auth\.env"
    echo      ✓ Auth service .env created
    echo      ⚠  IMPORTANT: Edit services\auth\.env with your PostgreSQL credentials
) else (
    echo [1/4] Auth service .env already exists
)

echo.

REM Check if .env exists in academic service
if not exist "services\academic\.env" (
    echo [2/4] Creating academic service .env file...
    copy "services\academic\.env.example" "services\academic\.env"
    echo      ✓ Academic service .env created
) else (
    echo [2/4] Academic service .env already exists
)

echo.

REM Install auth service dependencies
echo [3/4] Installing auth service dependencies...
cd services\auth
call npm install
cd ..\..
echo      ✓ Auth service dependencies installed

echo.

REM Install academic service dependencies
echo [4/4] Installing academic service dependencies...
cd services\academic
call npm install
cd ..\..
echo      ✓ Academic service dependencies installed

echo.
echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Edit services\auth\.env with your PostgreSQL credentials
echo 2. Start PostgreSQL database
echo 3. Run: npm run dev (in each service folder)
echo 4. Open client\index.html in your browser (port 3001)
echo.
echo Or use Docker Compose:
echo   docker-compose up --build
echo.
echo Frontend will be available at: http://localhost:3001
echo.
pause

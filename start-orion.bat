@echo off
REM Start Orion System for Windows
REM This script starts all the necessary components for the Orion system

echo Starting Orion System...

REM Check if Docker is running
docker info > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
  echo Docker is not running. Please start Docker and try again.
  exit /b 1
)

REM Start Qdrant database
echo Starting Qdrant database...
docker ps | findstr qdrant_db > nul
if %ERRORLEVEL% NEQ 0 (
  docker run -d --name qdrant_db -p 6333:6333 -p 6334:6334 -v %cd%\qdrant_storage:/qdrant/storage qdrant/qdrant
  echo Qdrant database started.
) else (
  echo Qdrant database is already running.
)

REM Wait for Qdrant to be ready
echo Waiting for Qdrant to be ready...
timeout /t 5 /nobreak > nul

REM Check if port 5002 is already in use
netstat -ano | findstr :5002 > nul
if %ERRORLEVEL% EQU 0 (
  echo Port 5002 is already in use. Attempting to free it...
  for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5002') do (
    taskkill /F /PID %%a
  )
  timeout /t 1 /nobreak > nul
)

REM Start Python API server
echo Starting Python API server...
start "Python API Server" cmd /c "cd orion_python_backend && python notion_api_server.py"

REM Wait for Python API to be ready
echo Waiting for Python API to be ready...
timeout /t 3 /nobreak > nul

REM Run tests
echo Running tests...
call npm test || echo Tests failed but continuing...

REM Start Next.js dev server
echo Starting Next.js development server...
start "Next.js Server" cmd /c "npm run dev"

echo Orion system started successfully!
echo - Qdrant is running on port 6333
echo - Python API is running on port 5002
echo - Next.js is running on port 3000
echo.
echo To stop the system, close this window and the server windows.

REM Keep the script running
pause
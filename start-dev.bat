@echo off
echo Instalando dependencias del frontend...
cd frontend
call npm install
cd ..

echo.
echo Arrancando backend (puerto 3000) y frontend (puerto 3001)...
call npm run dev:all

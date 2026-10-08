@echo off
echo Starting Duolingo Web Clone Services...
start "Duolingo Backend API (Port 8000)" cmd /k "cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
start "Duolingo Frontend (Port 3000)" cmd /k "cd frontend && npm run dev"
echo Both services launched in separate windows!
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
pause

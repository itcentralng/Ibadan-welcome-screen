@echo off
cd /d "C:\USERS\PC\DESKTOP\nysc-museum-welcome-screen"
set FLASK_APP=app.py
@REM start microsoft-edge: --app=http://localhost:5000
@REM start microsoft-edge:http://localhost:5000
flask run

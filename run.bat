@echo off
:: Start the app
start /MIN "" flask run
timeout /t 5 /nobreak

:: Launch Edge in fullscreen kiosk mode
start "" "msedge" --kiosk --edge-kiosk-type=fullscreen --no-first-run --disable-features=msEdgeEnterpriseModePolicies http://127.0.0.1:5000
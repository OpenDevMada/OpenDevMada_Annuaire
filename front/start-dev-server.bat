@echo off
echo 🚀 Démarrage du serveur de développement avec support CORS
echo 📍 URL: http://127.0.0.1:8081
echo 🌐 API: https://opendevmadaannuaire.infinityfree.me/api/opendevmada
echo.
echo ⚠️  N'utilisez PAS Live Server - utilisez cette URL à la place !
echo.

cd /d "%~dp0"
http-server . --cors -p 8081

pause
@echo off
REM Start From Scratch - Development Cleanup Script for Windows

echo 🧹 Cleaning up development environment...

REM Stop and remove containers
echo 🛑 Stopping containers...
docker-compose -f docker-compose.dev.yml down

REM Optional: Remove volumes (uncomment if you want to reset database)
REM echo 🗑️ Removing volumes...
REM docker-compose -f docker-compose.dev.yml down -v

echo ✅ Development environment cleaned up!
echo.
echo To start again, run: .\scripts\dev-setup.bat
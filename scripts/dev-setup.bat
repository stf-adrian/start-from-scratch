@echo off
REM Start From Scratch - Development Setup Script for Windows

echo 🚀 Starting development environment for Start From Scratch...

REM Check if port 3306 is in use and stop existing MySQL containers
echo 🔍 Checking for existing MySQL services...
netstat -an | findstr ":3306" >nul
if %errorlevel% == 0 (
    echo ⚠️  Port 3306 is already in use. Stopping existing containers...
    docker stop start-from-scratch-mysql-dev 2>nul
    docker rm start-from-scratch-mysql-dev 2>nul
    echo ✅ Cleaned up existing containers
)

REM Start the database
echo 📊 Starting MySQL database...
docker-compose -f docker-compose.dev.yml up -d

REM Wait for database to be ready (Windows timeout syntax)
echo ⏳ Waiting for database to be ready...
ping -n 15 127.0.0.1 >nul

REM Check if containers are running
echo 🔍 Checking container status...
docker-compose -f docker-compose.dev.yml ps

REM Check if MySQL is healthy
echo 🏥 Checking database health...
docker-compose -f docker-compose.dev.yml exec -T mysql-dev mysqladmin ping -h localhost --silent
if %errorlevel% == 0 (
    echo ✅ Database is healthy and ready!
    
    REM Automatically set up database schema
    echo 🗄️ Setting up database schema...
    cd backend
    if not exist node_modules (
        echo 📦 Installing backend dependencies...
        npm install
    )
    
    REM Set environment variable for this session
    set DATABASE_URL=mysql://root:password@localhost:3307/start_from_scratch
    
    echo 🔄 Running database migrations...
    npm run db:migrate
    
    if %errorlevel% == 0 (
        echo ✅ Database schema set up successfully!
    ) else (
        echo ❌ Database migration failed. Please check the logs.
        cd ..
        exit /b 1
    )
    
    cd ..
) else (
    echo ❌ Database is not ready. Checking logs...
    docker-compose -f docker-compose.dev.yml logs mysql-dev
    exit /b 1
)

echo 🎯 Development environment is ready!
echo.
echo Next steps:
echo 1. Run 'cd backend && npm run dev' to start the backend server  
echo 2. Run 'cd frontend && npm run dev' to start the frontend development server
echo.
echo Backend will be available at: http://localhost:3001
echo Frontend will be available at: http://localhost:5173
echo Database will be available at: localhost:3307
echo.
echo To stop the development environment: docker-compose -f docker-compose.dev.yml down
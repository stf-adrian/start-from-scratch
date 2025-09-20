#!/bin/bash

# Start From Scratch - Development Setup Script

echo "🚀 Starting development environment for Start From Scratch..."

# Start the database
echo "📊 Starting MySQL database..."
docker-compose -f docker-compose.dev.yml up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Check if database is healthy
if docker-compose -f docker-compose.dev.yml ps mysql-dev | grep -q "healthy"; then
    echo "✅ Database is ready!"
else
    echo "❌ Database is not ready. Please check the logs."
    docker-compose -f docker-compose.dev.yml logs mysql-dev
    exit 1
fi

echo "🎯 Development environment is ready!"
echo ""
echo "Next steps:"
echo "1. Run 'cd backend && npm run db:migrate' to set up database schema"
echo "2. Run 'cd backend && npm run dev' to start the backend server"
echo "3. Run 'cd frontend && npm run dev' to start the frontend development server"
echo ""
echo "Backend will be available at: http://localhost:3001"
echo "Frontend will be available at: http://localhost:5173"
echo "Database will be available at: localhost:3306"
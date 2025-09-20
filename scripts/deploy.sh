#!/bin/bash

# Start From Scratch - Production Deployment Script

echo "🚀 Building and starting production environment..."

# Build all images
echo "🔨 Building Docker images..."
docker-compose build

# Start all services
echo "🌟 Starting all services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check service health
echo "🔍 Checking service health..."
docker-compose ps

echo "✅ Production deployment complete!"
echo ""
echo "Services are available at:"
echo "Frontend: http://localhost"
echo "Backend API: http://localhost:3001"
echo "Reverse Proxy: http://localhost:8080 (run with --profile production)"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop all services: docker-compose down"
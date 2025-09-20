# Docker Configuration for Start From Scratch

This directory contains all Docker-related configuration files for the Start From Scratch application.

## Architecture

The application consists of four main containers:

1. **MySQL Database** - Stores user data and application state
2. **Backend Server** - Hono.js API server with authentication
3. **Frontend Web** - React SPA served by Nginx
4. **Nginx Proxy** - Reverse proxy for production (optional)

## Quick Start

### Development Environment

1. Start the development database:

```bash
# Windows
scripts\dev-setup.bat

# Linux/Mac
chmod +x scripts/dev-setup.sh
./scripts/dev-setup.sh
```

2. Set up the database schema:

```bash
cd backend
npm run db:migrate
```

3. Start the development servers:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Production Environment

1. Build and deploy:

```bash
# Linux/Mac
chmod +x scripts/deploy.sh
./scripts/deploy.sh

# Or manually
docker-compose up -d --build
```

## Container Details

### MySQL Container

- **Image**: mysql:8.0
- **Port**: 3306
- **Volume**: Persistent data storage
- **Health Check**: mysqladmin ping

### Backend Container

- **Build**: ./backend/Dockerfile
- **Port**: 3001
- **Environment**: Production Node.js with Prisma
- **Health Check**: API health endpoint

### Frontend Container

- **Build**: ./frontend/Dockerfile
- **Port**: 80
- **Server**: Nginx with optimized React build
- **Health Check**: Nginx health endpoint

### Nginx Proxy (Production)

- **Image**: nginx:alpine
- **Port**: 8080
- **Purpose**: Load balancing and SSL termination
- **Profile**: production (optional)

## Environment Variables

### Backend

- `NODE_ENV`: production
- `DATABASE_URL`: MySQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `CORS_ORIGIN`: Allowed origins for CORS

### Database

- `MYSQL_ROOT_PASSWORD`: Root user password
- `MYSQL_DATABASE`: Application database name
- `MYSQL_USER`: Application user
- `MYSQL_PASSWORD`: Application user password

## Health Checks

All containers include health checks:

- MySQL: Database connectivity
- Backend: API health endpoint
- Frontend: Nginx health endpoint

## Volumes

- `mysql_data`: Persistent MySQL data storage
- `mysql_dev_data`: Development MySQL data storage

## Networks

- `app-network`: Production container communication
- `app-network-dev`: Development container communication

## Commands

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Start production environment
docker-compose up -d --build

# Start with reverse proxy
docker-compose --profile production up -d --build

# View logs
docker-compose logs -f [service-name]

# Stop all services
docker-compose down

# Remove volumes (data will be lost)
docker-compose down -v

# Rebuild specific service
docker-compose build [service-name]
docker-compose up -d [service-name]
```

## Troubleshooting

### Database Connection Issues

1. Check if MySQL container is healthy: `docker-compose ps`
2. View MySQL logs: `docker-compose logs mysql`
3. Test connection: `docker-compose exec mysql mysql -u app_user -p`

### Backend Issues

1. Check backend logs: `docker-compose logs server`
2. Verify environment variables are set correctly
3. Ensure database migrations have run

### Frontend Issues

1. Check nginx logs: `docker-compose logs web`
2. Verify backend API is accessible
3. Check browser console for JavaScript errors

### Port Conflicts

If ports are already in use, modify the port mappings in docker-compose.yml:

```yaml
ports:
  - "8080:80" # Change 80 to another port
```

# Start From Scratch

A complete full-stack web application that demonstrates modern development practices, from user authentication to deployment. This project showcases a simple yet robust user management system with registration, login, and profile viewing capabilities.

## 🚀 Features

- **User Registration** - Create accounts with username, email, and secure password
- **User Authentication** - JWT-based login system with password hashing
- **User Dashboard** - View profile information including registration date and last login
- **Responsive Design** - Modern UI built with shadcn/ui and Tailwind CSS
- **Security First** - Input validation, CORS protection, and secure headers
- **Containerized** - Fully dockerized for easy deployment
- **CI/CD Ready** - GitHub Actions workflows for testing and deployment

## 🏗️ Architecture

### Tech Stack

**Frontend:**

- React 19 with TypeScript
- Vite for fast development and building
- shadcn/ui component library
- Tailwind CSS for styling
- React Router for navigation
- React Query for state management
- React Hook Form with Zod validation

**Backend:**

- Hono.js (modern web framework)
- TypeScript
- JWT for authentication
- bcrypt for password hashing
- Prisma ORM with MySQL
- Zod for input validation

**Database:**

- MySQL 8.0
- Prisma for schema management
- User and LoginLog tables

**DevOps:**

- Docker & Docker Compose
- GitHub Actions CI/CD
- Nginx for production serving
- Health checks and monitoring

## 🛠️ Development Setup

### Prerequisites

- Node.js 20.19+ or 22.12+
- Docker and Docker Compose
- Git

### Quick Start

1. **Clone the repository**

```bash
git clone https://github.com/stf-adrian/start-from-scratch.git
cd start-from-scratch
```

2. **Start the development environment**

```bash
# Windows
scripts\dev-setup.bat

# Linux/Mac
chmod +x scripts/dev-setup.sh
./scripts/dev-setup.sh
```

3. **Set up the database**

```bash
cd backend
cp .env.example .env
npm install
npm run db:migrate
```

4. **Start the development servers**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

5. **Access the application**

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Database: localhost:3306

## 📁 Project Structure

```
start-from-scratch/
├── backend/                 # Hono.js API server
│   ├── src/
│   │   ├── lib/            # Utilities (auth, db, validation)
│   │   ├── middleware/     # Authentication middleware
│   │   ├── routes/         # API routes
│   │   └── types/          # TypeScript definitions
│   ├── prisma/             # Database schema and migrations
│   ├── tests/              # Unit tests
│   └── Dockerfile          # Backend container
├── frontend/               # React SPA
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── lib/            # Utilities and API client
│   │   ├── pages/          # Page components
│   │   └── test/           # Test setup
│   ├── nginx.conf          # Nginx configuration
│   └── Dockerfile          # Frontend container
├── docker-from-scratch/    # Docker configuration
│   ├── nginx/              # Reverse proxy config
│   ├── mysql/              # Database initialization
│   └── README.md           # Docker documentation
├── .github/workflows/      # CI/CD pipelines
├── scripts/                # Deployment scripts
└── docs.md                 # Detailed specification
```

## 🔐 API Endpoints

### Authentication

**POST /api/register**

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**POST /api/login**

```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**GET /api/me** (Authenticated)

```bash
Authorization: Bearer <jwt_token>
```

### Response Format

```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "lastLogin": "2025-01-01T12:00:00.000Z"
  }
}
```

## 🚢 Production Deployment

### Using Docker Compose

1. **Build and deploy all services**

```bash
docker-compose up -d --build
```

2. **Access the application**

- Frontend: http://localhost
- Backend: http://localhost:3001

### Using Individual Containers

1. **Build images**

```bash
docker build -t start-backend ./backend
docker build -t start-frontend ./frontend
```

2. **Run with environment variables**

```bash
# Database
docker run -d --name mysql \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=start_from_scratch \
  -p 3306:3306 mysql:8.0

# Backend
docker run -d --name backend \
  -e DATABASE_URL="mysql://root:password@mysql:3306/start_from_scratch" \
  -e JWT_SECRET="your-secret-key" \
  --link mysql \
  -p 3001:3001 start-backend

# Frontend
docker run -d --name frontend \
  --link backend \
  -p 80:80 start-frontend
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test                    # Run all tests
npm run test:watch         # Watch mode
```

### Frontend Tests

```bash
cd frontend
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:ui            # Visual test runner
```

### Integration Tests

```bash
# Start test environment
docker-compose -f docker-compose.dev.yml up -d

# Run API tests
cd backend
npm run test:integration
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**

```env
NODE_ENV=development
PORT=3001
DATABASE_URL="mysql://username:password@localhost:3306/start_from_scratch"
JWT_SECRET="your-super-secret-jwt-key"
CORS_ORIGIN="http://localhost:5173"
```

**Frontend (.env)**

```env
VITE_API_URL=http://localhost:3001
```

### Database Schema

The application uses two main tables:

- **users**: Store user account information
- **login_logs**: Track user login activity with metadata

See `backend/prisma/schema.prisma` for detailed schema definition.

## 📊 Monitoring & Health Checks

### Health Endpoints

- **Backend**: `GET /api/health`
- **Frontend**: `GET /health`
- **Database**: Built-in MySQL health check

### Docker Health Checks

All containers include health checks for monitoring:

```bash
docker-compose ps       # View container health
docker-compose logs     # View application logs
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Workflow

1. Make sure all tests pass: `npm test`
2. Lint your code: `npm run lint`
3. Build successfully: `npm run build`
4. Update documentation if needed

## 📋 Scripts

### Development

```bash
# Backend
npm run dev              # Start development server
npm run build           # Build for production
npm run test            # Run tests
npm run db:migrate      # Run database migrations
npm run db:studio       # Open Prisma Studio

# Frontend
npm run dev             # Start development server
npm run build           # Build for production
npm run test            # Run tests
npm run lint            # Lint code
```

### Docker

```bash
# Development
scripts/dev-setup.sh    # Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Production
scripts/deploy.sh       # Deploy production environment
docker-compose up -d --build
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Zod schema validation
- **CORS Protection**: Configurable origins
- **Security Headers**: XSS, CSRF, and content-type protection
- **Rate Limiting**: Available through middleware
- **SQL Injection Protection**: Prisma ORM prevents SQL injection

## 📈 Performance

- **Frontend**: Vite for fast builds and HMR
- **Backend**: Hono.js for high performance
- **Database**: MySQL with optimized queries
- **Caching**: Nginx static file caching
- **Compression**: Gzip compression enabled

## 📞 Support

- **Documentation**: Check `docs.md` for detailed specifications
- **Issues**: GitHub Issues for bug reports and features
- **Discussions**: GitHub Discussions for questions

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Roadmap

- [ ] Email verification for registration
- [ ] Password reset functionality
- [ ] User profile editing
- [ ] Session management
- [ ] Rate limiting
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] User roles and permissions
- [ ] Social authentication
- [ ] API versioning

---

**Built with ❤️ using modern web technologies**

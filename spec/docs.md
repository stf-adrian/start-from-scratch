# From Zero to MVP

This document contains all the key decisions made to build this MVP, covering the complete development journey from concept to deployment.

## Table of Contents

- [App Specification](#1-app-specification)
- [Architecture](#2-architecture)
- [Tech Stack](#3-tech-stack)
- [CI/CD Pipeline](#4-cicd-pipeline)
- [Server Infrastructure](#5-server-infrastructure)

---

## 1. App Specification

### Overview

A web application that allows users to connect and view their account metadata, including registration date, last login, user ID, and other relevant information.

### User Roles

**User**: `[canRegister, canLogIn, canViewOwnMetadata]`

### Core Functionality

#### Registration

- **Endpoint**: `POST /api/register`
- **Input**: `[username, email, password]`
- **Process Flow**:
  1. Validate input
  2. Hash password
  3. Store user in database
  4. Record registration timestamp
- **Responses**:
  - `200`: `{success: true, userId}`
  - `400`: `{success: false, message}`

#### Login

- **Endpoint**: `POST /api/login`
- **Input**: `[email, password]`
- **Process Flow**:
  1. Validate credentials
  2. Generate JWT token
  3. Update last login timestamp
- **Responses**:
  - `200`: `{success: true, token}`
  - `400`: `{success: false, message}`

#### User Profile

- **Endpoint**: `GET /api/me`
- **Authentication**: JWT required
- **Response**: `{username, email, createdAt, lastLogin}`

### Database Schema

```sql
User {
  id: UUID (Primary Key)
  username: String
  email: String
  passwordHash: String
  createdAt: DateTime
  lastLogin: DateTime
}

LoginLog {
  id: UUID (Primary Key)
  userId: UUID (Foreign Key → User.id)
  loginTimestamp: DateTime
  ipAddress: String
  userAgent: String
  country: String
  city: String
  device: String
  browser: String
}
```

### API Overview

- `/api/register` - User registration
- `/api/login` - User authentication
- `/api/me` - User profile retrieval

### Frontend User Flow

1. **Landing Page**

   - Buttons: Login, Register

2. **Registration Page**

   - Form fields: Username, Email, Password
   - Actions: Submit, Navigate to Login

3. **Login Page**

   - Form fields: Email, Password
   - Actions: Submit, Navigate to Register

4. **Dashboard**
   - Display: Username, Email, Registration Date, Last Login
   - Actions: Logout

---

## 2. Architecture

### Frontend Framework: **React + Vite**

- **React + Vite**:
  - Simple and straightforward
  - SPA (single page application), API handled separately
  - **No Next.js**: I intentionally ditched SSR and Next.js because the backend is separate

**Why:**  
I chose **React + Vite** to keep the frontend simple - plain HTML + JS + CSS.

### Backend Architecture: **Monolith vs Microservices**

**Options:**

- **Monolith**:
  - One Hono server, all routes and logic in one app
  - Easy to develop, deploy, and maintain for small projects
- **Microservices**:
  - Split into multiple services (auth-service, user-service, etc.)
  - Allows scaling separate parts but adds complexity

**Decision:**  
I chose a **Monolithic architecture** because this is a simple app (register, login, profile).  
It keeps development fast and avoids unnecessary complexity.  
If the app grows significantly, I can refactor parts into microservices later.

## 3. Tech Stack

- **Frontend**: `[React, TypeScript, Vite, Vitest, shadcn/ui]`
- **Backend**: `[Hono, JWT, Bcrypt, TypeScript]`
- **Database**: `[MySQL, Prisma]`
- **Docker**: `[Nginx, MySQL, Server, Web]` - fully packed for deployment on any device
- **Branches**: `[main, dev]`
- **CI/CD**: `[GitHub Actions]` - `[lint, run tests, build images, deploy images]`

## 4. CI/CD Pipeline

**GitHub Actions workflow:**

1. Lint code
2. Run Vitest tests
3. Build images separately
4. Deploy all together

**Docker Images:**

- **nginx** → fully prepared app for any device
- **mysql** → database container
- **server** → dockerized API
- **web** → dockerized frontend

## 5. Server Infrastructure

_[To be documented based on hosting solution]_

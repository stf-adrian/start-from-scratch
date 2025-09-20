import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import auth from './routes/auth.js';

// Get the directory of the current module and resolve the .env path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '..', '.env.new');

// Check if .env file exists
const envExists = fs.existsSync(envPath);

// Load environment variables from the .env file
const result = dotenv.config({ path: envPath });

// Debug: log environment variables and path
console.log('Environment path:', envPath);
console.log('Env file exists:', envExists);
console.log('Dotenv result:', result);
console.log('Environment check:', {
    DATABASE_URL: process.env.DATABASE_URL ? 'loaded' : 'missing',
    JWT_SECRET: process.env.JWT_SECRET ? 'loaded' : 'missing',
    NODE_ENV: process.env.NODE_ENV
});
if (process.env.DATABASE_URL) {
    console.log('DATABASE_URL value:', process.env.DATABASE_URL);
}

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
}));

// Health check
app.get('/', (c) => {
    return c.json({ message: 'Start from Scratch API is running!' });
});

app.get('/api/health', (c) => {
    return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Debug endpoint to check environment variables
app.get('/api/debug/env', (c) => {
    return c.json({
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        DATABASE_URL: process.env.DATABASE_URL ? 'loaded' : 'missing',
        JWT_SECRET: process.env.JWT_SECRET ? 'loaded' : 'missing'
    });
});

// API routes
app.route('/api', auth);

const port = Number(process.env.PORT) || 3001;

console.log(`🚀 Server is running on port ${port}`);

serve({
    fetch: app.fetch,
    port,
});
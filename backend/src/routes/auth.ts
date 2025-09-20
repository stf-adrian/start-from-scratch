import { Hono } from 'hono';
import { db } from '../lib/db.js';
import { hashPassword, comparePassword, generateToken } from '../lib/auth.js';
import { registerSchema, loginSchema } from '../lib/validation.js';
import { authMiddleware } from '../middleware/auth.js';

const auth = new Hono();

// Register endpoint
auth.post('/register', async (c) => {
    try {
        const body = await c.req.json();

        // Validate input
        const validatedData = registerSchema.parse(body);

        // Check if user already exists
        const existingUser = await db.user.findFirst({
            where: {
                OR: [
                    { email: validatedData.email },
                    { username: validatedData.username }
                ]
            }
        });

        if (existingUser) {
            return c.json({
                success: false,
                message: existingUser.email === validatedData.email
                    ? 'Email already registered'
                    : 'Username already taken'
            }, 400);
        }

        // Hash password and create user
        const passwordHash = await hashPassword(validatedData.password);

        const user = await db.user.create({
            data: {
                username: validatedData.username,
                email: validatedData.email,
                passwordHash,
            },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
            }
        });

        return c.json({
            success: true,
            userId: user.id,
            user: {
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
            }
        });

    } catch (error) {
        console.error('Registration error:', error);

        if (error instanceof Error && 'issues' in error) {
            // Zod validation error
            return c.json({
                success: false,
                message: 'Validation failed',
                errors: (error as any).issues.map((issue: any) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                }))
            }, 400);
        }

        return c.json({
            success: false,
            message: 'Registration failed. Please try again.'
        }, 500);
    }
});

// Login endpoint
auth.post('/login', async (c) => {
    try {
        const body = await c.req.json();

        // Validate input
        const validatedData = loginSchema.parse(body);

        // Find user by email
        const user = await db.user.findUnique({
            where: { email: validatedData.email }
        });

        if (!user) {
            return c.json({
                success: false,
                message: 'Invalid email or password'
            }, 400);
        }

        // Check password
        const isValidPassword = await comparePassword(validatedData.password, user.passwordHash);

        if (!isValidPassword) {
            return c.json({
                success: false,
                message: 'Invalid email or password'
            }, 400);
        }

        // Update last login
        await db.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });

        // Create login log
        const userAgent = c.req.header('User-Agent') || '';
        const ipAddress = c.req.header('X-Forwarded-For') || c.req.header('X-Real-IP') || 'unknown';

        await db.loginLog.create({
            data: {
                userId: user.id,
                ipAddress,
                userAgent,
                // These would be populated with a GeoIP service in production
                country: null,
                city: null,
                device: null,
                browser: null,
            }
        });

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            email: user.email,
        });

        return c.json({
            success: true,
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                lastLogin: new Date(),
            }
        });

    } catch (error) {
        console.error('Login error:', error);

        if (error instanceof Error && 'issues' in error) {
            // Zod validation error
            return c.json({
                success: false,
                message: 'Validation failed',
                errors: (error as any).issues.map((issue: any) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                }))
            }, 400);
        }

        return c.json({
            success: false,
            message: 'Login failed. Please try again.'
        }, 500);
    }
});

// Get current user profile
auth.get('/me', authMiddleware, async (c) => {
    try {
        const userInfo = c.get('user');

        const user = await db.user.findUnique({
            where: { id: userInfo.userId },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
                lastLogin: true,
            }
        });

        if (!user) {
            return c.json({
                success: false,
                message: 'User not found'
            }, 404);
        }

        return c.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin,
            }
        });

    } catch (error) {
        console.error('Profile fetch error:', error);
        return c.json({
            success: false,
            message: 'Failed to fetch user profile'
        }, 500);
    }
});

export default auth;
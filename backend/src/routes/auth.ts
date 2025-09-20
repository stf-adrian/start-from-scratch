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

        // Get IP address and user agent for logging
        const userAgent = c.req.header('User-Agent') || '';
        const ipAddress = c.req.header('X-Forwarded-For') || c.req.header('X-Real-IP') || 'unknown';

        // Find user by email
        const user = await db.user.findUnique({
            where: { email: validatedData.email }
        });

        if (!user) {
            // Log failed login attempt
            await db.loginLog.create({
                data: {
                    userId: 'unknown', // We don't have a user ID for failed attempts
                    ipAddress,
                    userAgent,
                    country: null,
                    city: null,
                    device: null,
                    browser: null,
                    success: false,
                }
            }).catch(() => { }); // Silently fail if logging fails

            return c.json({
                success: false,
                message: 'Invalid email or password'
            }, 400);
        }

        // Check password
        const isValidPassword = await comparePassword(validatedData.password, user.passwordHash);

        if (!isValidPassword) {
            // Log failed login attempt with user ID
            await db.loginLog.create({
                data: {
                    userId: user.id,
                    ipAddress,
                    userAgent,
                    country: null,
                    city: null,
                    device: null,
                    browser: null,
                    success: false,
                }
            }).catch(() => { }); // Silently fail if logging fails

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

        // Create successful login log
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
                success: true,
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

// Get login analytics data
auth.get('/analytics/logins', authMiddleware, async (c) => {
    try {
        const userInfo = c.get('user');

        // Get login logs for the current user over the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const loginLogs = await db.loginLog.findMany({
            where: {
                userId: userInfo.userId,
                loginTimestamp: {
                    gte: thirtyDaysAgo
                }
            },
            orderBy: {
                loginTimestamp: 'asc'
            },
            select: {
                id: true,
                loginTimestamp: true,
                ipAddress: true,
                userAgent: true,
                country: true,
                city: true,
                device: true,
                browser: true,
            }
        });

        // Group login logs by date for chart data
        const loginsByDate = loginLogs.reduce((acc, log) => {
            const date = log.loginTimestamp.toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Create chart data with all dates in the last 30 days
        const chartData = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            chartData.push({
                date: dateStr,
                count: loginsByDate[dateStr] || 0
            });
        }

        return c.json(chartData);

    } catch (error) {
        console.error('Login analytics error:', error);
        return c.json({
            success: false,
            message: 'Failed to fetch login analytics'
        }, 500);
    }
});

// Get login history with all fields for the table
auth.get('/login-history', authMiddleware, async (c) => {
    try {
        const userInfo = c.get('user');

        const loginHistory = await db.loginLog.findMany({
            where: {
                userId: userInfo.userId
            },
            orderBy: {
                loginTimestamp: 'desc'
            },
            take: 10, // Last 10 logins
            select: {
                id: true,
                userId: true,
                loginTimestamp: true,
                ipAddress: true,
                userAgent: true,
                country: true,
                city: true,
                device: true,
                browser: true,
                success: true,
            }
        });

        return c.json(loginHistory);

    } catch (error) {
        console.error('Login history error:', error);
        return c.json({
            success: false,
            message: 'Failed to fetch login history'
        }, 500);
    }
});

export default auth;
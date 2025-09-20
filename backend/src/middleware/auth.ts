import { Context, Next } from 'hono';
import { verifyToken } from '../lib/auth.js';

export interface UserContext {
    userId: string;
    email: string;
}

export const authMiddleware = async (c: Context, next: Next) => {
    try {
        const authHeader = c.req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return c.json({ success: false, message: 'Authorization token required' }, 401);
        }

        const token = authHeader.substring(7);
        const payload = verifyToken(token);

        // Add user info to context
        c.set('user', payload);

        await next();
    } catch (error) {
        return c.json({ success: false, message: 'Invalid or expired token' }, 401);
    }
};
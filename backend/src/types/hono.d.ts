import { Context } from 'hono';

declare module 'hono' {
    interface ContextVariableMap {
        user: {
            userId: string;
            email: string;
        };
    }
}
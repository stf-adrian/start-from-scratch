import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword, generateToken, verifyToken } from '../src/lib/auth';

describe('Auth utilities', () => {
    it('should hash and compare passwords correctly', async () => {
        const password = 'TestPassword123!';
        const hash = await hashPassword(password);

        expect(hash).toBeDefined();
        expect(hash).not.toBe(password);

        const isValid = await comparePassword(password, hash);
        expect(isValid).toBe(true);

        const isInvalid = await comparePassword('WrongPassword', hash);
        expect(isInvalid).toBe(false);
    });

    it('should generate and verify JWT tokens correctly', () => {
        const payload = {
            userId: 'test-user-id',
            email: 'test@example.com',
        };

        const token = generateToken(payload);
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');

        const decoded = verifyToken(token);
        expect(decoded.userId).toBe(payload.userId);
        expect(decoded.email).toBe(payload.email);
    });
});
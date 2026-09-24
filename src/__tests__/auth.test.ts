import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword, signToken, verifyToken } from '../lib/auth';

describe('Auth Helpers Test Suite', () => {
  it('should hash and compare passwords correctly', async () => {
    const rawPassword = 'superSecretPassword2026';
    const hash = await hashPassword(rawPassword);
    
    expect(hash).not.toBe(rawPassword);
    const isMatch = await comparePassword(rawPassword, hash);
    expect(isMatch).toBe(true);

    const isWrongMatch = await comparePassword('wrongPassword', hash);
    expect(isWrongMatch).toBe(false);
  });

  it('should sign and verify JWT tokens', async () => {
    const payload = {
      id: 'user-uuid-12345',
      name: 'Jayesh Phale',
      email: 'jayesh@edupulse.ai',
      role: 'INSTRUCTOR' as const,
    };

    const token = await signToken(payload);
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(20);

    const verified = await verifyToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.id).toBe(payload.id);
    expect(verified?.email).toBe(payload.email);
    expect(verified?.role).toBe('INSTRUCTOR');
  });
});

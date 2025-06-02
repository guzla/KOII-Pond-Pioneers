import { describe, it, expect } from 'vitest';
import { 
  UserProfileSchema, 
  UserRole, 
  AccountStatus, 
  validateUserProfile, 
  createUserProfile 
} from '../src/models/UserProfile';

describe('UserProfile Model', () => {
  const validProfile = {
    id: 'wallet1234567890',
    username: 'johndoe',
    email: 'john@example.com',
    koiiWalletAddress: 'koiiwallet1234567890',
    role: UserRole.MEMBER,
    status: AccountStatus.ACTIVE,
  };

  it('should validate a complete user profile', () => {
    expect(() => validateUserProfile(validProfile)).not.toThrow();
  });

  it('should create a user profile with defaults', () => {
    const profile = createUserProfile({ 
      id: 'wallet1234567890', 
      koiiWalletAddress: 'koiiwallet1234567890' 
    });

    expect(profile.role).toBe(UserRole.MEMBER);
    expect(profile.status).toBe(AccountStatus.ACTIVE);
    expect(profile.id).toBe('wallet1234567890');
  });

  it('should reject invalid email', () => {
    expect(() => validateUserProfile({
      ...validProfile,
      email: 'invalid-email'
    })).toThrow();
  });

  it('should reject username that is too short', () => {
    expect(() => validateUserProfile({
      ...validProfile,
      username: 'ab'
    })).toThrow();
  });

  it('should reject profile with missing required fields', () => {
    expect(() => validateUserProfile({})).toThrow();
  });

  it('should allow optional fields', () => {
    const profileWithOptionals = {
      ...validProfile,
      bio: 'A short bio',
      socialLinks: {
        twitter: 'https://twitter.com/johndoe'
      }
    };

    expect(() => validateUserProfile(profileWithOptionals)).not.toThrow();
  });
});
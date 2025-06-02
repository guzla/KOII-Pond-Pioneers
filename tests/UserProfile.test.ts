import { describe, it, expect } from 'vitest';
import { UserProfileModel, UserProfileSchema, UserRole } from '../src/models/UserProfile';

describe('UserProfile Model', () => {
  const validProfileData = {
    id: 'test-wallet-address',
    username: 'johndoe',
    role: UserRole.MEMBER,
    email: 'john@example.com',
    reputation: 50
  };

  it('should validate a complete user profile', () => {
    const profile = UserProfileModel.validate(validProfileData);
    expect(profile).toBeDefined();
    expect(profile.username).toBe('johndoe');
    expect(profile.role).toBe(UserRole.MEMBER);
  });

  it('should reject invalid username', () => {
    expect(() => UserProfileModel.validate({
      ...validProfileData,
      username: 'jo' // too short
    })).toThrow();

    expect(() => UserProfileModel.validate({
      ...validProfileData,
      username: 'john doe!' // invalid characters
    })).toThrow();
  });

  it('should set default values', () => {
    const profile = UserProfileModel.validate({
      id: 'test-wallet-address',
      username: 'johndoe'
    });
    
    expect(profile.role).toBe(UserRole.MEMBER);
    expect(profile.reputation).toBe(0);
    expect(profile.preferences?.theme).toBe('light');
  });

  it('should update user profile', () => {
    const originalProfile = UserProfileModel.validate(validProfileData);
    const updatedProfile = UserProfileModel.update(originalProfile, {
      reputation: 75,
      preferences: { theme: 'dark' }
    });

    expect(updatedProfile.reputation).toBe(75);
    expect(updatedProfile.preferences?.theme).toBe('dark');
    expect(updatedProfile.updatedAt).not.toEqual(originalProfile.createdAt);
  });

  it('should reject invalid email', () => {
    expect(() => UserProfileModel.validate({
      ...validProfileData,
      email: 'invalid-email'
    })).toThrow();
  });

  it('should validate complex preferences', () => {
    const profile = UserProfileModel.validate({
      ...validProfileData,
      preferences: {
        theme: 'dark',
        language: 'es',
        notifications: false
      }
    });

    expect(profile.preferences?.theme).toBe('dark');
    expect(profile.preferences?.language).toBe('es');
    expect(profile.preferences?.notifications).toBe(false);
  });
});
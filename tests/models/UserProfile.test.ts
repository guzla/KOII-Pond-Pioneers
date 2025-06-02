import { describe, it, expect } from 'vitest';
import { 
  UserProfileSchema, 
  createUserProfile, 
  validateUserProfile 
} from '../../src/models/UserProfile';

describe('UserProfile Model', () => {
  const validProfileData = {
    id: 'user123456789',
    username: 'fishhead_explorer',
    walletAddress: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123',
    roles: ['buyer'],
    reputation: {
      score: 75,
      totalTransactions: 10,
      successfulTransactions: 8
    }
  };

  it('should create a valid user profile', () => {
    const profile = createUserProfile(validProfileData);
    expect(profile).toBeTruthy();
    expect(profile.username).toBe('fishhead_explorer');
  });

  it('should validate a correct user profile', () => {
    const isValid = validateUserProfile(validProfileData);
    expect(isValid).toBe(true);
  });

  it('should reject invalid usernames', () => {
    const invalidProfiles = [
      { ...validProfileData, username: 'a' }, // Too short
      { ...validProfileData, username: 'very_long_username_that_exceeds_maximum_length' }, // Too long
      { ...validProfileData, username: 'invalid username!' } // Invalid characters
    ];

    invalidProfiles.forEach(profile => {
      expect(validateUserProfile(profile)).toBe(false);
    });
  });

  it('should have default values for optional fields', () => {
    const partialProfile = createUserProfile({
      id: 'user987654321',
      username: 'pond_pioneer',
      walletAddress: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123',
      reputation: {
        score: 50,
        totalTransactions: 0,
        successfulTransactions: 0
      }
    });

    expect(partialProfile.roles).toEqual(['buyer']);
    expect(partialProfile.reputation.score).toBe(50);
  });
});
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
    walletAddress: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefg123456789', // 40 chars
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
    const validationResult = validateUserProfile(validProfileData);
    expect(validationResult.isValid).toBe(true);
  });

  it('should reject invalid usernames', () => {
    const invalidProfiles = [
      { ...validProfileData, username: 'a' }, // Too short
      { ...validProfileData, username: 'very_long_username_that_exceeds_maximum_length' }, // Too long
      { ...validProfileData, username: 'Invalid_Username' }, // Contains uppercase letters
      { ...validProfileData, username: 'invalid username' }, // Contains a space
      { ...validProfileData, username: 'invalid-username' }, // Contains a hyphen
      { ...validProfileData, username: 'héllo_world' }, // Contains non-ASCII characters
      { ...validProfileData, username: 'user!' } // Contains special characters
    ];

    invalidProfiles.forEach(profile => {
      const validationResult = validateUserProfile(profile);
      console.log(`Errors for ${profile.username}:`, validationResult.errors);
      expect(validationResult.isValid).toBe(false, 
        `Validation failed unexpectedly for username: ${profile.username}`
      );
    });
  });

  it('should have default values for optional fields', () => {
    const partialProfile = createUserProfile({
      id: 'user987654321',
      username: 'pond_pioneer',
      walletAddress: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefg123456789',
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
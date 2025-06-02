import { describe, it, expect, beforeEach } from 'vitest';
import { UserProfileManager, UserProfileSchema } from '../src/modules/user-profile';
import { v4 as uuidv4 } from 'uuid';

// Utility function to create a valid test profile
function createTestProfile(overrides = {}) {
  return {
    id: uuidv4(),
    username: 'testuser',
    email: 'test@example.com',
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    ...overrides
  };
}

describe('User Profile Management', () => {
  beforeEach(() => {
    // Reset any potential global state
    const resetMethod = Object.getOwnPropertyDescriptor(UserProfileManager, 'userProfiles')?.get;
    if (resetMethod) {
      const profiles = resetMethod.call(UserProfileManager);
      Object.keys(profiles).forEach(key => delete profiles[key]);
    }
  });

  describe('Profile Creation', () => {
    it('should successfully create a valid user profile', () => {
      const profile = createTestProfile();
      const createdProfile = UserProfileManager.createProfile(profile);
      
      expect(createdProfile).toBeDefined();
      expect(createdProfile.username).toBe(profile.username);
      expect(createdProfile.registeredAt).toBeInstanceOf(Date);
    });

    it('should throw error for invalid profile data', () => {
      expect(() => 
        UserProfileManager.createProfile(createTestProfile({ username: 'a' }))
      ).toThrow('Username must be at least 3 characters');

      expect(() => 
        UserProfileManager.createProfile(createTestProfile({ email: 'invalid-email' }))
      ).toThrow('Invalid email address');
    });
  });

  describe('Profile Retrieval', () => {
    it('should retrieve an existing profile', () => {
      const profile = createTestProfile();
      const createdProfile = UserProfileManager.createProfile(profile);
      
      const retrievedProfile = UserProfileManager.getProfile(createdProfile.id);
      expect(retrievedProfile).toEqual(createdProfile);
    });

    it('should throw error when retrieving non-existent profile', () => {
      expect(() => 
        UserProfileManager.getProfile('non-existent-id')
      ).toThrow('User profile not found');
    });
  });

  describe('Profile Update', () => {
    it('should update an existing profile', () => {
      const profile = createTestProfile();
      const createdProfile = UserProfileManager.createProfile(profile);
      
      const updatedProfile = UserProfileManager.updateProfile(createdProfile.id, {
        username: 'newusername',
        bio: 'Updated test bio'
      });

      expect(updatedProfile.username).toBe('newusername');
      expect(updatedProfile.bio).toBe('Updated test bio');
      expect(updatedProfile.updatedAt.getTime()).toBeGreaterThan(createdProfile.updatedAt.getTime());
    });

    it('should throw error when updating with invalid data', () => {
      const profile = createTestProfile();
      const createdProfile = UserProfileManager.createProfile(profile);
      
      expect(() => 
        UserProfileManager.updateProfile(createdProfile.id, { username: 'a' })
      ).toThrow('Username must be at least 3 characters');
    });
  });

  describe('Profile Deletion', () => {
    it('should delete an existing profile', () => {
      const profile = createTestProfile();
      const createdProfile = UserProfileManager.createProfile(profile);
      
      UserProfileManager.deleteProfile(createdProfile.id);
      
      expect(() => 
        UserProfileManager.getProfile(createdProfile.id)
      ).toThrow('User profile not found');
    });

    it('should throw error when deleting non-existent profile', () => {
      expect(() => 
        UserProfileManager.deleteProfile('non-existent-id')
      ).toThrow('User profile not found');
    });
  });
});
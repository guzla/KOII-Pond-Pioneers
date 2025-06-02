import { describe, it, expect } from 'vitest';
import { UserProfileSchema, userProfileManager } from '../src/models/UserProfile';
import { v4 as uuidv4 } from 'uuid';

describe('User Profile Management', () => {
  const validProfile = {
    id: uuidv4(),
    username: 'fishhead42',
    walletAddress: '0x1234567890abcdef',
    email: 'user@koii.network',
    bio: 'Koii Pond Pioneer',
    avatarUrl: 'https://example.com/avatar.png'
  };

  it('should create a valid user profile', () => {
    const profile = userProfileManager.createProfile(validProfile);
    expect(profile).toBeDefined();
    expect(profile.username).toBe('fishhead42');
  });

  it('should retrieve an existing profile', () => {
    const profile = userProfileManager.createProfile(validProfile);
    const retrievedProfile = userProfileManager.getProfile(profile.id);
    expect(retrievedProfile).toEqual(profile);
  });

  it('should update an existing profile', () => {
    const profile = userProfileManager.createProfile(validProfile);
    const updatedProfile = userProfileManager.updateProfile(profile.id, { bio: 'Updated Bio' });
    expect(updatedProfile.bio).toBe('Updated Bio');
    expect(updatedProfile.updatedAt).not.toEqual(profile.updatedAt);
  });

  it('should delete an existing profile', () => {
    const profile = userProfileManager.createProfile(validProfile);
    userProfileManager.deleteProfile(profile.id);
    const retrievedProfile = userProfileManager.getProfile(profile.id);
    expect(retrievedProfile).toBeUndefined();
  });

  it('should validate profile schema', () => {
    const invalidProfile = {
      id: uuidv4(),
      username: 'ab', // Too short
      walletAddress: '0x1234'
    };

    expect(() => UserProfileSchema.parse(invalidProfile)).toThrow();
  });
});
import { describe, it, expect, beforeEach } from 'vitest';
import { UserProfileService, userProfileService } from '../src/services/UserProfileService';

describe('UserProfileService', () => {
  let service: UserProfileService;

  beforeEach(() => {
    service = new UserProfileService();
  });

  it('should create a new user profile', () => {
    const profile = service.createProfile(
      '0x1234567890abcdef', 
      'testuser', 
      'test@example.com'
    );

    expect(profile).toBeDefined();
    expect(profile.walletAddress).toBe('0x1234567890abcdef');
    expect(profile.username).toBe('testuser');
    expect(profile.email).toBe('test@example.com');
  });

  it('should prevent creating duplicate profiles', () => {
    const walletAddress = '0x1234567890abcdef';
    service.createProfile(walletAddress);

    expect(() => {
      service.createProfile(walletAddress);
    }).toThrow('Profile already exists for this wallet');
  });

  it('should find profile by wallet address', () => {
    const walletAddress = '0x1234567890abcdef';
    const profile = service.createProfile(walletAddress);
    
    const foundProfile = service.findProfileByWallet(walletAddress);
    expect(foundProfile).toBeDefined();
    expect(foundProfile?.id).toBe(profile.id);
  });

  it('should update an existing profile', () => {
    const profile = service.createProfile('0x1234567890abcdef');
    
    const updatedProfile = service.updateProfile(profile.id, {
      username: 'newusername',
      metadata: { bio: 'Test bio' }
    });

    expect(updatedProfile.username).toBe('newusername');
    expect(updatedProfile.metadata).toEqual({ bio: 'Test bio' });
    expect(updatedProfile.updatedAt).toBeGreaterThan(profile.createdAt);
  });

  it('should delete a profile', () => {
    const profile = service.createProfile('0x1234567890abcdef');
    
    service.deleteProfile(profile.id);
    
    expect(() => {
      service.findProfileByWallet('0x1234567890abcdef');
    }).toBeUndefined();
  });

  it('should handle profile creation with minimal data', () => {
    const profile = service.createProfile('0x1234567890abcdef');

    expect(profile.walletAddress).toBe('0x1234567890abcdef');
    expect(profile.username).toBeUndefined();
    expect(profile.email).toBeUndefined();
  });

  it('should prevent profile creation without wallet address', () => {
    expect(() => {
      service.createProfile('');
    }).toThrow('Wallet address is required');
  });
});
import { describe, it, expect, beforeEach } from 'vitest';
import { UserProfileService } from '../src/services/UserProfileService';

describe('UserProfileService', () => {
  let service: UserProfileService;
  const validWalletAddress = '0x1234567890abcdef1234567890abcdef12345678';

  beforeEach(() => {
    service = new UserProfileService();
  });

  describe('Authentication', () => {
    it('should validate wallet address format', () => {
      expect(service.authenticateWallet(validWalletAddress)).toBe(true);
      expect(service.authenticateWallet('invalid_address')).toBe(false);
    });
  });

  describe('Profile Creation', () => {
    it('should create a profile with valid data', () => {
      const profile = service.createProfile({
        walletAddress: validWalletAddress,
        username: 'testuser',
        email: 'test@example.com'
      });

      expect(profile).toBeDefined();
      expect(profile.walletAddress).toBe(validWalletAddress);
      expect(profile.username).toBe('testuser');
      expect(profile.email).toBe('test@example.com');
    });

    it('should prevent creating profile with invalid wallet address', () => {
      expect(() => {
        service.createProfile({
          walletAddress: 'invalid_address',
          username: 'testuser'
        });
      }).toThrow('Wallet authentication failed');
    });

    it('should prevent creating duplicate profiles', () => {
      service.createProfile({
        walletAddress: validWalletAddress
      });

      expect(() => {
        service.createProfile({
          walletAddress: validWalletAddress
        });
      }).toThrow('Profile already exists for this wallet');
    });

    it('should validate username length', () => {
      expect(() => {
        service.createProfile({
          walletAddress: validWalletAddress,
          username: 'a' // Too short
        });
      }).toThrow('Validation Error');

      expect(() => {
        service.createProfile({
          walletAddress: validWalletAddress,
          username: 'a'.repeat(31) // Too long
        });
      }).toThrow('Validation Error');
    });
  });

  describe('Profile Update', () => {
    it('should update profile with valid data', () => {
      const profile = service.createProfile({
        walletAddress: validWalletAddress
      });

      const updatedProfile = service.updateProfile(profile.id, {
        username: 'newusername',
        metadata: { bio: 'Updated bio' }
      });

      expect(updatedProfile.username).toBe('newusername');
      expect(updatedProfile.metadata).toEqual({ bio: 'Updated bio' });
      expect(updatedProfile.updatedAt).toBeGreaterThan(profile.createdAt);
    });

    it('should prevent updating with invalid data', () => {
      const profile = service.createProfile({
        walletAddress: validWalletAddress
      });

      expect(() => {
        service.updateProfile(profile.id, {
          username: 'a' // Too short
        });
      }).toThrow('Validation Error');
    });
  });

  describe('Profile Deletion', () => {
    it('should delete an existing profile', () => {
      const profile = service.createProfile({
        walletAddress: validWalletAddress
      });

      service.deleteProfile(profile.id);

      const foundProfile = service.findProfileByWallet(validWalletAddress);
      expect(foundProfile).toBeUndefined();
    });

    it('should throw error when deleting non-existent profile', () => {
      expect(() => {
        service.deleteProfile('non-existent-id');
      }).toThrow('Profile not found');
    });
  });
});
import { v4 as uuidv4 } from 'uuid';

/**
 * Represents a user profile in the Koii Pond Pioneers marketplace
 */
export interface UserProfile {
  id: string;
  walletAddress: string;
  username?: string;
  email?: string;
  createdAt: number;
  updatedAt: number;
  metadata?: Record<string, unknown>;
}

/**
 * Service for managing user profiles in a decentralized manner
 */
export class UserProfileService {
  private profiles: Map<string, UserProfile> = new Map();

  /**
   * Create a new user profile
   * @param walletAddress User's blockchain wallet address
   * @param username Optional username
   * @param email Optional email
   * @returns Created user profile
   */
  createProfile(
    walletAddress: string, 
    username?: string, 
    email?: string
  ): UserProfile {
    // Validate wallet address
    if (!walletAddress || walletAddress.trim() === '') {
      throw new Error('Wallet address is required');
    }

    // Check for existing profile
    const existingProfile = this.findProfileByWallet(walletAddress);
    if (existingProfile) {
      throw new Error('Profile already exists for this wallet');
    }

    const now = Date.now();
    const newProfile: UserProfile = {
      id: uuidv4(),
      walletAddress,
      username: username?.trim(),
      email: email?.trim(),
      createdAt: now,
      updatedAt: now,
      metadata: {}
    };

    this.profiles.set(newProfile.id, newProfile);
    return newProfile;
  }

  /**
   * Find a profile by wallet address
   * @param walletAddress Wallet address to search
   * @returns User profile or undefined
   */
  findProfileByWallet(walletAddress: string): UserProfile | undefined {
    return Array.from(this.profiles.values())
      .find(profile => profile.walletAddress === walletAddress);
  }

  /**
   * Update an existing user profile
   * @param id Profile ID
   * @param updates Partial update to the profile
   * @returns Updated profile
   */
  updateProfile(
    id: string, 
    updates: Partial<Omit<UserProfile, 'id' | 'walletAddress' | 'createdAt'>>
  ): UserProfile {
    const profile = this.profiles.get(id);
    if (!profile) {
      throw new Error('Profile not found');
    }

    const updatedProfile = {
      ...profile,
      ...updates,
      updatedAt: Date.now()
    };

    this.profiles.set(id, updatedProfile);
    return updatedProfile;
  }

  /**
   * Delete a user profile
   * @param id Profile ID to delete
   */
  deleteProfile(id: string): void {
    const exists = this.profiles.delete(id);
    if (!exists) {
      throw new Error('Profile not found');
    }
  }

  /**
   * Get all profiles
   * @returns Array of user profiles
   */
  getAllProfiles(): UserProfile[] {
    return Array.from(this.profiles.values());
  }
}

// Export a singleton instance for consistent state management
export const userProfileService = new UserProfileService();
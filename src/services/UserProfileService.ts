import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';

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
 * Service for managing user profiles with validation and authentication
 */
export class UserProfileService {
  private profiles: Map<string, UserProfile> = new Map();

  // Validation schema for profile creation
  private createProfileSchema = Joi.object({
    walletAddress: Joi.string()
      .pattern(/^(0x)?[0-9a-fA-F]{40}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid wallet address format',
        'any.required': 'Wallet address is required'
      }),
    username: Joi.string()
      .min(3)
      .max(30)
      .optional(),
    email: Joi.string()
      .email()
      .optional(),
    metadata: Joi.object().optional()
  });

  // Validation schema for profile updates
  private updateProfileSchema = Joi.object({
    username: Joi.string()
      .min(3)
      .max(30)
      .optional(),
    email: Joi.string()
      .email()
      .optional(),
    metadata: Joi.object().optional()
  });

  /**
   * Authenticate a wallet address
   * @param walletAddress Wallet address to authenticate
   * @returns Boolean indicating authentication status
   */
  authenticateWallet(walletAddress: string): boolean {
    // In a real-world scenario, this would involve blockchain signature verification
    // For this example, we'll do a basic format check
    const walletRegex = /^(0x)?[0-9a-fA-F]{40}$/;
    return walletRegex.test(walletAddress);
  }

  /**
   * Create a new user profile with validation
   * @param profileData Profile creation data
   * @returns Created user profile
   * @throws ValidationError if data is invalid
   */
  createProfile(profileData: {
    walletAddress: string;
    username?: string;
    email?: string;
    metadata?: Record<string, unknown>;
  }): UserProfile {
    // Validate wallet authentication
    if (!this.authenticateWallet(profileData.walletAddress)) {
      throw new Error('Wallet authentication failed');
    }

    // Validate input data
    const { error } = this.createProfileSchema.validate(profileData);
    if (error) {
      throw new Error(`Validation Error: ${error.details[0].message}`);
    }

    // Check for existing profile
    const existingProfile = this.findProfileByWallet(profileData.walletAddress);
    if (existingProfile) {
      throw new Error('Profile already exists for this wallet');
    }

    const now = Date.now();
    const newProfile: UserProfile = {
      id: uuidv4(),
      walletAddress: profileData.walletAddress,
      username: profileData.username?.trim(),
      email: profileData.email?.trim(),
      createdAt: now,
      updatedAt: now,
      metadata: profileData.metadata || {}
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

    // Validate update data
    const { error } = this.updateProfileSchema.validate(updates);
    if (error) {
      throw new Error(`Validation Error: ${error.details[0].message}`);
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
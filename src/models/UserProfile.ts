import { z } from 'zod';

/**
 * Enum for user roles in the Koii Pond Pioneers marketplace
 */
export enum UserRole {
  MEMBER = 'member',
  TRADER = 'trader',
  ADMIN = 'admin'
}

/**
 * Zod schema for validating user profile data
 * Provides comprehensive validation for user profiles
 */
export const UserProfileSchema = z.object({
  // Unique identifier, likely a wallet address
  id: z.string().min(1, 'User ID is required'),
  
  // Basic user information
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  
  // Optional display name
  displayName: z.string()
    .max(50, 'Display name must be less than 50 characters')
    .optional(),
  
  // User's role in the marketplace
  role: z.nativeEnum(UserRole).default(UserRole.MEMBER),
  
  // Contact information
  email: z.string().email('Invalid email address').optional(),
  
  // Reputation and trust metrics
  reputation: z.number()
    .min(0, 'Reputation cannot be negative')
    .max(100, 'Reputation cannot exceed 100')
    .default(0),
  
  // User preferences and settings
  preferences: z.object({
    theme: z.enum(['light', 'dark']).default('light'),
    language: z.string().default('en'),
    notifications: z.boolean().default(true)
  }).default({}),
  
  // Timestamps for account management
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

/**
 * Type inference for UserProfile based on the Zod schema
 */
export type UserProfile = z.infer<typeof UserProfileSchema>;

/**
 * User Profile Model with validation and utility methods
 */
export class UserProfileModel {
  /**
   * Validate a user profile
   * @param data Partial or full user profile data
   * @returns Validated user profile
   * @throws Validation error if data is invalid
   */
  static validate(data: Partial<UserProfile>): UserProfile {
    return UserProfileSchema.parse(data);
  }

  /**
   * Partially update a user profile
   * @param existingProfile Existing user profile
   * @param updateData Partial update data
   * @returns Updated and validated user profile
   */
  static update(existingProfile: UserProfile, updateData: Partial<UserProfile>): UserProfile {
    const mergedProfile = { 
      ...existingProfile, 
      ...updateData, 
      updatedAt: new Date() 
    };
    return this.validate(mergedProfile);
  }
}
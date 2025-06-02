import { z } from 'zod';

// User Profile Schema with comprehensive validation
export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(50, { message: "Username cannot exceed 50 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" }),
  
  email: z.string().email({ message: "Invalid email address" }),
  
  walletAddress: z.string()
    .min(32, { message: "Invalid wallet address" })
    .max(64, { message: "Invalid wallet address" }),
  
  profileImage: z.string().url().optional(),
  
  bio: z.string()
    .max(500, { message: "Bio cannot exceed 500 characters" })
    .optional(),
  
  socialLinks: z.object({
    twitter: z.string().url().optional(),
    discord: z.string().optional(),
    telegram: z.string().optional()
  }).optional(),
  
  registeredAt: z.date(),
  updatedAt: z.date()
});

// Type definition for User Profile
export type UserProfile = z.infer<typeof UserProfileSchema>;

// In-memory user profile storage (for demonstration)
const userProfiles: Record<string, UserProfile> = {};

export class UserProfileManager {
  // Create a new user profile
  static createProfile(profileData: Omit<UserProfile, 'registeredAt' | 'updatedAt'>): UserProfile {
    try {
      const validatedProfile = UserProfileSchema.parse({
        ...profileData,
        registeredAt: new Date(),
        updatedAt: new Date()
      });
      
      if (userProfiles[validatedProfile.id]) {
        throw new Error('User profile with this ID already exists');
      }
      
      userProfiles[validatedProfile.id] = validatedProfile;
      return validatedProfile;
    } catch (error) {
      throw new Error(`Profile creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Retrieve a user profile by ID
  static getProfile(userId: string): UserProfile {
    const profile = userProfiles[userId];
    if (!profile) {
      throw new Error('User profile not found');
    }
    return profile;
  }

  // Update an existing user profile
  static updateProfile(userId: string, updateData: Partial<Omit<UserProfile, 'id' | 'registeredAt'>>): UserProfile {
    const existingProfile = this.getProfile(userId);
    
    try {
      const updatedProfile = UserProfileSchema.parse({
        ...existingProfile,
        ...updateData,
        updatedAt: new Date()
      });
      
      userProfiles[userId] = updatedProfile;
      return updatedProfile;
    } catch (error) {
      throw new Error(`Profile update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Delete a user profile
  static deleteProfile(userId: string): void {
    if (!userProfiles[userId]) {
      throw new Error('User profile not found');
    }
    delete userProfiles[userId];
  }
}
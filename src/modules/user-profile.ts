import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

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

// In-memory user profile storage with better encapsulation
class UserProfileStore {
  private profiles: Record<string, UserProfile> = {};

  add(profile: UserProfile): void {
    this.profiles[profile.id] = profile;
  }

  get(id: string): UserProfile | undefined {
    return this.profiles[id];
  }

  update(id: string, profile: UserProfile): void {
    this.profiles[id] = profile;
  }

  delete(id: string): void {
    delete this.profiles[id];
  }

  clear(): void {
    this.profiles = {};
  }
}

export class UserProfileManager {
  private static userProfiles = new UserProfileStore();

  // Create a new user profile
  static createProfile(profileData: Omit<UserProfile, 'registeredAt' | 'updatedAt'>): UserProfile {
    try {
      // Ensure unique ID
      const profileId = uuidv4();
      
      const validatedProfile = UserProfileSchema.parse({
        ...profileData,
        id: profileId,
        registeredAt: new Date(),
        updatedAt: new Date()
      });
      
      // Check for existing profile
      if (this.userProfiles.get(profileId)) {
        throw new Error('User profile with this ID already exists');
      }
      
      this.userProfiles.add(validatedProfile);
      return validatedProfile;
    } catch (error) {
      throw new Error(`Profile creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Retrieve a user profile by ID
  static getProfile(userId: string): UserProfile {
    const profile = this.userProfiles.get(userId);
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
      
      this.userProfiles.update(userId, updatedProfile);
      return updatedProfile;
    } catch (error) {
      throw new Error(`Profile update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Delete a user profile
  static deleteProfile(userId: string): void {
    if (!this.userProfiles.get(userId)) {
      throw new Error('User profile not found');
    }
    this.userProfiles.delete(userId);
  }

  // Method for testing: Reset user profiles
  static resetProfiles(): void {
    this.userProfiles.clear();
  }
}
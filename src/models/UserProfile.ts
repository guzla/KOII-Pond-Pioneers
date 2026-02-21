import { z } from 'zod';

// User Profile Validation Schema
export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(50),
  walletAddress: z.string(),
  email: z.string().email().optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

// In-memory storage (replace with persistent storage in production)
export class UserProfileManager {
  private profiles: Map<string, UserProfile> = new Map();

  createProfile(profile: Omit<UserProfile, 'createdAt' | 'updatedAt'>): UserProfile {
    const now = new Date();
    const newProfile: UserProfile = {
      ...profile,
      createdAt: now,
      updatedAt: now
    };

    UserProfileSchema.parse(newProfile); // Validate profile
    this.profiles.set(newProfile.id, newProfile);
    return newProfile;
  }

  getProfile(id: string): UserProfile | undefined {
    return this.profiles.get(id);
  }

  updateProfile(id: string, updates: Partial<UserProfile>): UserProfile {
    const existingProfile = this.profiles.get(id);
    if (!existingProfile) {
      throw new Error('Profile not found');
    }

    const updatedProfile = {
      ...existingProfile,
      ...updates,
      updatedAt: new Date()
    };

    UserProfileSchema.parse(updatedProfile); // Validate updated profile
    this.profiles.set(id, updatedProfile);
    return updatedProfile;
  }

  deleteProfile(id: string): void {
    if (!this.profiles.has(id)) {
      throw new Error('Profile not found');
    }
    this.profiles.delete(id);
  }
}

export const userProfileManager = new UserProfileManager();
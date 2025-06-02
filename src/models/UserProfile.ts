import { z } from 'zod';

// Enum for user roles
export enum UserRole {
  MEMBER = 'member',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}

// Enum for account status
export enum AccountStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  INACTIVE = 'inactive'
}

// User Profile Schema using Zod for validation
export const UserProfileSchema = z.object({
  // Unique identifier, typically a wallet address
  id: z.string().min(10).max(100),
  
  // Optional username with constraints
  username: z.string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(30, { message: "Username cannot exceed 30 characters" })
    .optional(),
  
  // Email with validation
  email: z.string().email().optional(),
  
  // Profile image URL
  profileImage: z.string().url().optional(),
  
  // User role with default set to MEMBER
  role: z.nativeEnum(UserRole).default(UserRole.MEMBER),
  
  // Account status
  status: z.nativeEnum(AccountStatus).default(AccountStatus.ACTIVE),
  
  // Timestamps for tracking
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  
  // Optional bio
  bio: z.string().max(500).optional(),
  
  // Social links validation
  socialLinks: z.object({
    twitter: z.string().url().optional(),
    discord: z.string().optional(),
  }).optional(),
  
  // Koii-specific attributes
  koiiWalletAddress: z.string().min(10).max(100),
  
  // Assets owned by the user (references)
  ownedAssets: z.array(z.string()).optional(),
});

// Type inference for TypeScript
export type UserProfile = z.infer<typeof UserProfileSchema>;

// Function to validate a user profile
export function validateUserProfile(profile: unknown): UserProfile {
  return UserProfileSchema.parse(profile);
}

// Function to create a new user profile with defaults
export function createUserProfile(partialProfile: Partial<UserProfile>): UserProfile {
  const defaultProfile: UserProfile = {
    id: partialProfile.id || '',
    koiiWalletAddress: partialProfile.koiiWalletAddress || '',
    role: partialProfile.role || UserRole.MEMBER,
    status: partialProfile.status || AccountStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return validateUserProfile({ ...defaultProfile, ...partialProfile });
}
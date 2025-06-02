import { z } from 'zod';

// User Profile Validation Schema
export const UserProfileSchema = z.object({
  // Unique identifier for the user (could be wallet address)
  id: z.string().min(10).max(100),
  
  // Basic user information
  username: z.string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(50, { message: "Username cannot exceed 50 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" }),
  
  // Optional display name
  displayName: z.string().max(100).optional(),
  
  // User's public wallet address
  walletAddress: z.string()
    .regex(/^[1-9A-HJ-NP-Za-km-z]+$/, { message: "Invalid wallet address format" }),
  
  // User's roles/permissions in the marketplace
  roles: z.array(z.enum(['buyer', 'seller', 'admin', 'moderator'])).default(['buyer']),
  
  // User reputation and trust metrics
  reputation: z.object({
    score: z.number().int().min(0).max(100).default(50),
    totalTransactions: z.number().int().min(0).default(0),
    successfulTransactions: z.number().int().min(0).default(0)
  }),
  
  // Contact and social information
  contact: z.object({
    email: z.string().email().optional(),
    socialLinks: z.record(z.string(), z.string()).optional()
  }).optional(),
  
  // Timestamp fields
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

// Type inference from the schema
export type UserProfile = z.infer<typeof UserProfileSchema>;

// Function to create a new user profile with validation
export function createUserProfile(data: Partial<UserProfile>): UserProfile {
  return UserProfileSchema.parse({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

// Validation function
export function validateUserProfile(profile: unknown): boolean {
  try {
    UserProfileSchema.parse(profile);
    return true;
  } catch {
    return false;
  }
}
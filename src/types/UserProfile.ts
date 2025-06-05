import { z } from 'zod';

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(50),
  email: z.string().email().optional(),
  displayName: z.string().max(100).optional(),
  avatarUrl: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  walletAddress: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isActive: z.boolean().default(true)
});

export type UserProfile = z.infer<typeof UserProfileSchema>;
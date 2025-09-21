import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export const loginSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(6),
  })
  .refine((data) => data.name || data.email, {
    message: 'Either name or email is required',
  });

export const singleUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  photo: z.string().nullable(),
});

export const paramIdSchema = z.object({
  id: z.string(),
});

export const resetPasswordSchema = z
  .object({
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password and Confirm Password must match',
  });

export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  bio: z.string().max(100).optional(),
});

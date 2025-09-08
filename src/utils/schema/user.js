import z from 'zod';

export const registerSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export const loginSchema = registerSchema.pick({
  email: true,
  password: true,
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

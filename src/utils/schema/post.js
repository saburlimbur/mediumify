import { z } from 'zod';

import { TopicsType } from '@prisma/client';

export const createPostSchema = z.object({
  title: z.string(),
  description: z.string(),
  // photo: z.string().nullable(),
  topics: z.enum(TopicsType),
});

export const paramIdSchema = z.object({
  id: z.string(),
});

export const updatePostSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  photo: z.string().optional(),
  topics: z.enum(TopicsType).optional(),
});

import { z } from 'zod';

import { TopicsType } from '@prisma/client';

export const createPostSchema = z.object({
  title: z.string(),
  description: z.string(),
  // photo: z.string().nullable(),
  topics: z.enum(TopicsType),
});

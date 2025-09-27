import { z } from 'zod';

export const saveLibrarySchema = z.object({
  postId: z.string(),
});

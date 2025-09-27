import { request, response } from 'express';
import * as libraryServices from '../services/libraryServices';
import { saveLibrarySchema } from '../utils/schema/library';

export const saveLibraryController = async (req = request, res = response, next) => {
  try {
    const parse = saveLibrarySchema.safeParse(req.body);

    if (!parse.success) {
      const errorMessage = parse.error.issues.map((err) => `${err.path} - ${err.message}`);

      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        detail: errorMessage,
      });
    }

    const userId = req.user.id;
    const { postId } = parse.data;

    const result = await libraryServices.saveLibrary(userId, postId);

    return res.status(200).json({
      success: true,
      message: 'Post saved to library',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

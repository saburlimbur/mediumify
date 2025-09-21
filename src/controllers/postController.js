import { request, response } from 'express';
import * as postServices from '../services/postServices';
import fs from 'fs';
import { createPostSchema } from '../utils/schema/post';

export const createPost = async (req = request, res = response, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    const parse = createPostSchema.safeParse(req.body);

    if (!parse.success) {
      const errorMessage = parse.error.issues.map((err) => `${err.path} - ${err.message}`);
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        detail: errorMessage,
      });
    }

    const newCreatePost = await postServices.createPost({
      ...parse.data,
      photo: req.file.filename,
      authorId: req.user.id, // ambil dari middleware
    });

    return res.json({
      success: true,
      message: 'Post created successfully',
      data: newCreatePost,
    });
  } catch (error) {
    next(error);
  }
};

export const getSinglePost = async (req = request, res = response, next) => {
  try {
    const { id } = req.params;

    const post = await postServices.singlePost({ id });

    return res.json({
      success: true,
      message: 'Get single post successfully',
      data: post,
    });
  } catch (error) {
    if (error.message === 'Post id not found!') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

export const listsUserController = async (req = request, res = response, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const posts = await postServices.listPosts({
      page: Number(page),
      limit: Number(limit),
      search,
    });

    return res.status(200).json({
      success: true,
      message: 'List of posts retrieved successfully',
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

import express from 'express';
import multer from 'multer';
import { storagePostPhoto } from '../utils/multer';

import verifyToken from '../middlewares/verifyToken';
import * as postController from '../controllers/postController';

const postRoutes = express.Router();

const uploadPhoto = multer({
  storage: storagePostPhoto,
  fileFilter: (req, file, callback) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error(), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

postRoutes.post('/post/create', verifyToken, uploadPhoto.single('photo'), postController.createPost);

postRoutes.get('/post/:id', postController.getSinglePost);
postRoutes.get('/posts', verifyToken, postController.listsUserController);

export default postRoutes;

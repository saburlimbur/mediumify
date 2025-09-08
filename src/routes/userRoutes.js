import express from 'express';
import multer from 'multer';

import { storageUserPhoto } from '../utils/multer';
import * as userController from '../controllers/userController';
import verifyToken from '../middlewares/verifyToken';

const userRoutes = express.Router();

const uploadPhoto = multer({
  storage: storageUserPhoto,
  fileFilter: (req, file, callback) => {
    if (file.mimetype.startsWith('image/')) {
      callback(null, false);
    }

    callback(null, true);
  },
});

userRoutes.post('/auth/register', uploadPhoto.single('photo'), userController.registerController);
userRoutes.post('/auth/login', userController.loginController);

userRoutes.get('/auth/single_user/:id', verifyToken, userController.singleUserController);
userRoutes.get('/users', verifyToken, userController.listUsersController);

export default userRoutes;

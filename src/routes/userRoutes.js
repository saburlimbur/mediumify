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

userRoutes.post('/auth/reset-password', userController.requestEmailReset);

userRoutes.put('/auth/reset-password/:tokenId', userController.updatePassword);
userRoutes.put('/user/update/:id', verifyToken, uploadPhoto.single('photo'), userController.updateUserController);

userRoutes.get('/auth/single_user/:id', verifyToken, userController.singleUserController);
userRoutes.get('/users', verifyToken, userController.listUsersController);
userRoutes.get('/user/profile', verifyToken, userController.profileUserController);

userRoutes.delete('/user/delete/:id', verifyToken, userController.deleteUserController);

export default userRoutes;

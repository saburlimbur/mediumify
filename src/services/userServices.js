import * as userRepositories from '../repositories/userRepositores';

import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { transport } from '../utils/transport';
import { resetPasswordMail } from '../utils/mailTemplate';

export const registerUser = async ({ name, email, password, file }) => {
  const emailExist = await userRepositories.isEmailExist(email);

  if (emailExist) {
    if (file && file.path) {
      fs.unlink(path.resolve(file.path), (err) => {
        if (err) console.error(err);
      });
    }
    throw new Error('Email already taken');
  }

  const user = await userRepositories.createUser({
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    photo: file?.filename ?? null,
  });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY ?? '', {
    expiresIn: '3 days',
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    photo: user.photo,
    token,
  };
};

export const loginUser = async ({ name, email, password }) => {
  const identifier = email ?? name;

  const user = await userRepositories.findUserByEmailOrName(identifier);

  if (!user) {
    throw new Error('User not found!');
  }

  const isValid = bcrypt.compareSync(password, user.password);
  if (!isValid) {
    throw new Error('Invalid credentials!');
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY ?? '', {
    expiresIn: '3 days',
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    photo: user.photo,
    token,
  };
};

export const singleUser = async ({ id }) => {
  const userId = await userRepositories.findUniqueUserId(id);

  if (!userId) {
    throw new Error('User id not found!');
  }

  const user = await userRepositories.findUserById(id);

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    photo: user.photo,
    bio: user.bio,
    // token: undefined,
    posts: user.Post || [],
  };
};

export const listUsers = async ({ page = 1, limit = 10, search = '' }) => {
  const usersData = await userRepositories.listsUsers({
    skip: (page - 1) * limit,
    take: limit,
    search,
  });

  return usersData.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    photo: user.photo,
    bio: user.bio,
  }));
};

export const getEmailReset = async (email) => {
  try {
    const { token } = await userRepositories.createPasswordReset(email);
    const resetLink = `${process.env.RESET_PASSWORD_LINK}${token}`;

    const mailOptions = resetPasswordMail(email, resetLink);
    const result = await transport.sendMail(mailOptions);

    // console.log(result.messageId);
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updatePassword = async (data, token) => {
  const tokenData = await userRepositories.findResetDataByToken(token);

  if (!tokenData) {
    throw new Error('Token reset invalid!');
  }

  await userRepositories.updatePassword(tokenData.user.email, bcrypt.hashSync(data.password, 12));

  await userRepositories.deleteTokenResetById(tokenData.id);

  return true;
};

export const updateUser = async (id, { name, email, photo, bio, file }) => {
  const existingUser = await userRepositories.findUniqueUserId(id);

  if (!existingUser) {
    throw new Error('User not found!');
  }

  if (email && email !== existingUser.email) {
    const emailExists = await userRepositories.isEmailExist(email);
    if (emailExists) {
      if (file && file.path) {
        fs.unlink(path.resolve(file.path), (err) => {
          if (err) console.error(err);
        });
      }
      throw new Error('Email already taken by another user');
    }
  }

  const updateData = {};

  if (name !== undefined) updateData.name = name;
  if (email !== undefined) updateData.email = email;
  if (bio !== undefined) updateData.bio = bio;

  if (file && file.filename) {
    updateData.photo = file.filename;

    if (existingUser.photo && existingUser.photo !== 'default.jpg') {
      const oldPhotoPath = path.join('uploads', existingUser.photo);
      fs.unlink(oldPhotoPath, (err) => {
        if (err) console.error('Error deleting old photo:', err);
      });
    }
  } else if (photo !== undefined) {
    updateData.photo = photo;
  }

  const updatedUser = await userRepositories.updateUserById(id, updateData);

  return {
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    photo: updatedUser.photo,
    bio: updatedUser.bio,
  };
};

export const deleteUser = async (id) => {
  const user = await userRepositories.findUniqueUserId(id);

  if (!user) {
    throw new Error('User not found!');
  }

  const userWithPosts = await userRepositories.findUserById(id);

  if (user.photo && user.photo !== 'default.jpg' && user.photo !== null) {
    const userPhotoPath = path.resolve(__dirname, `../../public/assets/uploads/users/${user.photo}`);

    if (fs.existsSync(userPhotoPath)) {
      fs.unlinkSync(userPhotoPath);
    }
  }

  // delete from directory path
  if (userWithPosts.Post && userWithPosts.Post.length > 0) {
    userWithPosts.Post.forEach((post) => {
      if (post.photo) {
        const postPhotoPath = path.resolve(__dirname, `../../public/assets/uploads/posts/${post.photo}`);

        if (fs.existsSync(postPhotoPath)) {
          fs.unlinkSync(postPhotoPath);
        }
      }
    });
  }

  await userRepositories.deleteUser(id);

  return true;
};

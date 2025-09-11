import * as userRepositories from '../repositories/userRepositores';

import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { mailtrap, sender } from '../utils/mailtrap';
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

export const loginUser = async ({ email, password }) => {
  const emailExist = await userRepositories.isEmailExist(email);

  if (!emailExist) {
    throw new Error('Email not registered!');
  }

  const user = await userRepositories.findUserByEmail(email);

  if (!user) {
    throw new Error('User not found!');
  }

  if (!bcrypt.compareSync(password, user.password)) {
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
  const userId = await userRepositories.getUserById(id);

  if (!userId) {
    throw new Error('User id not found!');
  }

  const user = await userRepositories.findUserById(id);

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    photo: user.photo,
    // token: undefined,
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

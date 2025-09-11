import prisma from '../utils/prisma';
import crypto from 'node:crypto';

export const findUserById = async (id) => {
  return await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      name: true,
      photo: true,
    },
  });
};

export const getUserById = async (id) => {
  return await prisma.user.findFirstOrThrow({
    where: {
      id,
    },
  });
};

export const isEmailExist = async (email) => {
  const count = await prisma.user.count({
    where: {
      email: email,
    },
  });

  return count > 0;
};

export const createUser = async ({ name, email, password, photo }) => {
  return await prisma.user.create({
    data: {
      name,
      email,
      password,
      photo,
      bio: '',
    },
  });
};

export const findUserByEmail = async (email) => {
  return await prisma.user.findFirstOrThrow({
    where: {
      email: email,
    },
  });
};

export const listsUsers = async ({ skip = 0, take = 10, search = '' } = {}) => {
  return await prisma.user.findMany({
    where: search
      ? {
          OR: [{ name: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }],
        }
      : {},
    skip,
    take,
    select: {
      id: true,
      name: true,
      email: true,
      photo: true,
      bio: true,
    },
  });
};

export const findResetDataByToken = async (token) => {
  return await prisma.passwordReset.findFirst({
    where: {
      token: token,
    },
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });
};

export const createPasswordReset = async (email) => {
  const user = await findUserByEmail(email);
  const token = crypto.randomBytes(32).toString('hex');

  return await prisma.passwordReset.create({
    data: {
      user_id: user.id,
      token,
    },
  });
};

export const updatePassword = async (email, password) => {
  const user = await findUserByEmail(email);

  return await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: password,
    },
  });
};

export const deleteTokenResetById = async (id) => {
  return await prisma.passwordReset.delete({
    where: {
      id,
    },
  });
};

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

export const listsUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      photo: true,
      bio: true,
    },
  });
};

// export const createPasswordReset = async (email) => {
//   const user = await findUserByEmail(email);
//   const token = crypto.randomBytes(32).toString('hex');
// };

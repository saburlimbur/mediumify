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
      bio: true,
      Post: {
        select: {
          id: true,
          title: true,
          description: true,
          photo: true,
          createdAt: true,
          updatedAt: true,
          topics: true,
        },
      },
    },
  });
};

export const updateUserById = async (id, data) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      photo: true,
      bio: true,
    },
  });
};

export const findUniqueUserId = async (id) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
};

// export const getUserById = async (id) => {
//   return await prisma.user.findUniqueOrThrow({
//     where: {
//       id,
//     },
//   });
// };

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
  return await prisma.user.findUniqueOrThrow({
    where: {
      email: email,
    },
  });
};

export const findUserByEmailOrName = async (identifier) => {
  return await prisma.user.findFirst({
    where: {
      OR: [
        {
          email: identifier,
        },
        {
          name: identifier,
        },
      ],
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

export const deleteUser = async (id) => {
  return await prisma.$transaction(async (prisma) => {
    await prisma.library.deleteMany({
      where: {
        posts: {
          some: {
            authorId: id,
          },
        },
      },
    });

    await prisma.library.deleteMany({
      where: {
        userId: id,
      },
    });

    await prisma.passwordReset.deleteMany({
      where: {
        user_id: id,
      },
    });

    await prisma.post.deleteMany({
      where: {
        authorId: id,
      },
    });

    return await prisma.user.delete({
      where: {
        id,
      },
    });
  });
};

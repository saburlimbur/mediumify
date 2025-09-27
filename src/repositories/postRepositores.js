import prisma from '../utils/prisma';

export const createPostRepositories = async ({ title, description, photo, topics, authorId }) => {
  return await prisma.post.create({
    data: {
      title,
      description,
      photo,
      topics,
      authorId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          photo: true,
        },
      },
    },
  });
};

export const getSinglePost = async (postId) => {
  return await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          photo: true,
        },
      },
    },
  });
};

export const listPosts = async ({ skip = 0, take = 10, search = '' } = {}) => {
  return await prisma.post.findMany({
    where: search
      ? {
          OR: [{ title: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }],
        }
      : {},
    skip,
    take,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          photo: true,
        },
      },
    },
  });
};

export const findPostById = async (id) => {
  return await prisma.post.findUnique({
    where: {
      id,
    },
  });
};

export const deletePost = async (id) => {
  return await prisma.post.delete({
    where: {
      id,
    },
  });
};

export const updatePostById = async (id, data) => {
  return await prisma.post.update({
    where: {
      id,
    },
    data,
    select: {
      id: true,
      title: true,
      description: true,
      photo: true,
      topics: true,
      updatedAt: true,
    },
  });
};

import prisma from '../utils/prisma';

// export const savePostToLibrary = async (userId, postId) => {
//   const library = await prisma.library.findFirst({
//     where: {
//       userId,
//     },
//   });

//   if (!library) {
//     throw new Error();
//   }

//   return prisma.library.update({
//     where: {
//       id: library.id,
//     },
//     data: {
//       posts: {
//         connect: {
//           id: postId,
//         },
//       },
//     },
//     include: {
//       posts: true,
//     },
//   });
// };

export const isPostAlreadySaved = async (userId, postId) => {
  return prisma.library.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });
};

export const savePostToLibrary = async (userId, postId) => {
  return prisma.library.create({
    data: {
      userId,
      postId,
    },
    include: {
      post: true,
    },
  });
};

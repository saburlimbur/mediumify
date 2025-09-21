import * as postRepositores from '../repositories/postRepositores';

export const createPost = async ({ title, description, photo, topics, authorId }) => {
  const post = await postRepositores.createPostRepositories({
    title,
    description,
    photo,
    topics,
    authorId,
  });

  return {
    id: post.id,
    authorId: post.authorId,
    title: post.title,
    description: post.description,
    photo: post.photo,
    topics: post.topics,
  };
};

export const singlePost = async ({ id }) => {
  const post = await postRepositores.getSinglePost(id);

  if (!post) {
    throw new Error('Post id not found!');
  }
  return {
    id: post.id,
    authorId: post.authorId,
    title: post.title,
    description: post.description,
    photo: post.photo,
    topics: post.topics,
    author: post.author && {
      id: post.author.id,
      name: post.author.name,
      email: post.author.email,
      photo: post.author.photo,
    },
  };
};

export const listPosts = async ({ page = 1, limit = 10, search = '' }) => {
  const postsData = await postRepositores.listPosts({
    skip: (page - 1) * limit,
    take: limit,
    search,
  });

  return postsData.map((post) => ({
    id: post.id,
    title: post.title,
    description: post.description,
    photo: post.photo,
    topics: post.topics,
    author: post.author && {
      id: post.author.id,
      name: post.author.name,
      email: post.author.email,
      photo: post.author.photo,
    },
  }));
};

// export const deletePost = async (id) => {
//   const post = await postRepositores.findPostById(id);

//   if (!post) {
//     throw new Error('Post not found!');
//   }
// };

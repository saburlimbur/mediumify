import * as postRepositores from '../repositories/postRepositores';

import fs from 'fs';
import path from 'path';

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

export const updatePost = async (id, { title, description, photo, topics, file }) => {
  const existingPost = await postRepositores.findPostById(id);

  if (!existingPost) {
    throw new Error('Post not found!');
  }

  const updateData = {};

  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (topics !== undefined) updateData.topics = topics;

  if (file && file.filename) {
    updateData.photo = file.filename;

    if (existingPost.photo && existingPost.photo !== 'default.jpg') {
      const oldPhotoPath = path.resolve(__dirname, `../../public/assets/uploads/posts/${existingPost.photo}`);

      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }
  } else if (photo !== undefined) {
    updateData.photo = photo;
  }

  const updatedPost = await postRepositores.updatePostById(id, updateData);

  return {
    id: updatedPost.id,
    title: updatedPost.title,
    description: updatedPost.description,
    photo: updatedPost.photo,
    topics: updatedPost.topics,
    updatedAt: updatedPost.updatedAt,
  };
};

export const deletePost = async (id) => {
  const post = await postRepositores.findPostById(id);

  if (!post) {
    throw new Error('Post not found!');
  }

  if (post.photo && post.photo !== null) {
    const postPhotoPath = path.resolve(__dirname, `../../public/assets/uploads/posts/${post.photo}`);

    if (fs.existsSync(postPhotoPath)) {
      fs.unlinkSync(postPhotoPath);
    }
  }

  await postRepositores.deletePost(id);

  return true;
};

import * as libraryRepositories from '../repositories/libraryRepositories';
import * as postRepositories from '../repositories/postRepositores';

export const saveLibrary = async (userId, postId) => {
  // 1. cek post valid
  const post = await postRepositories.findPostById(postId);
  if (!post) {
    throw new Error('Post not found');
  }

  // 2. cek sudah disave atau belum
  const alreadySaved = await libraryRepositories.isPostAlreadySaved(userId, postId);
  if (alreadySaved) {
    throw new Error('Post already saved in library');
  }

  // 3. simpan ke library
  return libraryRepositories.savePostToLibrary(userId, postId);
};

import multer from 'multer';

export const storageUserPhoto = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'public/assets/uploads/users');
  },

  filename: function (req, file, callback) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1000);
    const extension = file.mimetype.split('/')[1];

    const filename = `photo-${uniqueSuffix}.${extension}`;

    callback(null, filename);
  },
});

export const storagePostPhoto = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'public/assets/uploads/posts');
  },

  filename: function (req, file, callback) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1000);

    const extention = file.mimetype.split('/')[1];

    const filename = `posts-photo-${uniqueSuffix}.${extention}`;

    callback(null, filename);
  },
});

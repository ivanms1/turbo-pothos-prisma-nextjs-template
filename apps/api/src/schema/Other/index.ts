import * as cloudinary from 'cloudinary';

import builder from '@/src/builder';

const imageUploader = cloudinary.v2;

builder.mutationFields((t) => ({
  uploadImage: t.field({
    type: 'String',
    args: {
      path: t.arg.string({ required: true }),
    },
    resolve: async (_, args) => {
      const { path } = args;

      const result = await imageUploader.uploader.upload(path);

      return result.secure_url;
    },
  }),
}));

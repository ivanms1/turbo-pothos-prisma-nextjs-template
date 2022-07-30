import { extendType, nonNull, stringArg } from 'nexus';

import * as cloudinary from 'cloudinary';

const imageUploader = cloudinary.v2;

export const UploadImage = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('uploadImage', {
      type: 'JSONObject',
      args: {
        path: nonNull(stringArg()),
      },
      async resolve(_root, { path }) {
        const res = await imageUploader.uploader.upload(path);

        return {
          url: res?.url,
        };
      },
    });
  },
});

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
        return new Promise((resolve, reject) => {
          imageUploader.uploader.upload(path, (err, res) => {
            if (err) {
              reject(err);
            }
            resolve({
              url: res?.url,
            });
          });
        });
      },
    });
  },
});

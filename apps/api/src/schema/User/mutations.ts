import builder from '@/src/builder';
import db from '@/src/db';

builder.mutationFields((t) => ({
  signUp: t.prismaField({
    type: 'User',
    args: {
      email: t.arg.string({ required: true }),
      name: t.arg.string({ required: true }),
      avatar: t.arg.string({ required: true }),
    },
    resolve: async (query, _, args) => {
      const user = await db.user.findFirst({
        ...query,
        where: {
          email: args.email,
        },
      });

      if (user) {
        return user;
      }

      const newUser = await db.user.create({
        data: args,
      });

      return newUser;
    },
  }),
}));

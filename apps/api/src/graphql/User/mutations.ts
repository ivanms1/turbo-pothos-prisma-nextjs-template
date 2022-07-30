import { extendType, nonNull, stringArg } from 'nexus';
import jwt from 'jsonwebtoken';

export const SignUp = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('signup', {
      type: 'JSONObject',
      args: {
        email: nonNull(stringArg()),
        name: nonNull(stringArg()),
        avatar: nonNull(stringArg()),
      },
      async resolve(_root, args, ctx) {
        const user = await ctx.prisma.user.findFirst({
          where: {
            email: args.email,
          },
        });

        if (user) {
          const token = jwt.sign(user.id, process.env.JWT_SECRET!);
          return {
            token,
          };
        }

        const newUser = await ctx.prisma.user.create({
          data: args,
        });

        const token = jwt.sign(newUser.id, process.env.JWT_SECRET!);
        return {
          token,
        };
      },
    });
  },
});

export const UpdateUser = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('updateUser', {
      type: 'User',
      args: {
        userId: nonNull(stringArg()),
        input: 'UpdateUsertInput',
      },
      async resolve(_root, args, ctx) {
        if (!args?.input) {
          throw new Error('Data not found');
        }

        const user = await ctx.prisma.user.update({
          where: {
            id: args.userId,
          },
          data: args.input,
        });

        if (!user) {
          throw new Error('User not found');
        }

        return user;
      },
    });
  },
});

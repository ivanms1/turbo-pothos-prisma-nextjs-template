import {
  objectType,
  extendType,
  idArg,
  nonNull,
  stringArg,
  inputObjectType,
  enumType,
} from 'nexus';
import { User } from 'nexus-prisma';
import jwt from 'jsonwebtoken';

export const Role = enumType({
  name: 'Role',
  members: ['ADMIN', 'AUTHOR'],
});

export const UserType = objectType({
name: User.$name,
  description: User.$description,
  definition(t) {
    t.field(User.id);
    t.field(User.name);
    t.field(User.email);
    t.field(User.avatar);
    t.field(User.role);
    t.list.nonNull.field('articles', { type: 'Article' });

  },
});

export const UpdateUsertInput = inputObjectType({
  name: 'UpdateUsertInput',
  description: 'Update the user information',
  definition(t) {
    t.nonNull.string('name');
    t.nonNull.string('email');
    t.nonNull.string('github');
    t.nonNull.string('discord');
    t.nonNull.field('role', { type: 'Role' });
  },
});

export const GetUser = extendType({
  type: 'Query',
  definition(t) {
    t.field('getUser', {
      type: 'User',
      args: { id: nonNull(idArg()) },
      resolve(_root, args, ctx) {
        return ctx.prisma.user.findUnique({
          where: {
            id: args.id,
          },
          include: {
            articles: true,
          },
        });
      },
    });
  },
});

export const getCurrentUser = extendType({
  type: 'Query',
  definition(t) {
    t.field('getCurrentUser', {
      type: 'User',
      resolve(_root, _, ctx) {
        const decoded = jwt.verify(ctx.accessToken, process.env.JWT_SECRET!);

        if (!decoded) {
          throw Error('Not Authorized');
        }

        return ctx.prisma.user.findUnique({
          where: {
            id: String(decoded),
          },
        });
      },
    });
  },
});

export const GetUsers = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.field('getUsers', {
      type: 'User',
      resolve(_root, _args, ctx) {
        return ctx.prisma.user.findMany();
      },
    });
  },
});

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

import {
  objectType,
  extendType,
  idArg,
  nonNull,
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

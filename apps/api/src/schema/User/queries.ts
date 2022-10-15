import builder from '@/src/builder';
import db from '@/src/db';

const Role = builder.enumType('Role', {
  values: ['ADMIN', 'AUTHOR'],
  description: 'User role',
});

builder.prismaObject('User', {
  name: 'User',
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    email: t.exposeString('email'),
    role: t.expose('role', { type: Role }),
    avatar: t.exposeString('avatar', { nullable: true }),
  }),
});

builder.queryFields((t) => ({
  getUser: t.prismaField({
    type: 'User',
    args: {
      userId: t.arg.string({ required: true }),
    },
    resolve: async (query, _, args) => {
      const user = await db.user.findUnique({
        ...query,
        where: { id: args?.userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    },
  }),
  getUsers: t.prismaField({
    type: ['User'],
    resolve: (query) => db.user.findMany(query),
  }),
}));

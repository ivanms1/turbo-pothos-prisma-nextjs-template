import {
  extendType,
  idArg,
  nonNull,
  stringArg,
  booleanArg,
  inputObjectType,
  list,
} from 'nexus';

import decodeAccessToken from '@/helpers/decodeAccessToken';
import updateFieldHelper from '@/helpers/updateFieldHelper';

export const CreateArticleInput = inputObjectType({
  name: 'CreateArticleInput',
  definition(t) {
    t.nonNull.string('title');
    t.nonNull.string('preview');
    t.nonNull.string('content');
    t.nonNull.string('lead');
    t.nonNull.string('description');
    t.list.nonNull.string('tags');
  },
});

export const UpdateArticleInput = inputObjectType({
  name: 'UpdateArticleInput',
  definition(t) {
    t.nonNull.string('title');
    t.nonNull.string('preview');
    t.nonNull.string('content');
    t.nonNull.string('lead');
    t.nonNull.string('description');
    t.list.nonNull.string('tags');
  },
});

export const CreateArticle = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createArticle', {
      type: 'Article',
      args: {
        input: 'CreateArticleInput',
      },
      resolve(_root, { input }, ctx) {
        const authorId = decodeAccessToken(ctx.accessToken);

        if (!authorId || !input) {
          throw Error('Args missing');
        }

        const { tags, ...rest } = input;

        return ctx.prisma.article.create({
          data: {
            ...rest,
            tags: {
              set: tags?.length ? tags : [],
            },
            isPublished: false,
            author: {
              connect: {
                id: String(authorId),
              },
            },
          },
          include: {
            author: true,
          },
        });
      },
    });
  },
});

export const UpdateArticle = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('updateProject', {
      type: 'Article',
      args: {
        projectId: nonNull(idArg()),
        input: 'UpdateArticleInput',
      },
      async resolve(_root, { input, projectId }, ctx) {
        const authorId = decodeAccessToken(ctx.accessToken);
        if (!projectId || !input || !authorId) {
          throw Error('Args missing');
        }

        const projectToUpdate = await ctx.prisma.article.findUnique({
          where: {
            id: projectId,
          },
        });

        if (projectToUpdate?.authorId === authorId) {
          const { tags, ...rest } = input;
          const updatedAt = new Date().toISOString();
          return ctx.prisma.article.update({
            where: { id: projectId },
            data: {
              title: updateFieldHelper(rest?.title),
              preview: updateFieldHelper(rest.preview),
              content: updateFieldHelper(rest.content),
              lead: updateFieldHelper(rest.description),
              updatedAt,
              tags: {
                set: tags || projectToUpdate.tags,
              },
            },
            include: {
              author: true,
            },
          });
        }

        throw Error('Not authorized');
      },
    });
  },
});

export const DeleteArticle = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('deleteArticle', {
      type: 'String',
      args: {
        id: nonNull(idArg()),
      },
      async resolve(_root, { id }, ctx) {
        const currentUserId = decodeAccessToken(ctx.accessToken);

        const projectToDelete = await ctx.prisma.article.findFirst({
          where: {
            id,
          },
        });
        const userDeleting = await ctx.prisma.user.findFirst({
          where: {
            id: String(currentUserId),
          },
        });
        if (
          projectToDelete?.authorId !== userDeleting?.id &&
          userDeleting?.role !== 'ADMIN'
        ) {
          throw Error('Not Authorized');
        }
        await ctx.prisma.article.delete({ where: { id } });
        return id;
      },
    });
  },
});

export const DeleteManyArticles = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('deleteManyArticles', {
      type: 'JSONObject',
      args: {
        ids: nonNull(list(nonNull(idArg()))),
      },
      async resolve(_root, { ids }, ctx) {
        const { count } = await ctx.prisma.article.deleteMany({
          where: {
            id: { in: ids },
          },
        });

        return {
          count,
          ids,
        };
      },
    });
  },
});

export const UpdateArticleStatus = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('updateArticleStatus', {
      type: 'Article',
      description: 'Change an article status',
      args: {
        projectId: nonNull(stringArg()),
        isPublished: nonNull(booleanArg()),
      },
      async resolve(_root, args, ctx) {
        if (!ctx.accessToken) {
          throw Error('Not Authorized');
        }

        const currentUserId = decodeAccessToken(ctx.accessToken);
        const user = await ctx.prisma.user.findUnique({
          where: {
            id: String(currentUserId),
          },
        });

        if (!user || user.role !== 'ADMIN') {
          throw Error('Not Authorized');
        }

        return ctx.prisma.article.update({
          where: { id: args.projectId },
          data: { isPublished: args.isPublished },
          include: {
            author: true,
          },
        });
      },
    });
  },
});

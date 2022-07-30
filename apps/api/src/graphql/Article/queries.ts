import { Prisma } from '@prisma/client';
import {
  objectType,
  extendType,
  idArg,
  nonNull,
  stringArg,
  inputObjectType,
  enumType,
} from 'nexus';
import { Article } from 'nexus-prisma';

import decodeAccessToken from '../../helpers/decodeAccessToken';

export const ProjectType = objectType({
  name: Article.$name,
  description: Article.$description,
  definition(t) {
    t.field(Article.id);
    t.field(Article.title);
    t.field(Article.preview);
    t.field(Article.lead);
    t.field(Article.content);
    t.field(Article.isPublished);
    t.field(Article.createdAt);
    t.field(Article.updatedAt);
    t.field(Article.tags);
    t.field(Article.author);
  },
});

export const ArticlesResponse = objectType({
  name: 'ArticlesResponse',
  definition(t) {
    t.string('nextCursor');
    t.string('prevCursor');
    t.nonNull.list.nonNull.field('results', { type: 'Article' });
    t.int('totalCount');
  },
});

const SearchOrder = enumType({
  name: 'SearchOrder',
  members: ['asc', 'desc'],
  description: 'Search order',
});

export const SearchArticlesInput = inputObjectType({
  name: 'SearchArticlesInput',
  description: 'Search input fields',
  definition(t) {
    t.nonNull.string('search');
    t.nonNull.string('orderBy');
    t.nonNull.field('order', {
      type: SearchOrder,
    });
  },
});

export const GetArticle = extendType({
  type: 'Query',
  definition(t) {
    t.field('getArticle', {
      type: 'Article',
      args: {
        id: nonNull(idArg()),
      },
      async resolve(_root, args, ctx) {
        try {
          const article = await ctx.prisma.article.findUnique({
            where: { id: args.id },
            include: {
              author: true,
            },
          });

          if (article?.isPublished) {
            return article;
          }

          const currentUserId = decodeAccessToken(ctx.accessToken);

          if (article?.authorId === currentUserId) {
            return article;
          }
          throw Error('Not authorized');
        } catch (error) {
          throw Error('Sorry an error happened');
        }
      },
    });
  },
});

export const GetPublishedArticles = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.field('getPublishedArticles', {
      type: 'ArticlesResponse',
      description: 'Get all published articles',
      args: {
        cursor: stringArg(),
      },
      async resolve(_root, args, ctx) {
        const incomingCursor = args?.cursor;
        let results;

        const totalCount = await ctx.prisma.article.count({
          where: {
            isPublished: true,
          },
        });

        if (incomingCursor) {
          results = await ctx.prisma.article.findMany({
            take: 9,
            skip: 1,
            cursor: {
              id: incomingCursor,
            },
            where: {
              isPublished: true,
            },
            include: {
              author: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          });
        } else {
          results = await ctx.prisma.article.findMany({
            take: 9,
            where: {
              isPublished: true,
            },
            include: {
              author: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          });
        }

        const lastResult = results[8];
        const cursor = lastResult?.id;

        return {
          prevCursor: args.cursor,
          nextCursor: cursor,
          results,
          totalCount,
        };
      },
    });
  },
});

export const GetArticlesAdmin = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.field('getArticlesAdmin', {
      type: 'ArticlesResponse',
      description: 'Admin query to get articles',
      args: {
        cursor: stringArg(),
      },
      async resolve(_root, args, ctx) {
        const incomingCursor = args?.cursor;
        let results;

        const totalCount = await ctx.prisma.article.count();

        if (incomingCursor) {
          results = await ctx.prisma.article.findMany({
            take: 9,
            skip: 1,
            cursor: {
              id: incomingCursor,
            },
            include: {
              author: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          });
        } else {
          results = await ctx.prisma.article.findMany({
            take: 9,
            include: {
              author: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          });
        }

        const lastResult = results[8];
        const cursor = lastResult?.id;

        return {
          prevCursor: args.cursor,
          nextCursor: cursor,
          results,
          totalCount,
        };
      },
    });
  },
});

export const GetMyProjects = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.field('getMyProjects', {
      type: 'ArticlesResponse',
      description: 'Get all my projects',
      args: {
        cursor: stringArg(),
      },
      async resolve(_root, args, ctx) {
        const incomingCursor = args?.cursor;
        let results;

        const currentUserId = decodeAccessToken(ctx.accessToken);

        const totalCount = await ctx.prisma.article.count({
          where: {
            authorId: String(currentUserId),
          },
        });

        if (incomingCursor) {
          results = await ctx.prisma.article.findMany({
            take: 9,
            skip: 1,
            cursor: {
              id: incomingCursor,
            },
            where: {
              authorId: String(currentUserId),
            },
            include: {
              author: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          });
        } else {
          results = await ctx.prisma.article.findMany({
            take: 9,
            where: {
              authorId: String(currentUserId),
            },
            include: {
              author: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          });
        }

        const lastResult = results[8];
        const cursor = lastResult?.id;

        return {
          prevCursor: args.cursor,
          nextCursor: cursor,
          results,
          totalCount,
        };
      },
    });
  },
});

export const SearchArticles = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.field('searchArticles', {
      type: 'ArticlesResponse',
      description: 'Search articles',
      args: {
        input: SearchArticlesInput,
        cursor: stringArg(),
      },
      async resolve(_root, args, ctx) {
        const incomingCursor = args?.cursor;
        let results;
        const filter: Prisma.ArticleWhereInput | undefined = {
          isPublished: true,
          OR: [
            {
              title: {
                contains: args?.input?.search || undefined,
                mode: 'insensitive',
              },
            },
            {
              lead: {
                contains: args?.input?.search || undefined,
                mode: 'insensitive',
              },
            },
          ],
        };

        const totalCount = await ctx.prisma.article.count({
          where: filter,
        });

        if (incomingCursor) {
          results = await ctx.prisma.article.findMany({
            take: 9,
            skip: 1,
            cursor: {
              id: incomingCursor,
            },
            where: filter,
            include: {
              author: true,
            },
            orderBy: {
              [args?.input?.orderBy || 'createdAt']: args?.input?.order,
            },
          });
        } else {
          results = await ctx.prisma.article.findMany({
            take: 9,
            where: filter,
            include: {
              author: true,
            },
            orderBy: {
              [args?.input?.orderBy || 'createdAt']: args?.input?.order,
            },
          });
        }

        const lastResult = results[8];
        const cursor = lastResult?.id;

        return {
          prevCursor: args.cursor,
          nextCursor: cursor,
          results,
          totalCount,
        };
      },
    });
  },
});

export const GetUserArticles = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.field('getUserArticles', {
      type: 'ArticlesResponse',
      description: 'Get all the articles from a certain user',
      args: {
        cursor: stringArg(),
        userId: stringArg(),
      },
      async resolve(_root, args, ctx) {
        const incomingCursor = args?.cursor;
        let results;

        const totalCount = await ctx.prisma.article.count({
          where: {
            authorId: String(args.userId),
          },
        });

        if (incomingCursor) {
          results = await ctx.prisma.article.findMany({
            take: 9,
            skip: 1,
            cursor: {
              id: incomingCursor,
            },
            where: {
              authorId: String(args.userId),
            },
            include: {
              author: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          });
        } else {
          results = await ctx.prisma.article.findMany({
            take: 9,
            where: {
              authorId: String(args.userId),
            },
            include: {
              author: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          });
        }

        const lastResult = results[8];
        const cursor = lastResult?.id;

        return {
          prevCursor: args.cursor,
          nextCursor: cursor,
          results,
          totalCount,
        };
      },
    });
  },
});

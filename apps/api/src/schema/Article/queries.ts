import { Prisma } from '@prisma/client';

import builder from '@/src/builder';
import db from '@/src/db';

const Article = builder.prismaObject('Article', {
  name: 'Article',
  fields: (t) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    preview: t.exposeString('preview'),
    content: t.exposeString('content'),
    lead: t.exposeString('lead'),
    isPublished: t.exposeBoolean('isPublished'),
    createdAt: t.expose('createdAt', { type: 'Date' }),
    updatedAt: t.expose('updatedAt', { type: 'Date' }),
    author: t.relation('author'),
  }),
});

const ArticlesResponse = builder.objectType('ArticlesResponse', {
  description: 'Paginated list of articles',
  fields: (t) => ({
    nextCursor: t.exposeString('nextCursor', { nullable: true }),
    prevCursor: t.exposeString('prevCursor', { nullable: true }),
    totalCount: t.exposeInt('totalCount', { nullable: true }),
    results: t.field({ type: [Article], resolve: (parent) => parent.results }),
  }),
});

const SearchOrder = builder.enumType('SearchOrder', {
  values: ['asc', 'desc'] as const,
  description: 'Search order',
});

const ArticlesInput = builder.inputType('ArticlesInput', {
  description: 'Articles query input',
  fields: (t) => ({
    search: t.string(),
    orderBy: t.string(),
    cursor: t.string(),
    order: t.field({
      type: SearchOrder,
    }),
  }),
});

builder.queryType({
  fields: (t) => ({
    getArticle: t.prismaField({
      type: 'Article',
      args: {
        articleId: t.arg.string({ required: true }),
      },
      resolve: async (query, _, args) => {
        const article = await db.article.findUnique({
          ...query,
          where: { id: args?.articleId },
        });

        if (!article) {
          throw new Error('Article not found');
        }
        return article;
      },
    }),
    searchArticles: t.field({
      type: ArticlesResponse,
      args: {
        input: t.arg({ type: ArticlesInput }),
      },
      resolve: async (_, args) => {
        const incomingCursor = args?.input?.cursor;
        let results;
        const filter: Prisma.ArticleWhereInput | undefined = {
          OR: [
            {
              title: {
                contains: args?.input?.search || '',
                // enable this when using Postgres
                // mode: 'insensitive',
              },
            },
            {
              lead: {
                contains: args?.input?.search || '',
                // enable this when using Postgres
                // mode: 'insensitive',
              },
            },
          ],
        };

        const totalCount = await db.article.count({
          where: filter,
        });

        if (incomingCursor) {
          results = await db.article.findMany({
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
          results = await db.article.findMany({
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
          prevCursor: args?.input?.cursor ?? '',
          nextCursor: cursor,
          results,
          totalCount,
        };
      },
    }),
    getUserArticles: t.field({
      type: ArticlesResponse,
      args: {
        input: t.arg({ type: ArticlesInput, required: true }),
        userId: t.arg.string({ required: true }),
      },
      resolve: async (_, args) => {
        const incomingCursor = args?.input.cursor;
        let results;

        const filter: Prisma.ArticleWhereInput | undefined = {
          authorId: args?.userId,
          OR: [
            {
              title: {
                contains: args?.input?.search || undefined,
                // enable this when using Postgres
                // mode: 'insensitive',
              },
            },
            {
              lead: {
                contains: args?.input?.search || undefined,
                // enable this when using Postgres
                // mode: 'insensitive',
              },
            },
          ],
        };

        const totalCount = await db.article.count({
          where: filter,
        });

        if (incomingCursor) {
          results = await db.article.findMany({
            take: 9,
            skip: 1,
            cursor: {
              id: incomingCursor,
            },
            where: filter,
            include: { author: true },
            orderBy: {
              [args?.input?.orderBy || 'createdAt']: args?.input?.order,
            },
          });
        } else {
          results = await db.article.findMany({
            take: 9,
            where: filter,
            include: { author: true },
            orderBy: {
              [args?.input?.orderBy || 'createdAt']: args?.input?.order,
            },
          });
        }

        const lastResult = results[8];
        const cursor = lastResult?.id;

        return {
          prevCursor: args.input.cursor ?? '',
          nextCursor: cursor,
          results,
          totalCount,
        };
      },
    }),
  }),
});

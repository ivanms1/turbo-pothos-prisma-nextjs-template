import { Prisma } from '@prisma/client';
import {
  objectType,
  extendType,
  idArg,
  nonNull,
  stringArg,
  booleanArg,
  inputObjectType,
  list,
  enumType,
} from 'nexus';
import { Article } from 'nexus-prisma';

import decodeAccessToken from '../helpers/decodeAccessToken';
import updateFieldHelper from '../helpers/updateFieldHelper';

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
          const updatedAt = new Date().toISOString()
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

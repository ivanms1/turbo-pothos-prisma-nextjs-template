import builder from '@/src/builder';
import db from 'src/db';

const CreateArticleInput = builder.inputType('CreateArticleInput', {
  fields: (t) => ({
    title: t.string({ required: true }),
    lead: t.string({ required: true }),
    preview: t.string({ required: true }),
    content: t.string({ required: true }),
  }),
});

builder.mutationType({
  fields: (t) => ({
    createArticle: t.prismaField({
      type: 'Article',
      args: {
        userId: t.arg.string({ required: true }),
        input: t.arg({ type: CreateArticleInput, required: true }),
      },
      resolve: async (query, _, args) => {
        const article = await db.article.create({
          ...query,
          data: {
            ...args.input,
            authorId: args.userId,
          },
        });

        return article;
      },
    }),
    updateArticle: t.prismaField({
      type: 'Article',
      args: {
        articleId: t.arg.string({ required: true }),
        input: t.arg({ type: CreateArticleInput, required: true }),
      },
      resolve: async (query, _, args) => {
        const article = await db.article.update({
          ...query,
          where: { id: args.articleId },
          data: args.input,
        });

        return article;
      },
    }),
    deleteArticle: t.prismaField({
      type: 'Article',
      args: {
        articleId: t.arg.string({ required: true }),
      },
      resolve: async (query, _, args) => {
        const article = await db.article.delete({
          ...query,
          where: {
            id: args.articleId,
          },
        });

        return article;
      },
    }),
  }),
});

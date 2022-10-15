import PrismaPlugin from '@pothos/plugin-prisma';
import SchemaBuilder from '@pothos/core';

import type PrismaTypes from '@pothos/plugin-prisma/generated';

import db from './db';

const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Objects: {
    ArticlesResponse: {
      nextCursor: string;
      prevCursor: string;
      totalCount: number;
      results: PrismaTypes['Article']['Shape'][];
    };
  };
  Scalars: {
    Date: {
      Input: Date;
      Output: Date;
    };
    JSON: {
      Input: JSON;
      Output: JSON;
    };
  };
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: db,
    filterConnectionTotalCount: true,
  },
});

export default builder;

import { makeSchema } from 'nexus';
import { join } from 'path';

import * as types from './graphql';

export const schema = makeSchema({
  types,
  outputs: {
    typegen: join(
      process.cwd(),
      'node_modules',
      '@types',
      'nexus-typegen',
      'index.d.ts'
    ),
    schema: join(__dirname, '..', 'schema.graphql'),
  },
  contextType: {
    module: join(__dirname, './context'),
    export: 'Context',
  },
});

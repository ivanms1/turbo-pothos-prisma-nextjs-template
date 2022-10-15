import { writeFileSync } from 'fs';
import { lexicographicSortSchema, printSchema } from 'graphql';
import path from 'path';

import builder from './builder';

import './schema/index';

export const schema = builder.toSchema();

const schemaAsString = printSchema(lexicographicSortSchema(schema));

writeFileSync(path.join(__dirname, '../schema.graphql'), schemaAsString);

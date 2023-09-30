/**
 * This file is used to generate the GraphQL schema. It uses the
 * GraphQL Schema Builder to generate the schema, and then writes
 * it to a file.
 */

import { writeFileSync } from 'fs';
import { lexicographicSortSchema, printSchema } from 'graphql';
import path from 'path';

import builder from './builder';

import './schema/index';

export const schema = builder.toSchema();

const schemaAsString = printSchema(lexicographicSortSchema(schema));

writeFileSync(path.join(__dirname, '../schema.graphql'), schemaAsString);

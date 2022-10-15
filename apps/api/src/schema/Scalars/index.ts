import { DateTimeResolver, JSONObjectResolver } from 'graphql-scalars';

import builder from '@/src/builder';

builder.addScalarType('Date', DateTimeResolver, {});
builder.addScalarType('JSON', JSONObjectResolver, {});

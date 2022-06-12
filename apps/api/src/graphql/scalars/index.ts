import { asNexusMethod } from 'nexus';
import { DateTimeResolver, JSONObjectResolver } from 'graphql-scalars';

export const DateTime = asNexusMethod(DateTimeResolver, 'date');
export const JSON = asNexusMethod(JSONObjectResolver, 'json');

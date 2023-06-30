import { createKysely } from '@vercel/postgres-kysely';
import { Database } from '~/db/types';

export const db = createKysely<Database>();
export { sql } from 'kysely';

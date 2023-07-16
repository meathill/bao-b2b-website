import { H3Event } from 'h3';
import { Specification, TABLE_SPEC } from '~/db/types';
import { db } from '~/db/kysely';

export default defineEventHandler(async function (event: H3Event): Promise<Specification[]> {
  const params = getQuery(event);
  const { category } = params;
  const results = await db.selectFrom(TABLE_SPEC)
    .where('category', '=', category)
    .selectAll()
    .execute();
  return {
    code: 0,
    data: results as Specification[],
  };
});

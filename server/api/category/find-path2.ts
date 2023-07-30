import { H3Event } from 'h3';
import { ApiResponse, IdRequest } from '~/types';
import { Category, TABLE_CATEGORY } from '~/db/types';
import { db } from '~/db/kysely';

/**
 * Find category's all ancestor
 */
export default defineEventHandler(async function (event: H3Event): Promise<ApiResponse<Partial<Category>[]>> {
  const body = (await readBody(event)) as IdRequest;
  const { id } = body;
  const category = await db.selectFrom(TABLE_CATEGORY)
    .innerJoin(TABLE_CATEGORY + ' as parent', 'parent.id', TABLE_CATEGORY + '.parent')
    .selectAll()
    .where(TABLE_CATEGORY + '.id', '=', id)
    .execute();
  return {
    code: 0,
    data: category,
  };
});

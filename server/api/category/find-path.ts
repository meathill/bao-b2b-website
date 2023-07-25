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
  const result = [];
  let category = (await db.selectFrom(TABLE_CATEGORY)
    .where('id', '=', id)
    .executeTakeFirst()) as Category;
  while (category) {
    const { id, name, slug, parent } = category;
    result.push({
      id,
      name,
      parent,
    });
    if (parent) {
      category = (await db.selectFrom(TABLE_CATEGORY)
        .where('id', '=', parent)
        .executeTakeFirst()) as Category;
    }
  }
  return {
    code: 0,
    data: result,
  };
});

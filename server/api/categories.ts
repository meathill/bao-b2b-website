import { H3Event } from 'h3';
import { db } from '~/db/kysely';
import { Category, TABLE_CATEGORY } from '~/db/types';
import { ApiResponse } from '~/types';

const { count } = db.fn;

export default defineEventHandler(async function (event: H3Event): Promise<ApiResponse<Category[]>> {
  const params = getQuery(event);
  const { search = '' } = params;

  let query = db.selectFrom(TABLE_CATEGORY)
    .where('deletedAt', 'is', null);
  if (search) {
    query = query.where('name', 'like', `%${search}%`);
  }
  const total = await query
    .select(count('id').as('total'))
    .execute();
  const results = await query
    .select(['id', 'name', 'slug', 'parent', 'description', 'createdAt', 'updatedAt'])
    .execute();

  return {
    code: 0,
    data: results as Category[],
    meta: {
      total: Number(total[0].total),
    },
  };
});

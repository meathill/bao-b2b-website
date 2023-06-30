import { H3Event } from 'h3';
import { db } from '~/db/kysely';
import { Category, TABLE_CATEGORY } from '~/db/types';
import { ApiResponse } from '~/types';

const { count } = db.fn;

export default defineEventHandler(async function (event: H3Event): Promise<ApiResponse<Category[]>> {
  const params = getQuery(event);
  let {
    page,
    size,
  } = params;
  const { search = '' } = params;
  page = page ? parseInt(page as string, 10) : 1;
  size = size ? parseInt(size as string, 10) : 20;

  let query = db.selectFrom(TABLE_CATEGORY)
    .where('deletedAt', 'is', null);
  if (search) {
    query = query.where('name', 'like', `%${search}%`);
  }
  const total = await query
    .select(count('id').as('total'))
    .execute();
  query = query
    .limit(size)
    .offset((page - 1) * size);
  const results = await query.execute();

  return {
    code: 0,
    data: results as Category[],
    meta: {
      total: Number(total[0].total),
    },
  };
});

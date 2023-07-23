import { H3Event } from 'h3';
import { Product, TABLE_PRODUCT } from '~/db/types';
import { db } from '~/db/kysely';
import { ApiResponse } from '~/types';

const { count } = db.fn;

export default defineEventHandler(async function (event: H3Event): Promise<ApiResponse<Product[]>> {
  const params = getQuery(event);
  let {
    page,
    size,
  } = params;
  page = page ? parseInt(page as string, 10) : 1;
  size = size ? parseInt(size as string, 10) : 20;
  const {
    search = '',
    category = '',
  } = params;

  let query = db.selectFrom(TABLE_PRODUCT)
    .where('deletedAt', 'is', null);
  if (search) {
    query = query.where('name', 'like', `%${search}%`);
  }
  if (category) {
    query = query.where('category', '=', Number(category));
  }
  const total = await query
    .select(count('id').as('total'))
    .execute();
  const results = await query
    .select(['id', 'name', 'slug', 'description', 'images', 'category', 'createdAt', 'updatedAt'])
    .orderBy('id', 'desc')
    .limit(size)
    .execute();

  return {
    code: 0,
    data: results as Product[],
    meta: {
      total: Number(total[0].total),
    },
  };
});

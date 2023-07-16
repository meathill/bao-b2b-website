import { H3Event } from 'h3';
import { Product, TABLE_PRODUCT } from '~/db/types';
import { db } from '~/db/kysely';
import { ApiResponse } from '~/types';

export default defineEventHandler(async function (event: H3Event): Promise<ApiResponse<Product[]>> {
  const query = getQuery(event);
  const { search } = query;
  if (!search) {
    return {
      code: 0,
      data: [],
    };
  }

  const products = await db.selectFrom(TABLE_PRODUCT)
    .select([
      'id',
      'name',
      'slug',
      'images',
      'category',
      'more',
      'createdAt',
      'updatedAt',
    ])
    .where('name', 'like', `%${search}%`)
    .orderBy('id', 'desc')
    .limit(20)
    .execute();
  return {
    code: 0,
    data: products as Product[],
  };
});

import { H3Event } from 'h3';
import { Product, TABLE_PRODUCT_SPEC, TABLE_SPEC } from '~/db/types';
import { db } from '~/db/kysely';
import { ApiResponse } from '~/types';

export default defineEventHandler(async function (event: H3Event): Promise<ApiResponse<Product[]>> {
  const params = getQuery(event);
  const {
    category = '',
  } = params;

  const results = await db.selectFrom(TABLE_SPEC)
    .innerJoin(TABLE_PRODUCT_SPEC, TABLE_PRODUCT_SPEC + '.specId', TABLE_SPEC + '.id')
    .where('category', '=', Number(category))
    .select([
      TABLE_SPEC + '.id',
      TABLE_SPEC + '.name',
      'value',
    ])
    .execute();

  return {
    code: 0,
    data: results as Product[],
  };
});

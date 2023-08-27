import { H3Event } from 'h3';
import { Product, TABLE_PRODUCT_SPEC, TABLE_SPEC } from '~/db/types';
import { db } from '~/db/kysely';
import { ApiResponse } from '~/types';
import { getCategoryByIdOrSlug } from '~/utils/api';

export default defineEventHandler(async function (event: H3Event): Promise<ApiResponse<Product[]>> {
  const params = getQuery(event);
  let {
    category = '',
  } = params;

  if (isNaN(Number(category))) {
    const cate = await getCategoryByIdOrSlug(category as string);
    category = cate.id;
  }

  const results = await db.selectFrom(TABLE_SPEC)
    .leftJoin(TABLE_PRODUCT_SPEC, TABLE_PRODUCT_SPEC + '.specId', TABLE_SPEC + '.id')
    .where('category', '=', category as number)
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

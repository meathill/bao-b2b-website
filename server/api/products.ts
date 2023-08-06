import { H3Event } from 'h3';
import { Product, TABLE_PRODUCT, TABLE_PRODUCT_SPEC } from '~/db/types';
import { db } from '~/db/kysely';
import { ApiResponse } from '~/types';
import { filterToObject } from '~/utils';
import { getCategoryByIdOrSlug } from '~/utils/api';

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
    filter,
  } = params;
  const specFilter: Record<string, string[]> | null = filter ? filterToObject(filter as string) : null;

  let query = db.selectFrom(TABLE_PRODUCT)
    .where('deletedAt', 'is', null);
  if (specFilter) {
    const productIds: number[] = [];
    for (const cateId in specFilter) {
      const results = await db.selectFrom(TABLE_PRODUCT_SPEC)
        .where('specId', '=', Number(cateId))
        .where('value', 'in', specFilter[cateId])
        .select(['productId'])
        .execute();
      productIds.push(...results.map(item => item.productId));
    }
    query = query.where('id', 'in', productIds);
  }
  if (category) {
    let categoryId = Number(category);
    if (isNaN(categoryId)) {
      const cate = await getCategoryByIdOrSlug(category as string);
      categoryId = cate.id;
    }
    query = query.where('category', '=', categoryId);
  }
  if (search) {
    query = query.where('name', 'like', `%${search}%`);
  }

  const total = await query
    .select(count('id').as('total'))
    .execute();
  const results = await query
    .select([
      'id',
      'name',
      'slug',
      'description',
      'images',
      'category',
      'createdAt',
      'updatedAt',
      'digest',
    ])
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

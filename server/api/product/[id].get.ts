import { H3Event } from 'h3';
import { ApiResponse } from '~/types';
import { Product, TABLE_PRODUCT, TABLE_PRODUCT_SPEC, TABLE_SPEC } from '~/db/types';
import { db } from '~/db/kysely';

export default defineEventHandler(async function (event: H3Event): Promise<ApiResponse<Product>> {
  const id = event.context.params?.id;
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid product id',
    });
  }

  const query = getQuery(event);
  const {
    related = false,
  } = query;

  const product = await db
    .selectFrom(TABLE_PRODUCT)
    .selectAll()
    .where(isNaN(Number(id)) ? 'slug' : 'id', '=', id)
    .where('deletedAt', 'is', null)
    .executeTakeFirst();
  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Product not found',
    });
  }

  product.specifications = await db
    .selectFrom(TABLE_PRODUCT_SPEC)
    .leftJoin(TABLE_SPEC, TABLE_SPEC + '.id', TABLE_PRODUCT_SPEC + '.specId')
    .where('productId', '=', product.id)
    .selectAll(TABLE_PRODUCT_SPEC)
    .select(TABLE_SPEC + '.name')
    .execute();

  if (related) {
    const relatedProducts = await db
      .selectFrom(TABLE_PRODUCT)
      .select(['id', 'name', 'slug', 'images'])
      .where('category', '=', product.category)
      .where('id', '!=', product.id)
      .where('deletedAt', 'is', null)
      .orderBy('id', 'desc')
      .limit(15)
      .execute();
    product.related = relatedProducts.sort(() => Math.random() - 0.5).slice(0, 5);
  }

  return {
    code: 0,
    data: product,
  };
});

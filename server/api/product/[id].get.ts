import { H3Event } from 'h3';
import { Product, TABLE_PRODUCT, TABLE_PRODUCT_SPEC } from '~/db/types';
import { db } from '~/db/kysely';
import { ProductSpecification } from '~/types';

export default defineEventHandler(async function (event: H3Event): Promise<Product> {
  const id = event.context.params?.id;
  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid product id',
    });
  }
  const productId = Number(id);

  const product = await db
    .selectFrom(TABLE_PRODUCT)
    .selectAll()
    .where('id', '=', productId)
    .where('deletedAt', 'is', null)
    .executeTakeFirst();
  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Category not found',
    });
  }

  product.specifications = await db
    .selectFrom(TABLE_PRODUCT_SPEC)
    .where('productId', '=', productId)
    .selectAll()
    .execute();

  return {
    code: 0,
    data: product,
  };
});

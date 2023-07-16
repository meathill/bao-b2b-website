import { H3Event } from 'h3';
import { ApiResponse } from '~/types';
import { db } from '~/db/kysely';
import {
  EditedProduct,
  TABLE_PRODUCT,
  TABLE_PRODUCT_SPEC,
} from '~/db/types';

export default defineEventHandler(async function (event: H3Event): Promise<ApiResponse<'ok'>> {
  const id = event.context.params?.id;
  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid product id',
    });
  }
  const productId = Number(id);
  const {
    specifications,
    createdAt,
    updatedAt,
    more,
    ...data
  } = await readBody(event) as EditedProduct;
  await db.updateTable(TABLE_PRODUCT)
    .set({
      ...data,
      more: JSON.stringify(more),
      updatedAt: new Date(),
    })
    .where('id', '=', productId)
    .execute();

  // remove existing specifications
  await db.deleteFrom(TABLE_PRODUCT_SPEC)
    .where('productId', '=', productId)
    .execute();

  // insert new specifications
  await db.insertInto(TABLE_PRODUCT_SPEC)
    .values(specifications.map((spec) => {
      return {
        ...spec,
        productId,
      };
    }))
    .execute();

  return {
    code: 0,
    data: 'ok',
  };
});

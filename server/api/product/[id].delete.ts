import { H3Event } from 'h3';
import { ApiResponse } from '~/types';
import { db } from '~/db/kysely';
import { TABLE_CATEGORY, TABLE_PRODUCT } from '~/db/types';

export default defineEventHandler(async function (event: H3Event): Promise<ApiResponse<string>> {
  const id = event.context.params?.id;
  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid product id',
    });
  }
  const productId = Number(id);

  await db.updateTable(TABLE_PRODUCT)
    .set({
      deletedAt: 'now()',
    })
    .where('id', '=', productId)
    .execute();
  return {
    code: 0,
    data: 'ok',
  };
});

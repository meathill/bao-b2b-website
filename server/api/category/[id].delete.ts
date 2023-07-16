import { H3Event } from 'h3';
import { ApiResponse } from '~/types';
import { db } from '~/db/kysely';
import { TABLE_CATEGORY } from '~/db/types';

export default defineEventHandler(async function (event: H3Event): Promise<ApiResponse<string>> {
  const id = event.context.params?.id;
  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid category id',
    });
  }
  const categoryId = Number(id);

  await db.updateTable(TABLE_CATEGORY)
    .set({
      deletedAt: 'now()',
    })
    .where('id', '=', categoryId)
    .execute();
  return {
    code: 0,
    data: 'ok',
  };
});

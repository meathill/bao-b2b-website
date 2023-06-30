import { H3Event } from 'h3';
import { ApiResponse } from '~/types';
import { db } from '~/db/kysely';
import { Category, EditedCategory, TABLE_CATEGORY } from '~/db/types';

export default defineEventHandler(async function (event: H3Event): Promise<ApiResponse<'ok'>> {
  const id = event.context.params?.id
    ? Number(event.context.params.id) as Category['id']
    : 0;
  if (!id || isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid category id',
    });
  }
  const {
    specifications,
    ...data
  } = await readBody(event) as EditedCategory;
  await db.updateTable(TABLE_CATEGORY)
    .set(data)
    .where('id', '=', id)
    .execute();

  return {
    code: 0,
    data: 'ok',
  };
});

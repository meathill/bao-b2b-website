import { H3Event } from 'h3';
import { ApiResponse } from '~/types';
import { db } from '~/db/kysely';
import { QuotationStatus, TABLE_QUOTATION } from '~/db/types';

export default defineEventHandler(async function (event: H3Event): Promise<ApiResponse<'ok'>> {
  const id = event.context.params?.id;
  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid category id',
    });
  }
  const quotationId = Number(id);
  const {
    status,
  } = await readBody(event) as {status: QuotationStatus};
  await db
    .updateTable(TABLE_QUOTATION)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where('id', '=', quotationId)
    .execute();

  return {
    code: 0,
    data: 'ok',
  };
});

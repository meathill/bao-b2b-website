import { H3Event } from 'h3';
import { db } from '~/db/kysely';
import { NewQuotation, QuotationStatus, TABLE_QUOTATION } from '~/db/types';
import { ApiResponse } from '~/types';

export default defineEventHandler(async function (event: H3Event): Promise<ApiResponse<number>> {
  const body = (await readBody(event)) as NewQuotation;

  const quotation = await db
    .insertInto(TABLE_QUOTATION)
    .values({
      ...body,
      status: QuotationStatus.Created,
    })
    .returning('id')
    .executeTakeFirstOrThrow();

  return {
    code: 0,
    data: quotation.id,
  };
});

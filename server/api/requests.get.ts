import { H3Event } from 'h3';
import { Quotation, TABLE_QUOTATION } from '~/db/types';
import { db } from '~/db/kysely';
import { ApiResponse } from '~/types';

export default defineEventHandler(async function (event: H3Event): Promise<ApiResponse<Quotation[]>> {
  const data = await db.selectFrom(TABLE_QUOTATION)
    .selectAll()
    .execute();

  return {
    code: 0,
    data,
  };
});

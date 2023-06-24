import { H3Event } from 'h3';
import {Category, db, NewCategory, Specification, TABLE_CATEGORY, TABLE_SPEC} from '~/db/kysely';
import { ApiResponse } from '~/types';

type RequestBody = NewCategory & {
  specifications: Specification[];
}
export default defineEventHandler(async function (event: H3Event): Promise<ApiResponse<Category['id']>> {
  const body = await readBody(event) as RequestBody;
  const {
    specifications,
    ...data
  } = body;

  const category = await db
    .insertInto(TABLE_CATEGORY)
    .values(data)
    .returning('id')
    .executeTakeFirstOrThrow();

  await db
    .insertInto(TABLE_SPEC)
    .values(specifications)
    .execute();

  return {
    code: 0,
    data: category.id,
  };
});

import { H3Event } from 'h3';
import omit from 'lodash/omit';
import { db } from '~/db/kysely';
import { Category, NewCategory, Specification, TABLE_CATEGORY, TABLE_SPEC } from '~/db/types';
import { ApiResponse } from '~/types';

type RequestBody = NewCategory & {
  specifications: Specification[];
};
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

  if (specifications.length) {
    await db
      .insertInto(TABLE_SPEC)
      .values(specifications.map((spec) => {
        return {
          ...omit(spec, 'isChanged', 'isDeleted'),
          category: category.id,
        };
      }))
      .execute();
  }

  return {
    code: 0,
    data: category.id,
  };
});

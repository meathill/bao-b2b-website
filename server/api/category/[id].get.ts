import { H3Event } from 'h3';
import { ApiResponse } from '~/types';
import { Category, db, Specification, TABLE_CATEGORY, TABLE_SPEC } from '~/db/kysely';

export default defineEventHandler(async function (event: H3Event): Promise<ApiResponse<Category>> {
  const id = event.context.params?.id
    ? Number(event.context.params.id) as Category['id']
    : 0;
  if (!id || isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid category id',
    });
  }

  const category = await db
    .selectFrom(TABLE_CATEGORY)
    .selectAll()
    .where('id', '=', id)
    .where('deletedAt', 'is', null)
    .executeTakeFirst();
  const specifications: Specification[] = await db
    .selectFrom(TABLE_SPEC)
    .where('category', '=', id)
    .selectAll()
    .execute();
  if (!category) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Category not found',
    });
  }

  category.specifications = specifications;

  return {
    code: 0,
    data: category,
  };
});

import { H3Event } from 'h3';
import { ApiResponse } from '~/types';
import { db } from '~/db/kysely';
import { Category, Specification, TABLE_CATEGORY, TABLE_SPEC } from '~/db/types';

export default defineEventHandler(async function (event: H3Event): Promise<ApiResponse<Category>> {
  const id = event.context.params?.id;
  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid category id',
    });
  }
  const categoryId = Number(id);

  const category = await db
    .selectFrom(TABLE_CATEGORY)
    .selectAll()
    .where('id', '=', categoryId)
    .where('deletedAt', 'is', null)
    .executeTakeFirst();
  const specifications: Specification[] = await db
    .selectFrom(TABLE_SPEC)
    .where('category', '=', categoryId)
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

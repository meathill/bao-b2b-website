import { H3Event } from 'h3';
import { ApiResponse } from '~/types';
import { db } from '~/db/kysely';
import { Category, TABLE_CATEGORY, TABLE_SPEC } from '~/db/types';

export default defineEventHandler(async function (event: H3Event): Promise<ApiResponse<Category>> {
  const id = event.context.params?.id as string;
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid category id',
    });
  }

  const category = await db
    .selectFrom(TABLE_CATEGORY)
    .selectAll()
    .where(isNaN(Number(id)) ? 'slug' : 'id', '=', id)
    .where('deletedAt', 'is', null)
    .executeTakeFirst();
  if (!category) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Category not found',
    });
  }

  category.specifications = await db
    .selectFrom(TABLE_SPEC)
    .where('category', '=', category.id)
    .selectAll()
    .execute();

  return {
    code: 0,
    data: category,
  };
});

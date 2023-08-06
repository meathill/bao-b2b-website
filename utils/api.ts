import { Category, TABLE_CATEGORY } from '~/db/types';
import { db } from '~/db/kysely';

export async function getCategoryByIdOrSlug(idOrSlug: number | string): Promise<Category> {
  return (await db
    .selectFrom(TABLE_CATEGORY)
    .selectAll()
    .where(isNaN(Number(idOrSlug)) ? 'slug' : 'id', '=', idOrSlug)
    .where('deletedAt', 'is', null)
    .executeTakeFirst()) as Category;
}

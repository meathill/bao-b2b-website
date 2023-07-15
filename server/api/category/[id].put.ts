import { H3Event } from 'h3';
import omit from 'lodash/omit';
import { ApiResponse } from '~/types';
import { db } from '~/db/kysely';
import { EditedCategory, EditedSpecification, TABLE_CATEGORY, TABLE_SPEC } from '~/db/types';

export default defineEventHandler(async function (event: H3Event): Promise<ApiResponse<'ok'>> {
  const id = event.context.params?.id;
  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid category id',
    });
  }
  const categoryId = Number(id);
  const {
    specifications,
    createdAt,
    updatedAt,
    ...data
  } = await readBody(event) as EditedCategory;
  await db.updateTable(TABLE_CATEGORY)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where('id', '=', categoryId)
    .execute();

  const [
    deleted,
    changed,
    inserted,
  ]: [
    number[],
    EditedSpecification[],
    EditedSpecification[],
  ] = specifications.reduce((result, spec) => {
    const [deleted, changed, inserted] = result;
    const updateData = omit(spec, 'isChanged', 'isDeleted');
    if (spec.id === -1) {
      if (!spec.isDeleted) {
        inserted.push(updateData);
      }
    } else if (spec.isDeleted) {
      deleted.push(spec.id as number);
    } else if (spec.isChanged) {
      changed.push(updateData);
    }
    return [deleted, changed, inserted];
  }, [[] as number[], [] as EditedSpecification[], [] as EditedSpecification[]]);

  if (deleted.length) {
    await db
      .deleteFrom(TABLE_SPEC)
      .where('id', 'in', deleted)
      .execute();
  }
  if (changed.length) {
    for (const spec of changed) {
      await db
        .updateTable(TABLE_SPEC)
        .set(omit(spec, 'isChanged', 'isDeleted'))
        .where('id', '=', spec.id as number)
        .execute();
    }
  }
  if (inserted.length) {
    await db
      .insertInto(TABLE_SPEC)
      .values(inserted.map((spec) => {
        const data = omit(spec, 'isChanged', 'isDeleted');
        return {
          ...data,
          category: categoryId,
        };
      }))
      .execute();
  }

  return {
    code: 0,
    data: 'ok',
  };
});

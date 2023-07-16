import { H3Event } from 'h3';
import { db } from '~/db/kysely';
import { NewProduct, TABLE_PRODUCT, TABLE_PRODUCT_SPEC } from '~/db/types';
import { ApiResponse, ProductSpecification } from '~/types';

type RequestBody = NewProduct & {
  specifications: ProductSpecification[];
};
export default defineEventHandler(async function (event: H3Event): Promise<ApiResponse<number>> {
  const body = await readBody(event) as RequestBody;
  const {
    specifications,
    more,
    ...data
  } = body;
  if (specifications.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'No specification',
    });
  }

  const product = await db
    .insertInto(TABLE_PRODUCT)
    .values({
      ...data,
      more: JSON.stringify(more),
    })
    .returning('id')
    .executeTakeFirstOrThrow();

  await db
    .insertInto(TABLE_PRODUCT_SPEC)
    .values(specifications.map((spec) => {
      return {
        ...spec,
        productId: product.id,
      };
    }))
    .execute();

  return {
    code: 0,
    data: product.id,
  };
});

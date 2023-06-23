import {
  createCategory,
  createProduct,
  createSpecification,
  createQuotation,
} from '~/db/seed';

export default defineEventHandler(async function (): Promise<void> {
  await createCategory();
  await createProduct();
  await createSpecification();
  await createQuotation();
});

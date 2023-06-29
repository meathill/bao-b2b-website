import {
  createCategory,
  createProduct,
  createSpecification,
  createQuotation,
  createProductSpec,
} from '~/db/seed';

export default defineEventHandler(async function (): Promise<void> {
  await createCategory();
  await createProduct();
  await createSpecification();
  await createQuotation();
  await createProductSpec();
});

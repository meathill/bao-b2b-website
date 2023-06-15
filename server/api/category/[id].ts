import { H3Event } from 'h3';
import { Category, Product } from '~/types';
import { createCategory, createProduct } from '~/utils';

export default defineEventHandler(async function (event: H3Event): Promise<Category> {
  return createCategory();
});

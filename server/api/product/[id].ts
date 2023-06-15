import { H3Event } from 'h3';
import { Product } from '~/types';
import { createProduct } from '~/utils';

export default defineEventHandler(async function (event: H3Event): Promise<Product> {
  return createProduct();
});

import { H3Event } from 'h3';
import { Category } from '~/db/types';

export default defineEventHandler(async function (event: H3Event): Promise<Category[]> {
  return [];
});

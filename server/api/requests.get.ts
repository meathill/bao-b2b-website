import { H3Event } from 'h3';
import { Category, Quotation } from '~/db/types';

export default defineEventHandler(async function (event: H3Event): Promise<Quotation[]> {
  return [];
});

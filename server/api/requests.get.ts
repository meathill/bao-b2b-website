import { H3Event } from 'h3';
import type { Category, RequestQuotation } from '~/types';

export default defineEventHandler(async function (event: H3Event): Promise<RequestQuotation[]> {
  return [];
});
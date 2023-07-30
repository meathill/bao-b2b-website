import { H3Event } from 'h3';

export default defineEventHandler(async function (event: H3Event): Promise<string> {
  return {
    code: 0,
    data: 'ok',
  };
});

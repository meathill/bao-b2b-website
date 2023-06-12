import { get } from '@vercel/edge-config';

export default defineNuxtRouteMiddleware(async function (to) {
  const headers = useRequestHeaders();
  const basicAuth = headers.authorization;

  if (basicAuth) {
    const [username, password] = Buffer.from(basicAuth.split(' ')[1], 'base64')
      .toString().split(':');
    const adminUser = await get('adminUser');
    const adminPassword = await get('adminPassword');
    if (username === adminUser && password === adminPassword) {
      return;
    }
  }

  return abortNavigation('401 Unauthorized');
});

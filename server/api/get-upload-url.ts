import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import slugify from 'slugify';
import { H3Event } from 'h3';
import { S3 } from '~/lib/s3';
import { ApiResponse, PreSignedUrl } from '~/types';

export default defineEventHandler(async function (event: H3Event): Promise<ApiResponse<PreSignedUrl>> {
  const json = await readBody(event) as { fileName: string | undefined, fileType: string | undefined };
  const { fileName, fileType } = json;

  if (!fileName || !fileType || fileName.trim() === '' || fileType.trim() === '') {
    throw createError({
      statusCode: 400,
      message: 'Missing required parameters.',
    });
  }

  const objectKey = `${slugify(Date.now().toString())}-${slugify(fileName)}`;

  const preSignedUrl = await getSignedUrl(S3, new PutObjectCommand({
    Bucket: process.env.PUBLIC_S3_BUCKET_NAME,
    Key: objectKey,
    ContentType: fileType,
    ACL: 'public-read',
  }), {
    expiresIn: 60 * 5, // 5 minutes
  });

  return {
    code: 0,
    data: {
      preSignedUrl,
      objectKey,
    },
  };
});

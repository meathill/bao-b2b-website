import 'dotenv/config';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import Redis from 'ioredis';
import slugify from 'slugify';
import { sql } from '@vercel/postgres';
import { html2Markdown } from '@inkdropapp/html2markdown';
import categories from './categories.js';

async function createCategory(cate, parent) {
  const slug = slugify(cate, { lower: true });
  const { rows } = await sql`INSERT INTO category
(name, slug, parent)
VALUES (${cate}, ${slug}, ${parent})
RETURNING id;`;
  return rows[0].id;
}
async function createProduct(productName, description, images, subCategoryId, productModel, specifications) {
  const slug = slugify(productName, { lower: true });
  console.log('Create product:', `INSERT INTO product
(name, slug, description, images, category, model, more)
VALUES ('${productName}', '${slug}', '${description}', '${JSON.stringify(images)}', ${subCategoryId}, '${productModel}', '${JSON.stringify(specifications)}')
RETURNING id;`);
  const { rows } = await sql`INSERT INTO product
(name, slug, description, images, category, model, more)
VALUES ('${productName}', '${slug}', '${description}', '${JSON.stringify(images)}', ${subCategoryId}, '${productModel}', '${JSON.stringify(specifications)}')
RETURNING id;`;
  return rows[0].id;
}

const created = {};
const storeFile = './created.json';
if (existsSync(storeFile)) {
  const stored = await readFile(storeFile, 'utf8');
  Object.assign(created, JSON.parse(stored));
}

const redis = new Redis(6379, '34.150.103.85', {
  password: 'ooxx123321dskljdf',
  db: 0,
});

let i = 0;

for (const topType in categories) {
  for (const secType in categories[topType]) {
    // 二级分类需要写入
    let categoryId = created[secType];
    if (!categoryId) {
      categoryId = await createCategory(secType);
      created[secType] = categoryId;
      await writeFile(storeFile, JSON.stringify(created));
    }
    for (const pType in categories[topType][secType]) {
      // 三级分类需要写入
      let subCategoryId = created[pType];
      if (!subCategoryId) {
        subCategoryId = await createCategory(pType, categoryId);
        created[pType] = subCategoryId;
        await writeFile(storeFile, JSON.stringify(created));
      }

      const url = categories[topType][secType][pType];

      // 组合分类唯一key，用于存储集合
      const key = [topType, secType, url].join('|');

      const allInfoList = await redis.hgetall(key);

      for (const k in allInfoList) {
        const info = JSON.parse(allInfoList[k]);
        console.log('Fetch info:', info);

        // 输出基本信息
        const productModel = info.model;
        const productName = info.name;
        if (created[productModel]) {
          continue;
        }

        // 读取产品信息
        let data = await redis.get(info.model);
        const specifications = JSON.parse(data);
        console.log('Specifications:', specifications);

        // 读取图片信息。先不下载图片，蹭他们的试试
        data = await redis.get(info.model + '_pic');
        let images = JSON.parse(data);
        images = images.filter((img) => img.includes('550x550'));
        console.log('Product images:', images);

        // 读取产品描述
        const html = await redis.get(info.model + '_dis');
        const description = html2Markdown(html);

        // 将产品插入表
        const productId = await createProduct(productName, description, images, subCategoryId, productModel, specifications);
        created[productModel] = productId;
        await writeFile(storeFile, JSON.stringify(created));

        // 提取产品参数
        for (const key in specifications) {
          const specGroup = specifications[key];
          for (const specKey in specGroup) {
            const specValue = specGroup[key];
            const storeKey = `spec_${subCategoryId}-${specKey}`;
            let specId = created[storeKey];
            if (!specId) {
              const { rows } = await sql`INSERT INTO specification
(name, type, category)
VALUES ("${specKey}", 1, "${subCategoryId}")
RETURNING id;`;
              specId = rows[0].id;
              created[storeKey] = specId;
              await writeFile(storeFile, JSON.stringify(created));
            }
            // 插入参数记录
            await sql`INSERT INTO productSpec
(productId, specId, value)
VALUES (${productId}, ${specId}, "${specValue}");`;
          }
        }

        i += 1;
        console.log('Product count:', i);
      }
    }
  }
}

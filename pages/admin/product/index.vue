<script setup lang="ts">
import type { ApiResponse, RowItem } from '~/types';
import type { Category, Product } from '~/db/types';
import { formatDate } from '~/utils';
import { useProductStore } from '~/store';

type LocalRowItem = Product & RowItem;

const productStore = useProductStore();
const page = ref<number>(0);
const size = ref<number>(20);
const message = ref<string>('');
const { data: products, pending } = await useAsyncData<Product[]>(
  'products',
  async function () {
    const { data } = await $fetch<ApiResponse<Product[]>>('/api/products', {
      query: {
        page: page.value,
        size: size.value,
      },
    });
    return data;
  },
  {
    default() {
      return [];
    },
    transform(from: Product[]): LocalRowItem[] {
      return from.map((product: Product) => {
        const { createdAt, updatedAt } = product;
        return {
          ...product,
          isSaving: false,
          createdAt: formatDate(createdAt as string),
          updatedAt: formatDate(updatedAt as string),
        };
      });
    },
  },
);
const { data: categories } = await useAsyncData<Record<string, Category>>(
  'categories',
  async function () {
    if (productStore.isLoaded) { return productStore.categories }

    await productStore.refreshCategories();
    return productStore.categories;
  },
  {
    default() {
      return productStore.isLoaded ? productStore.categories : {};
    },
  },
);

async function doRemove(item: RowItem, index: number): Promise<void> {
  if (!confirm('Are you sure to remove this category?')) { return }

  item.isSaving = true;
  try {
    await $fetch(`/api/product/${item.id}`, {
      method: 'DELETE',
    });
    products.value && products.value.splice(index, 1);
  } catch (e) {
    message.value = (e as Error).message || String(e);
  }
  item.isSaving = false;
}
</script>

<template lang="pug">
header.flex.items-center.justify-between.mb-4
  h1.text-2xl.font-bold Products
  nuxt-link.btn.btn-primary(to="/admin/product/new")
    i.bi.bi-plus-lg
    | Create new Product

table.table.table-zebra.border
  thead
    tr
      th Name
      th Category
      th Slug
      th Images
      th Date
      th
  tbody
    tr(v-if="pending")
      td.text-center(colspan="5")
        span.loading.loading-spinner.mr-2
        | Loading...
    tr(v-for="(item, index) in products")
      td
        nuxt-link.link.link-primary(
          :to="'/admin/product/' + item.id"
        ) {{ item.name }}
      td {{ categories[item.category].name }}
      td {{ item.slug }}
      td
        template(
          v-for="image in item.images"
          :key="image"
        )
          img.w-12(
            v-if="/\.(jpg|png|webp)$/.test(image)"
            :src="useImageProxy(image)"
          )
          nuxt-link(
            v-else
            :to="image"
            target="_blank"
          )
            i.bi.bi-video
      td.text-xs
        time(:datetime="item.createdAt") {{ item.createdAt }}
        span.mx-1 /
        time(:datetime="item.createdAt") {{ item.updatedAt }}
      td
        .join
          button.btn.btn-sm.btn-error.join-item(
            type="button"
            :disabled="item.isSaving"
            @click="doRemove(item, index)"
          )
            span.loading.loading-spinner(v-if="item.isSaving")
            i.bi.bi-trash3(v-else)
</template>

<script lang="ts">
export default {
  name: 'AdminProductsIndex',
};
</script>

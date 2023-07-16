<script setup lang="ts">
import type { ApiResponse, RowItem } from '~/types';
import type { Product } from '~/db/types';
import { formatDate } from '~/utils';

type LocalRowItem = Product & RowItem;

const page = ref<number>(0);
const size = ref<number>(20);
const message = ref<string>('');
const { data: products, pending } = useAsyncData(
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
      th Description
      th Date
      th
  tbody
    tr(v-if="pending")
      td.text-center(colspan="5")
        span.loading.loading-spinner.mr-2
        | Loading...
    tr(v-for="(item, index) in products")
      td {{ item.name }}
      td {{ item.category }}
      td {{ item.slug }}
      td {{ item.description }}
      td.text-xs
        time(:datetime="item.createdAt") {{ item.createdAt }}
        span.mx-1 /
        time(:datetime="item.createdAt") {{ item.updatedAt }}
      td
        .join
          nuxt-link.btn.btn-sm.btn-success.join-item(
            :to="'/admin/product/' + item.id"
          )
            i.bi.bi-pen
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

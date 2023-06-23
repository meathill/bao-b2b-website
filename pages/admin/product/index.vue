<script setup lang="ts">
import type { Product, RowItem } from '~/types';
import { formatDate } from '~/utils';

type LocalRowItem = Product & RowItem;

const { data: categories, pending } = useFetch('/api/products',
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
      td.text-center(colspan="4")
        span.loading.loading-spinner.mr-2
        | Loading...
    tr(v-for="item in categories")
      td {{ item.name }}
      td {{ item.category }}
      td {{ item.slug }}
      td {{ item.description }}
      td.text-xs
        time(:datetime="item.created_at") {{ item.createdAt }}
        | /
        time(:datetime="item.updated_at") {{ item.updatedAt }}
      td
        .join
          nuxt-link.btn.btn-xs.btn-success.join-item(
            :to="'/admin/product/' + item.id"
          )
            i.bi.bi-pen
          button.btn.btn-xs.btn-error.join-item(
            type="button"
            :disabled="item.isSaving"
          )
            span.loading.loading-spinner(v-if="item.isSaving")
            i.bi.bi-trash3(v-else)
</template>

<script lang="ts">
export default {
  name: 'AdminProductsIndex',
};
</script>

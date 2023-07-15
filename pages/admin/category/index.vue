<script setup lang="ts">
import type { RowItem, ApiResponse } from '~/types';
import type { Category } from '~/db/types';
import { formatDate } from '~/utils';

type LocalRowItem = Category & RowItem;

const message = ref<string>('');
const total = ref<number>(0);

const { data: categories, pending } = useAsyncData('categories',
  async function () {
    try {
      const { data, meta } = await $fetch<ApiResponse<Category[]>>('/api/categories');
      total.value = meta?.total || 0;
      return data;
    } catch (e) {
      message.value = (e as Error).message || String(e);
    }
  },
  {
    default() {
      return [];
    },
    transform(from: Category[]): LocalRowItem[] {
      return from.map((category: Category) => {
        const { createdAt, updatedAt } = category;
        return {
          ...category,
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
  h1.text-2xl.font-bold Categories
  nuxt-link.btn.btn-primary(to="/admin/category/new")
    i.bi.bi-plus-lg
    | Create new Category

table.table.table-zebra.border
  thead
    tr
      th Name
      th Parent
      th Slug
      th Description
      th Date
      th
  tbody
    tr(v-if="pending")
      td.text-center(colspan="5")
        span.loading.loading-spinner.mr-2
        | Loading...
    tr(v-for="item in categories")
      td
        nuxt-link.link(
          :to="'/admin/category/' + item.id"
        ) {{ item.name }}
      td {{ item.parent }}
      td {{ item.slug }}
      td {{ item.description }}
      td.text-xs
        time(:datetime="item.createdAt") {{ item.createdAt }}
        span.mx-2 /
        time(:datetime="item.updatedAt") {{ item.updatedAt }}
      td
        .join
          nuxt-link.btn.btn-xs.btn-success.join-item(
            :to="'/admin/category/' + item.id"
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
  name: 'AdminCategoryIndex',
};
</script>

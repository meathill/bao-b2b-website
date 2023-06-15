<script setup lang="ts">
import type { Category, RowItem } from '~/types';
import { formatDate } from '~/utils';

type LocalRowItem = Category & RowItem;

const { data: categories, pending } = useFetch('/api/categories',
  {
    default() {
      return [];
    },
    transform(from: Category[]): LocalRowItem[] {
      return from.map((category: Category) => {
        const { created_at, updated_at } = category;
        return {
          ...category,
          isSaving: false,
          createdAt: formatDate(created_at as string),
          updatedAt: formatDate(updated_at as string),
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
      td.text-center(colspan="4")
        span.loading.loading-spinner.mr-2
        | Loading...
    tr(v-for="item in categories")
      td {{ item.name }}
      td {{ item.parent }}
      td {{ item.slug }}
      td {{ item.description }}
      td.text-xs
        time(:datetime="item.created_at") {{ item.createdAt }}
        | /
        time(:datetime="item.updated_at") {{ item.updatedAt }}
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

<script setup lang="ts">
import type { RowItem } from '~/types';
import type { Category } from '~/db/types';
import { formatDate } from '~/utils';
import { useProductStore } from '~/store';

type LocalRowItem = Category & RowItem;

const productStore = useProductStore();
const message = ref<string>('');

const { data: categories, pending } = await useAsyncData<Category[]>(
  'categories',
  async function () {
    if (productStore.isLoaded) {
      return Object.values(productStore.categories);
    }
    return await productStore.refreshCategories();
  },
  {
    default() {
      return productStore.isLoaded ? Object.values(productStore.categories) : [];
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
async function doRemove(item: RowItem, index: number): Promise<void> {
  if (!confirm('Are you sure to remove this category?')) { return }

  item.isSaving = true;
  try {
    await $fetch(`/api/category/${item.id}`, {
      method: 'DELETE',
    });
    categories.value && categories.value.splice(index, 1);
  } catch (e) {
    message.value = (e as Error).message || String(e);
  }
  item.isSaving = false;
}
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
    tr(v-for="(item, index) in categories")
      td
        nuxt-link.link.link-primary(
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
  name: 'AdminCategoryIndex',
};
</script>

<script setup lang="ts">
import type { Category } from '~/db/types';
import { useProductStore } from '~/store';

const productStore = useProductStore();

const { data: categories } = await useAsyncData<Category[]>(
  'categories',
  async function () {
    const categories = productStore.isLoaded
      ? Object.values(productStore.categories)
      : await productStore.refreshCategories();
    return categories.filter(category => category.isHomepage);
  },
  {
    default() {
      return productStore.isLoaded
        ? Object.values(productStore.categories).filter(category => category.isHomepage)
        : [];
    },
  },
);
</script>

<template lang="pug">
main.container.mx-auto.py-4
  breadcrumbs
  h1.text-2xl.font-bold.mb-4.pb-4.border-b Cateogries
  .grid.grid-cols-3.gap-4
    nuxt-link.border.p-4(
      v-for="item in categories"
      class="hover:border-primary"
      :key="item.id"
      :to="'/category/' + item.id"
    )
      h2.text-lg.font-semibold {{item.name}}
      p {{item.description}}
</template>

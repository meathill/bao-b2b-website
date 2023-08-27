<script setup lang="ts">
import { useProductStore } from '~/store';
import type { Category, Product } from '~/db/types';
import type { ApiResponse } from '~/types';

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
const { data: products } = await useAsyncData<Product[]>(
  'home-products',
  async function () {
    const { data } = await $fetch<ApiResponse<Product[]>>('/api/products', {
      query: {
        page: 0,
        size: 4,
      },
    });
    return data;
  },
  {
    default() {
      return [];
    },
  },
);
const { data: hotSelling } = await useAsyncData<Product[]>(
  'hot-selling',
  async function () {
    const page = Math.random() * (1650 - 30) / 30 >> 0; // total 1680 products
    const { data } = await $fetch<ApiResponse<Product[]>>('/api/products', {
      query: {
        page,
        size: 30,
      },
    });
    return data;
  },
  {
    default() {
      return [];
    },
  },
);
</script>

<template lang="pug">
main.flex.container.mx-auto.pt-4.gap-4
  aside.border.w-80.flex.flex-col
    header.bg-base-300.px-4.py-2
      h2.text-xl.font-semibold Product Category
    ul.menu
      li(
        v-for="item in categories"
        :key="item.id"
      )
        nuxt-link(:to="'/category/' + (item.slug || item.id)") {{item.name}}
    nuxt-link.block.px-4.py-1.flex.justify-between.bg-base-200.border-t.mt-auto(
      to="/categories"
    ) View all
      i.bi.bi-chevron-right

  .flex-1.border.h-60
    h2.text-3xl.font-semibold.flex.justify-center.items-center.h-full.bg-neutral.text-neutral-content Awesome product,
      br
      | beyond your imagination
.flex.container.mx-auto.pt-4.gap-4
  .border.w-80
    .h-full.bg-gray-700.flex.justify-center.items-center.text-neutral-content (Product Category Highlights)
  .flex-1.border.flex.flex-col
    header.flex.px-4.py-2.border-b.items-center.justify-between
      h2.text-lg.font-semibold Newest Products
      nuxt-link.text-xs(to="/products") View all
        i.bi.bi-chevron-right
    .flex.flex-1
      nuxt-link.flex-1.px-4.py-2.border-r.flex.flex-col.items-center(
        v-for="item in products"
        class="hover:bg-base-200"
        :key="item.id"
        :to="'/product/' + (item.slug || item.id)"
      )
        img.block.w-24(
          v-if="item.images?.length"
          :src="useImageProxy(item.images[0])"
          :alt="item.name"
        )
        h3 {{item.name}}
        p.text-xs {{item.digest}}
.container.mx-auto.mt-4.border
  header.flex.px-4.py-2.border-b.items-center.justify-between
    h2.text-xl.font-semibold Hot Selling Products
    nuxt-link.text-xs(to="/products") View all
      i.bi.bi-chevron-right
  .grid.grid-cols-5.items-center
    nuxt-link.flex.flex-col.items-center.text-sm.p-4.text-center(
      v-for="item in hotSelling"
      class="hover:bg-base-200"
      :key="item.id"
      :to="'/product/' + (item.slug || item.id)"
    )
      h3 {{item.name}}

</template>

<script lang="ts">
export default {
  name: 'Homepage',
};
</script>

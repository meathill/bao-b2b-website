<script setup lang="ts">
import type { ApiResponse } from '~/types';
import type { Product } from '~/db/types';

const { data: products, pending, refresh } = useAsyncData(
  'products',
  async function () {
    const { data: products } = await $fetch<ApiResponse<Product[]>>('/api/products');
    return products;
  },
  {
    default() {
      return [];
    },
  },
);
</script>

<template lang="pug">
main.container.mx-auto.py-4
  breadcrumbs
  h1.text-2xl.font-bold.mb-4.pb-4.border-b Products
  .grid.grid-cols-3.gap-4
    nuxt-link.border.p-4(
      v-for="item in products"
      class="hover:border-primary"
      :key="item.id"
      :to="'/product/' + item.id"
    )
      img.block.mb-2(
        v-if="item.images && item.images.length"
        :src="useImageProxy(item.images[0])"
        :alt="item.name"
      )
      h2.text-lg.font-semibold {{item.name}}
      p {{item.digest}}
</template>

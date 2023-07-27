<script setup lang="ts">
import type { ApiResponse } from '~/types';
import type { Product } from '~/db/types';

const route = useRoute();
const productId = Number(route.params.id);

const { data: product } = useAsyncData<ApiResponse<Product>>(
  'product-' + productId,
  async function () {
    const { data } = await $fetch<ApiResponse<Product>>('/api/product/' + productId);
    return data;
  },
  {
    default() {
      return {};
    },
  },
);
</script>

<template lang="pug">
main.container.mx-auto.py-4
  breadcrumbs(
    :category="product.category"
    :title="product.name"
  )
  h1.text-2xl.font-bold.mb-4 {{product.name}}
</template>

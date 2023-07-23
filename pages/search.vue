<script setup lang="ts">
import type { Product } from '~/db/types';
import type { ApiResponse } from '~/types';

const route = useRoute();
const search = route.query.search;

const { data, pending } = useAsyncData(
  'search',
  async function () {
    const { data } = await $fetch<ApiResponse<Product[]>>('/api/search?search=' + search);
    return data as Product[];
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
  h1.text-2xl.font-bold Search: "{{search}}"
  hr.my-4
  p.text-center.py-4(v-if="pending")
    span.loading.loading-spinner
  p.text-center.text-center.py-4(v-else-if="data.length === 0") No results found
  nuxt-link.border.block.rounded-box.mb-4.p-4(
    v-for="product in data"
    class="hover:bg-primary/10 hover:border-primary"
    :key="product.id"
    :to="'/product/' + product.id"
  )
    h2.text-xl.font-bold.mb-2 {{product.name}}
    p {{product.description}}
</template>

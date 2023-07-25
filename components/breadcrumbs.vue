<script setup lang="ts">
import { useProductStore } from '~/store';
import type { ApiResponse } from '~/types';
import type { Category } from '~/db/types';

type Props = {
  title?: string;
  category?: number;
};
const props = defineProps<Props>();

const route = useRoute();
const productStore = useProductStore();

const { data } = useAsyncData(
  async function () {
    if (!props.category || !route.path.startsWith('/category')) {
      return [];
    }
    const { data } = await $fetch < ApiResponse<Partial<Category>[]>('/api/category/find-path', {
      method: 'POST',
      body: {
        id: props.category,
      },
    });
    return data || [];
  },
  {
    default() {
      return [];
    },
  },
);

</script>

<template lang="pug">
.text-sm.breadcrumbs.mb-4.bg-base-200
  ul.pl-4
    li
      nuxt-link(
        to="/"
      )
        i.bi.bi-house-fill.mr-2
        | Home
    template(v-if="!props.title")
      li(
        v-for="item in data"
        :key="item.id"
      )
        nuxt-link(
          :to="'/category/' + item.id"
        ) {{item.name}}
    li(v-else) {{props.title}}
</template>

<script lang="ts">
export default {
  name: 'GlobalBreadcrumbs',
};
</script>

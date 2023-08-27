<script setup lang="ts">
import type { ApiResponse } from '~/types';
import type { Category } from '~/db/types';

type Props = {
  title?: string;
  category?: number;
};
const props = defineProps<Props>();

const { data, refresh } = await useAsyncData(
  async function () {
    if (!props.category) {
      return [];
    }
    const { data } = await $fetch<ApiResponse<Partial<Category[]>>>('/api/category-path', {
      params: {
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
    li(
      v-for="item in data"
      :key="item.id"
    )
      nuxt-link(
        :to="'/category/' + (item.slug || item.id)"
      ) {{item.name}}
    li(v-if="title") {{title}}
</template>

<script lang="ts">
export default {
  name: 'GlobalBreadcrumbs',
};
</script>

<script setup lang="ts">
import type { ApiResponse } from '~/types';
import type { Category, Product, ProductSpec, Specification } from '~/db/types';
import { formatFilter } from '~/utils';

const route = useRoute();
const categoryId = Number(route.params.id);

const specFilter = ref<Record<string, string[]>>({});
const { data: category } = useAsyncData(
  'category-' + categoryId,
  async function () {
    const { data: category } = await $fetch<ApiResponse<Category>>('/api/category/' + categoryId);
    if (!category) { return {} }
    for (const spec of category.specifications) {
      specFilter.value[spec.id] = [];
    }
    return category;
  },
  {
    default() {
      return {};
    },
  },
);
const { data: products, pending, refresh } = useAsyncData(
  `cate-${categoryId}-products`,
  async function () {
    const params = new URLSearchParams();
    params.set('category', categoryId.toString());
    params.set('filter', formatFilter(specFilter.value));
    const { data: products } = await $fetch<ApiResponse<Product[]>>('/api/products?' + params.toString());
    return products;
  },
  {
    default() {
      return [];
    },
  },
);
const { data: specifications } = useAsyncData(
  `cate-${categoryId}-specifications`,
  async function () {
    const { data: specifications } = await $fetch<ApiResponse<ProductSpec[]>>('/api/product-spec?category=' + categoryId);
    return (specifications || []).reduce((acc: Record<string, string[]>, spec: ProductSpec) => {
      if (!acc[spec.id]) {
        acc[spec.id] = [];
      }
      if (acc[spec.id].includes(spec.value)) {
        return acc;
      }
      acc[spec.id].push(spec.value);
      return acc;
    }, {} as Record<string, string[]>);
  },
  {
    default() {
      return {} as Record<string, string[]>;
    },
  },
);
const theSpecifications = computed<Record<string, Specification>>(() => {
  return (category.value.specifications || []).reduce((acc: Record<string, Specification>, spec: Specification) => {
    acc[spec.id] = spec;
    return acc;
  }, {} as Record<string, any>);
});

function onToggleSpec(cateId: number, option: string): Promise<void> {
  const spec = specFilter.value[cateId];
  if (!spec || !Array.isArray(spec)) {
    specFilter.value[cateId] = [option];
  } else if (spec.includes(option)) {
    spec.splice(spec.indexOf(option), 1);
  } else {
    spec.push(option);
  }
  return refresh();
}
</script>

<template lang="pug">
main.container.mx-auto.py-4
  h1.text-2xl.font-bold.mb-4 {{category.name}}
  .flex.gap-8
    aside.w-72.flex-none
      .border.mb-4(
        v-for="item in category.specifications"
        :key="item.id"
      )
        h3.text-lg.font-semibold.pb-2.border-b.px-4.py-3 {{item.name}}
        .form-control.px-4.py-3.flex.flex-column.gap-2
          label.label.cursor-pointer.justify-start.gap-2(
            v-for="option in specifications[item.id]"
          )
            input.checkbox(
              type="checkbox"
              :name="'spec-' + item.id"
              :value="option"
              @change="onToggleSpec(item.id, option)"
            )
            span.label-text {{option}}

    .flex-1.border-t.relative
      .border-b.flex.py-4.gap-4(
        v-for="item in products"
        :key="item.id"
      )
        .product-thumbnail.w-80
          nuxt-link(
            :to="'/product/' + item.id"
          )
            img(
              :src="item.images[0]"
              :alt="item.name"
            )
        .flex-1
          h2.text-xl.font-semibold.mb-4
            nuxt-link(
              :to="'/product/' + item.id"
            ) {{item.name}}
          p {{item.digest}}
      .absolute.top-0.left-0.right-0.bottom-0.bg-white.opacity-75.z-10.flex.justify-center.items-center(
        v-if="pending"
      )
        span.loading.loading-spinner.text-2xl
</template>

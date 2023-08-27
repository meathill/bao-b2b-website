<script setup lang="ts">
import mapValues from 'lodash/mapValues';
import type { ApiResponse } from '~/types';
import type { Category, Product, ProductSpec } from '~/db/types';
import { formatFilter } from '~/utils';
import { useQuotationStore } from '~/store';

const route = useRoute();
const idOrSlug = route.params.id as string;

const specFilter = ref<Record<string, string[]>>({});
const page = ref<number>(1);
const total = ref<number>(0);
const { data: category } = await useAsyncData(
  'category-' + idOrSlug,
  async function () {
    const { data: category } = await $fetch<ApiResponse<Category>>('/api/category/' + idOrSlug);
    if (!category) { return {} }
    specFilter.value = {};
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
const { data: products, pending } = await useAsyncData(
  `cate-${idOrSlug}-products`,
  async function () {
    const { data: products, meta } = await $fetch<ApiResponse<Product[]>>('/api/products', {
      params: {
        category: idOrSlug,
        filter: formatFilter(specFilter.value),
        page: page.value,
      },
    });
    total.value = meta?.total || 0;
    return (products || []).map(product => ({ ...product, quantity: 1 }));
  },
  {
    default() {
      return [];
    },
    watch: [specFilter, page],
  },
);
const { data: specifications } = await useAsyncData(
  `cate-${idOrSlug}-specifications`,
  async function () {
    const { data } = await $fetch<ApiResponse<ProductSpec[]>>('/api/product-spec', {
      params: {
        category: idOrSlug,
      },
    });
    const specifications = (data || []).reduce((acc: Record<string, string[]>, spec: ProductSpec) => {
      if (!acc[spec.id]) {
        acc[spec.id] = [];
      }
      if (acc[spec.id].includes(spec.value)) {
        return acc;
      }
      acc[spec.id].push(spec.value);
      return acc;
    }, {} as Record<string, string[]>);
    return mapValues(specifications, value => value.sort());
  },
  {
    default() {
      return {} as Record<string, string[]>;
    },
  },
);
const isFirstPage = computed<boolean>(() => page.value <= 1);
const isLastPage = computed<boolean>(() => page.value >= total.value / 20);

function doRequestQuotation(product: Product): void {
  const quotationStore = useQuotationStore();
  quotationStore.addQuotation({
    productId: product.id,
    productName: product.name,
    quantity: product.quantity || 1,
    price: 100,
    comment: '',
  });
}
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
  breadcrumbs(
    :category="Number(category.parent)"
    :title="category.name"
  )
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
            :to="'/product/' + (item.slug || item.id)"
          )
            img(
              v-if="item.images?.length"
              :src="useImageProxy(item.images[0])"
              :alt="item.name"
              loading="lazy"
            )
        .flex-1.flex.flex-col
          h2.text-xl.font-semibold.mb-4
            nuxt-link.link(
              class="hover:no-underline"
              :to="'/product/' + (item.slug || item.id)"
            ) {{item.name}}
          p {{item.digest}}
          footer.mt-auto.flex.justify-end
            request-quotation(
              :product="item"
              hide-inquiry
            )
      .absolute.top-0.left-0.right-0.bottom-0.bg-white.opacity-75.z-10.flex.justify-center.items-center(
        v-if="pending"
      )
        span.loading.loading-spinner.text-2xl

      .mt-4.join.grid.grid-cols-2.max-w-xs.ml-auto(
        v-if="total > 20"
      )
        button.join-item.btn.btn-outline(
          type="button"
          :disabled="pending || isFirstPage"
          @click="page -= 1"
        ) Previous
        button.join-item.btn.btn-outline(
          type="button"
          :disabled="pending || isLastPage"
          @click="page += 1"
        ) Next
</template>

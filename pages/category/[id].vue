<script setup lang="ts">
import type { ApiResponse } from '~/types';
import type { Category, Product, ProductSpec, Specification } from '~/db/types';
import { formatFilter } from '~/utils';
import { useQuotationStore } from '~/store';

const route = useRoute();
const idOrSlug = route.params.id as string;

const specFilter = ref<Record<string, string[]>>({});
const { data: category } = useAsyncData(
  'category-' + idOrSlug,
  async function () {
    const { data: category } = await $fetch<ApiResponse<Category>>('/api/category/' + idOrSlug);
    if (!category) { return {} }
    for (const spec of category.specifications) {
      specFilter.value[spec.id] = [];
    }
    await Promise.all([
      refreshSpecifications(),
      refresh(),
    ]);
    return category;
  },
  {
    default() {
      return {};
    },
  },
);
const { data: products, pending, refresh } = useAsyncData(
  `cate-${idOrSlug}-products`,
  async function () {
    if (isNaN(Number(idOrSlug)) && !category.value) {
      return [];
    }
    const { data: products } = await $fetch<ApiResponse<Product[]>>('/api/products', {
      params: {
        category: category.value.id,
        filter: formatFilter(specFilter.value),
      },
    });
    return (products || []).map(product => ({ ...product, quantity: 1 }));
  },
  {
    default() {
      return [];
    },
  },
);
const { data: specifications, refresh: refreshSpecifications } = useAsyncData(
  `cate-${idOrSlug}-specifications`,
  async function () {
    if (isNaN(Number(idOrSlug)) && !category.value) {
      return [];
    }
    const { data: specifications } = await $fetch<ApiResponse<ProductSpec[]>>('/api/product-spec', {
      params: {
        category: category.value.id,
      },
    });
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

function doRequest(product: Product): void {
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
              :src="item.images[0]"
              :alt="item.name"
            )
        .flex-1.flex.flex-col
          h2.text-xl.font-semibold.mb-4
            nuxt-link.link(
              class="hover:no-underline"
              :to="'/product/' + (item.slug || item.id)"
            ) {{item.name}}
          p {{item.digest}}
          footer.mt-auto.flex.justify-end
            input.input.input-bordered.input-sm.w-16.always-spin.pr-0(
              type="number"
              min="1"
              v-model="item.quantity"
            )
            button.btn.btn-primary.btn-sm.ml-4(
              type="button"
              @click="doRequest"
            ) Request quotation
      .absolute.top-0.left-0.right-0.bottom-0.bg-white.opacity-75.z-10.flex.justify-center.items-center(
        v-if="pending"
      )
        span.loading.loading-spinner.text-2xl
</template>

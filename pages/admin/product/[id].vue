<script setup lang="ts">
import { createProduct, createProductSpecification } from '~/utils';
import type { Category, Product, ProductSpec, Specification } from '~/db/types';
import type { ApiResponse } from '~/types';

const route = useRoute();
const isNew = route.params.id === 'new';
const productName = ref<HTMLInputElement>();
const specName = ref<HTMLInputElement[]>();

const isSaving = ref<boolean>(false);
const isLoadingSpec = ref<boolean>(false);
const status = ref<boolean>(false);
const message = ref<string>('');
const { data: products } = useNuxtData('/api/products');
const { data: product, pending } = useAsyncData(
  '/api/product/' + route.params.id,
  async function () {
    if (isNew) { return createProduct() }

    try {
      const { data: product } = await $fetch<ApiResponse<Product>>('/api/product/' + route.params.id);
      return product;
    } catch (e) {
      message.value = (e as Error).message || String(e);
      return createProduct();
    }
  },
  {
    default() {
      return (products.value || [])
        .find((cat: Product) => cat.id === Number(route.params.id)) ||
        createProduct();
    },
  },
);
const { data: categories } = useAsyncData<Category[]>(
  'categories',
  async function () {
    const { data } = await $fetch<ApiResponse<Category[]>>('/api/categories');
    return data || [];
  },
  {
    default() {
      return [];
    },
  },
);
const requiredSpecs = ref<Specification[]>([]);
const productSpecValues = computed<Record<string, string>>(() => {
  return product.value
    ? product.value?.specifications?.reduce((acc: Record<string, string>, spec: ProductSpec) => {
      acc[spec.specId] = spec.value;
      return acc;
    }, {})
    : {};
});

watch(product, (value) => {
  if (value) {
    onCategoryChange(value.category);
  }
});

async function doSave(event: Event): Promise<void> {
  if ((event.target as HTMLFormElement).matches(':invalid')) { return }
  if (isSaving.value || isLoadingSpec.value) { return }

  isSaving.value = true;
  const url = isNew ? '/api/product' : '/api/product/' + route.params.id;
  const method = isNew ? 'POST' : 'PUT';
  const { data } = await $fetch<ApiResponse<number>>(url, {
    method,
    body: {
      ...product.value,
      specifications: requiredSpecs.value.map((spec: Specification) => {
        return {
          specId: spec.id,
          value: spec.value,
        };
      }),
    },
  });
  if (isNew) {
    const router = useRouter();
    await router.replace('/admin/product/' + data);
  }
  isSaving.value = false;
}
async function doAddSpecification(): Promise<void> {
  product.value.more.push(createProductSpecification());
  await nextTick();
  const input = specName.value && specName.value[0] as HTMLInputElement;
  input?.focus();
}
async function onCategoryChange(event: Event | number): Promise<void> {
  if (isLoadingSpec.value) { return }

  isLoadingSpec.value = true;
  const category = typeof event === 'number'
    ? event
    : (event.target as HTMLSelectElement).value;
  const { data } = await $fetch<ApiResponse<Specification[]>>(
    '/api/specifications?category=' + category,
  );
  requiredSpecs.value.length = 0;
  const productSpecs = (data || []).map((spec) => {
    const value = productSpecValues.value[spec.id];
    return {
      ...spec,
      value,
    };
  });
  requiredSpecs.value.push(...productSpecs);
  isLoadingSpec.value = false;
}

onMounted(() => {
  productName.value?.focus();
});
</script>

<template lang="pug">
header.flex.items-center.pb-4.mb-4.border-b
  h1.text-2xl.font-bold {{isNew ? 'Create' : 'Edit'}} Product
  span.loading.loading-spinner.ml-2(v-if="pending")
  button.btn.btn-primary.ml-auto(
    form="editor"
    :disabled="isSaving"
  )
    span.loading.loading-spinner(v-if="isSaving")
    i.bi.bi-check-lg(v-else)
    | Save

.alert(
  v-if="message"
  :class="{ 'alert-success': status, 'alert-error': !status }"
)
  p
    i.bi.bi-exclamation-triangle-fill.mr-2
    | {{message}}

form#editor.flex.gap-4.mx-auto(@submit.prevent="doSave")
  .flex-none(class="w-1/2")
    .form-control
      label.label
        span.label-text Name
      input.input.input-bordered(
        ref="productName"
        required
        name="productName"
        placeholder="Category name"
        v-model="product.name"
      )
    .form-control
      label.label
        span.label-text Slug
      input.input.input-bordered(
        required
        name="productSlug"
        placeholder="Category slug"
        v-model="product.slug"
      )
    .form-control
      label.label
        span.label-text Description
      textarea.input.input-bordered.h-24(
        name="productDescription"
        placeholder="Category description"
        rows="3"
        v-model="product.description"
      )
    .form-control
      label.label
        span.label-text Category
      select.select.select-bordered(
        name="productCategory"
        :disabled="isLoadingSpec"
        v-model="product.category"
        @change="onCategoryChange"
      )
        option.disabled(
          :value="-1"
        ) === Select category ===
        option(
          v-for="item in categories"
          :key="item.id"
          :value="item.id"
        ) {{item.name}}
  .flex-1
    label.label
      span.label-text Category Specifications
    .pl-4(v-if="isLoadingSpec")
      span.loading.loading-spinner
    .grid.grid-cols-2.gap-2.mb-4(v-else-if="requiredSpecs.length")
      template(
        v-for="item in requiredSpecs"
        :key="item.name"
      )
        label.label
          span.label-text {{item.name}}
        .form-control
          input.input.input-bordered(
            required
            v-model="item.value"
          )
    p.text-gray-400.text-sm.mb-4.indent-4(v-else) No specifications for this category

    label.label
      span.label-text Product Specifications
    .grid.grid-cols-2.gap-2
      label.label
        span.label-text Name
      label.label
        span.label-text Value
      template(
        v-for="(item, index) in product.more"
        :key="index"
      )
        .form-control
          input.input.input-bordered(
            ref="specName"
            required
            v-model="item.name"
          )
        .form-control
          input.input.input-bordered(
            required
            v-model="item.value"
          )
      .col-span-2
        button.btn(
          type="button"
          @click="doAddSpecification"
        )
          i.bi.bi-plus-lg
          | Add Specification
</template>

<script lang="ts">
export default {
  name: 'AdminProductEditor',
};
</script>

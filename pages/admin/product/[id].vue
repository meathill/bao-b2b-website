<script setup lang="ts">
import { $fetch } from 'ofetch';
import { createCategory, createProduct, createSpecification } from '~/utils';
import type { Category, Product } from '~/types';

const route = useRoute();
const isNew = route.params.id === 'new';

const isSaving = ref<boolean>(false);
const status = ref<boolean>(false);
const message = ref<string>('');
const { data: products } = useNuxtData('/api/products');
const { data: product, pending } = useAsyncData(
  '/api/product/' + route.params.id,
  async function () {
    if (isNew) { return createProduct() }

    try {
      return await $fetch('/api/product/' + route.params.id);
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

async function doSave(event: Event): Promise<void> {
  if ((event.target as HTMLFormElement).matches(':invalid')) { return }
  if (isSaving.value) { return }

  isSaving.value = true;
  await $fetch('/api/product', {
    method: 'POST',
    body: product.value,
  });
  isSaving.value = false;
}
function doAddSpecification(): void {
  product.value.more.push(createSpecification());
}
</script>

<template lang="pug">
header.flex.items-center.pb-4.mb-4.border-b
  h1.text-2xl.font-bold {{isNew ? 'Create' : 'New'}} Product
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
        v-model="product.category"
      )
  .flex-1
    label.label
      span.label-text Specifications
    .grid.grid-cols-2.gap-2
      label.label
        span.label-text Name
      label.label
        span.label-text Type
      template(
        v-for="item in product.more"
        :key="item.name"
      )
        .form-control
          input.input.input-bordered(
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

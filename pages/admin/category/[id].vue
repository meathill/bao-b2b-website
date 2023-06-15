<script setup lang="ts">
import { createCategory, createSpecification } from '~/utils';
import type { Category } from '~/types';

const route = useRoute();
const isNew = route.params.id === 'new';

const isSaving = ref<boolean>(false);
const status = ref<boolean>(false);
const message = ref<string>('');
const { data: categories } = useNuxtData('/api/categories');
const { data: category, pending } = useAsyncData(
  '/api/category/' + route.params.id,
  async function () {
    if (isNew) { return createCategory() }

    try {
      return await $fetch('/api/category/' + route.params.id);
    } catch (e) {
      message.value = e.message;
      return createCategory();
    }
  },
  {
    default() {
      return (categories.value || [])
        .find((cat: Category) => cat.id === Number(route.params.id)) ||
        createCategory();
    },
  },
);

async function doSave(event: Event): Promise<void> {
  if ((event.target as HTMLFormElement).matches(':invalid')) { return }
  if (isSaving.value) { return }

  isSaving.value = true;

  isSaving.value = false;
}
function doAddSpecification(): void {
  category.value.specifications.push(createSpecification());
}
</script>

<template lang="pug">
header.flex.items-center.pb-4.mb-4.border-b
  h1.text-2xl.font-bold {{isNew ? 'Create' : 'New'}} Category
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
        name="categoryName"
        placeholder="Category name"
        v-model="category.name"
      )
    .form-control
      label.label
        span.label-text Slug
      input.input.input-bordered(
        required
        name="categorySlug"
        placeholder="Category slug"
        v-model="category.slug"
      )
    .form-control
      label.label
        span.label-text Parent
      select.select.select-bordered(
        name="categoryParent"
        v-model="category.parent"
      )
        option(value="") -- No Parent --
    .form-control
      label.label
        span.label-text Description
      textarea.input.input-bordered.h-24(
        name="categoryDescription"
        placeholder="Category description"
        rows="3"
        v-model="category.description"
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
        v-for="item in category.specifications"
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
  name: 'CategoryEditor',
};
</script>

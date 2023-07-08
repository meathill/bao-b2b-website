<script setup lang="ts">
import { createCategory, createSpecification } from '~/utils';
import type { Category, EditedSpecification, Specification } from '~/db/types';
import type { ApiResponse } from '~/types';

const route = useRoute();
const categoryId = Number(route.params.id);
const isNew = isNaN(categoryId);

const isSaving = ref<boolean>(false);
const status = ref<boolean>(false);
const message = ref<string>('');
const { data: categories } = useNuxtData('/api/categories');
const { data: category, pending } = useAsyncData(
  '/api/category/' + route.params.id,
  async function () {
    if (isNew) { return createCategory() }

    let result: ApiResponse<Category>;
    try {
      result = await $fetch<ApiResponse<Category>>('/api/category/' + route.params.id);
      if (!result.data) { throw new Error('Category not found.') }
    } catch (e) {
      message.value = (e as Error).message || String(e);
      return createCategory();
    }

    const { specifications } = result.data;
    return {
      ...result.data,
      specifications: specifications.map((spec: Specification) => ({
        ...spec,
        isEdited: false,
        isDeleted: false,
      })),
    };
  },
  {
    default() {
      return (categories.value || [])
        .find((cat: Category) => cat.id === Number(route.params.id)) ||
        createCategory();
    },
  },
);
const specifications = computed<Specification[]>(() => {
  return category.value.specifications
    .filter((spec: EditedSpecification) => !spec.isDeleted);
});

async function doSave(event: Event): Promise<void> {
  if ((event.target as HTMLFormElement).matches(':invalid')) { return }
  if (isSaving.value) { return }

  isSaving.value = true;
  message.value = '';
  // save category
  const method = isNew ? 'POST' : 'PUT';
  const url = '/api/category/' + (isNew ? '' : route.params.id);
  try {
    const result = await $fetch<ApiResponse<number>>(url, {
      method,
      body: {
        ...category.value,
        ...!isNew && { id: categoryId },
      },
    });
    status.value = true;
    message.value = 'Category saved.';
    if (isNew) {
      const router = useRouter();
      await router.push('/admin/category/' + result.data);
    }
  } catch (e) {
    status.value = false;
    message.value = (e as Error).message || String(e);
  }
  isSaving.value = false;
}
function doAddSpecification(): void {
  category.value.specifications
    .push(createSpecification(isNew ? 0 : categoryId));
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

.alert.mb-4(
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
    specification-editor.mb-4(
      v-for="(item, index) in specifications"
      :key="index"
      v-model="specifications[index]"
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

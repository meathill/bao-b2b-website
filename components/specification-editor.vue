<script setup lang="ts">
import type { NewSpecification } from '~/db/types';
import { SpecificationTypes } from '~/data';
import { createSpecification } from '~/utils';

type Props = {
  modalValue: NewSpecification;
};
const props = defineProps<Props>();
type Emits = {
  (event: 'update:modalValue', value: NewSpecification): void;
};
const emit = defineEmits<Emits>();
const typeOptions = enumToOptions(SpecificationTypes);
const specName = ref<HTMLInputElement>();

const localValue = computed<NewSpecification>({
  get: () => props.modalValue || createSpecification(0),
  set: value => emit('update:modalValue', value),
});

onMounted(() => {
  specName.value?.focus();
  specName.value?.select();
});
</script>

<template lang="pug">
.specification-editor.grid.grid-cols-2.gap-2.p-2.bg-gray-100
  .form-control
    label.label
      span.label-text Name
    input.input.input-bordered(
      ref="specName"
      required
      name="name"
      placeholder="Name"
      v-model="localValue.name"
    )
  .form-control
    label.label
      span.label-text Type
    select.input.input-bordered(
      required
      name="slug"
      v-model="localValue.type"
    )
      option(
        v-for="(key, label) in typeOptions"
        :key="key"
        :value="key"
      ) {{label}}
  .form-control.col-span-2
    label.label
      span.label-text Description
    textarea.textarea.textarea-bordered(
      name="description"
      placeholder="Description"
      rows="2"
      v-model="localValue.description"
    )
  .form-control.col-span-2
    label.label
      span.label-text Options
    input.input.input-bordered(
      name="options"
      placeholder="options"
      v-model="localValue.options"
    )
    label.label
      ul.label-text-alt.list-disc.list-inside
        li Use line-breaks to separate optioins
        li Add
          code.text-red-600.mx-1 *
          | as prefix to mark as default value
</template>

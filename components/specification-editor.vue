<script setup lang="ts">
import type { EditedSpecification } from '~/db/types';
import { SpecificationTypes } from '~/data';
import { createSpecification } from '~/utils';

type Props = {
  modelValue: EditedSpecification;
};
const props = defineProps<Props>();
type Emits = {
  (event: 'update:modelValue', value: EditedSpecification): void;
};
const emit = defineEmits<Emits>();
const typeOptions = enumToOptions(SpecificationTypes);
const specName = ref<HTMLInputElement>();

const localValue = computed<EditedSpecification>({
  get: () => props.modelValue || createSpecification(-1),
  set(value: EditedSpecification) {
    emit('update:modelValue', value);
  },
});
const localOptions = computed<string>({
  get() {
    return localValue.value.options ? localValue.value.options.join('\n') : '';
  },
  set(value: string) {
    let defaultValue = '';
    const options = value.split('\n')
      .map((opt) => {
        opt = opt.trim();
        if (opt.startsWith('*')) {
          opt = opt.substring(1).trim();
        }
        if (opt) {
          defaultValue = opt;
        }
        return opt;
      })
      .filter(opt => opt);
    localValue.value = {
      ...localValue.value,
      options,
      defaultValue,
    };
  },
});

onMounted(() => {
  specName.value?.focus();
  specName.value?.select();
});

function doRemove(): void {
  if (!confirm('Are you sure to delete this specification?')) { return }
  localValue.value.isDeleted = true;
}
</script>

<template lang="pug">
fieldset.specification-editor.grid.grid-cols-2.gap-2.p-2.bg-gray-100.relative(
  @change="localValue.isChanged = true"
)
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
    textarea.textarea.textarea-bordered.leading-tight(
      name="description"
      placeholder="Description"
      rows="3"
      v-model="localValue.description"
    )
  .form-control.col-span-2
    label.label
      span.label-text Options
    textarea.textarea.textarea-bordered.leading-tight(
      name="options"
      placeholder="options"
      rows="3"
      v-model="localOptions"
    )
    label.label
      ul.label-text-alt.list-disc.list-inside
        li Use line-breaks to separate optioins
        li Add
          code.text-red-600.mx-1 *
          | as prefix to mark as default value

  button.btn.btn-ghost.absolute.right-0.bottom-0(
    type="button"
    @click="doRemove"
  )
    i.bi.bi-trash3
</template>

<script setup lang="ts">
import type {NewSpecification} from "~/db/kysely";
import {SpecificationTypes} from "~/data";
import {createSpecification} from "~/utils";

type Props = {
  modalValue: NewSpecification;
}
const props = defineProps<Props>();
type Emits = {
  (event: 'update:modalValue', value: NewSpecification): void;
};
const emit = defineEmits<Emits>();
const typeOptions = enumToOptions(SpecificationTypes);

const localValue = computed<NewSpecification>({
  get: () => props.modalValue || createSpecification(),
  set: (value) => emit('update:modalValue', value),
});
</script>

<template lang="pug">
.specification-editor.grid.grid-cols-2.gap-2.p-2.bg-gray-100
  .form-control
    input.input.input-bordered(
      required
      name="name"
      placeholder="Name"
      v-model="localValue.name"
    )
  .form-control
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
  .form-control
    input.input.input-bordered(
      required
      name="options"
      placeholder="options"
      v-model="localValue.options"
    )
  .form-control
    input.input.input-bordered(
      required
      name="description"
      placeholder="Description"
      v-model="localValue.description"
    )
</template>

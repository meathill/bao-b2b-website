<script setup lang="ts">
import type { ApiResponse, PreSignedUrl } from '~/types';

type Props = {
  accept?: string;
  label?: string;
  multiple?: boolean;
  modelValue: string | string[];
};
const props = withDefaults(defineProps<Props>(), {
  accept: 'image/*',
  label: 'Add Image',
  multiple: false,
  modelValue() {
    return [] as string[];
  },
});
type Emits = {
  (e: 'update:modelValue', value: string | string[]): void;
};
const emit = defineEmits<Emits>();

const runtime = useRuntimeConfig();
const localValue = computed<string[]>({
  get(): string[] {
    if (Array.isArray(props.modelValue)) { return props.modelValue }
    return [props.modelValue || ''];
  },
  set(value: string | string[]) {
    emit('update:modelValue', value);
  },
});
const types = ref<boolean[]>([]);
const uploadings = ref<boolean[]>([]);

function doAddFile(): void {
  localValue.value = [...localValue.value, ''];
}
function doRemove(index: number): void {
  localValue.value.splice(index, 1);
}
async function onFileChange(event: Event, index: number): Promise<void> {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) { return }
  if (uploadings.value[index]) { return }

  uploadings.value[index] = true;
  const response = await $fetch<ApiResponse<PreSignedUrl>>('/api/get-upload-url', {
    method: 'POST',
    body: {
      fileName: file.name,
      fileType: file.type,
    },
  });

  const { preSignedUrl, objectKey } = response.data as PreSignedUrl;
  const uploadToR2Response = await fetch(preSignedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });
  if (!uploadToR2Response.ok) {
    console.error('Failed to upload file to R2');
  }
  uploadings.value[index] = false;
  localValue.value[index] = runtime.public.r2Domain + '/' + objectKey;
  update();
}
function update(): void {
  emit('update:modelValue', props.multiple ? localValue.value : localValue.value[0]);
}
</script>

<template lang="pug">
.file-uploader
  .mb-2.flex.gap-2.items-center(
    v-for="(file, index) in localValue"
    :key="index"
  )
    img.w-16(
      v-if="!types[index] && file && /\.(png|jpg|jpeg|gif)$/i.test(file)"
      :src="useImageProxy(file)"
      alt="file"
    )
    nuxt-link.btn.btn-outline(
      v-else-if="!types[index] && file"
      target="_blank"
    )
      i.bi.bi-file-pdf(v-if="/\.pdf$/i.test(file)")
      | Preview PDF
    input.input.input-bordered.w-full.max-w-xs(
      v-if="types[index]"
      type="url"
      v-model="localValue[index]"
      @change="update"
    )
    input.file-input.w-full.max-w-xs(
      v-else
      type="file"
      :accept="accept"
      :multiple="multiple"
      @change="onFileChange($event, index)"
    )
    .w-8.text-center.loading.loading-spinner(
      v-if="uploadings[index]"
    )
    label.label.ml-auto
      span.label-text.mr-1 {{types[index] === true ? 'URL' : 'File'}}
      input.toggle(
        type="checkbox"
        v-model="types[index]"
      )
    button.btn.btn-sm.btn-error(
      v-if="multiple && localValue.length > 1"
      type="button"
      @click="doRemove(index)"
    )
      i.bi.bi-trash
  button.btn(
    v-if="multiple"
    type="button"
    @click="doAddFile"
  )
    i.bi.bi-plus-lg
    | {{label}}
</template>

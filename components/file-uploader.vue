<script setup lang="ts">
import type { ApiResponse, PreSignedUrl } from '~/types';

type Props = {
  modelValue: string[];
};
const props = withDefaults(defineProps<Props>(), {
  modelValue() {
    return [] as string[];
  },
});
type Emits = {
  (e: 'update:modelValue', value: string[]): void;
};
const emit = defineEmits<Emits>();

const runtime = useRuntimeConfig();
const localValue = computed<string[]>({
  get(): string[] {
    return props.modelValue || [];
  },
  set(value: string[]) {
    emit('update:modelValue', value);
  },
});

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
  localValue.value[index] = runtime.public.r2Domain + '/' + objectKey;
}
</script>

<template lang="pug">
.file-uploader
  .mb-2.flex.gap-2(
    v-for="(file, index) in localValue"
    :key="index"
  )
    img.w-16(
      v-if="file"
      :src="file"
      alt="file"
    )
    input.file-input.w-full.max-w-xs(
      type="file"
      accept="image/*"
      @change="onFileChange($event, index)"
    )
    button.btn.btn-sm.btn-error(
      type="button"
      @click="doRemove(index)"
    )
      i.bi.bi-trash
  button.btn(
    type="button"
    @click="doAddFile"
  )
    i.bi.bi-plus-lg
    | Add Image
</template>

<script lang="ts" setup>
import { useQuotationStore } from '~/store';

const quotationStore = useQuotationStore();

onBeforeMount(() => {
  quotationStore.init();
});
</script>

<template lang="pug">
app-header
nuxt-page
app-footer
</template>

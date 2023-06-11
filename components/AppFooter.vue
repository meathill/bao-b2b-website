<script lang="ts" setup>
const year = new Date().getFullYear();
const runtimeConfig = useRuntimeConfig();
</script>

<template lang="pug">
footer.footer.p-4.container.mx-auto.border-t(class="sm:mt-auto")
  p.py-4.text-center.text-sm.font-light.text-gray-400 Copyright © {{year}} - All right reserved - v{{runtimeConfig.public.version}}
</template>

<script lang="ts">
export default {
  name: 'AppFooter',
};
</script>

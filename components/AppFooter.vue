<script lang="ts" setup>
const year = new Date().getFullYear();
const runtimeConfig = useRuntimeConfig();
</script>

<template lang="pug">
footer.footer.p-4.container.mx-auto.border-t(class="sm:mt-auto")
  .w-56
    h1.text-xl.font-bold Abalone.ai
    p.text-gray-500.text-base Generate outside the box thinking with the possibility to targtet the low.
    .w-full.flex.text-2xl.gap-6
      a
        i.bi.bi-facebook
      a
        i.bi.bi-twitter
      a
        i.bi.bi-youtube

p.py-4.text-center.text-xs.font-light.text-gray-400 Copyright © {{year}} - All right reserved - v{{runtimeConfig.public.version}}
</template>

<script lang="ts">
export default {
  name: 'AppFooter',
};
</script>

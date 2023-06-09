<script setup lang="ts">

</script>

<template lang="pug">
header.flex.container.mx-auto.py-4.gap-4
  aside.border.w-80
    header
      h2 Product Category
    ul
      li
        nuxt-link(to="/category/1") Product 1
      li
        nuxt-link(to="/category/2") Product 2
      li
        nuxt-link(to="/category/3") Product 3
  .flex-1.border.h-full
</template>

<script lang="ts">
export default {
  name: 'Index',
};
</script>

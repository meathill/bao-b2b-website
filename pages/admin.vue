<script setup lang="ts">
definePageMeta({
  redirect: '/admin/requests',
});
const menus = [
  {
    name: 'Categories',
    path: '/admin/category',
  },
  {
    name: 'Products',
    path: '/admin/product',
  },
  {
    name: 'Requests',
    path: '/admin/requests',
  },
];
const route = useRoute();

</script>

<template lang="pug">
main.container.mx-auto.flex.py-4.gap-4
  .w-64
    aside.sticky.bg-base-200
      ul.menu
        li(v-for="item in menus" :key="item.path")
          nuxt-link(
            :class="{active: route.path === item.path}"
            :to="item.path"
          ) {{item.name}}

  .flex-1
    nuxt-page
</template>

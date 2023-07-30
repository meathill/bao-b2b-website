<script setup lang="ts">
const route = useRoute();
const isAdmin = route.path.startsWith('/admin');

</script>

<template lang="pug">
nuxt-link.btn.btn-primary(
  v-if="!isAdmin"
  to="/rfq"
) Request Quotation

teleport(to="body")
  .drawer.drawer-end
    input#request-quotation.drawer-toggle(type="checkbox")
    .drawer-side
      label.drawer-overlay(for="request-quotation")
      .p-4.w-120.h-full.bg-base-100.text-base-content
        header.flex.items-center.border-b.mb-4.pb-2
          h2 Request Quotation
          label.btn.btn-ghost.btn-circle.ml-auto(
            for="request-quotation"
          )
            i.bi.bi-x-lg
</template>

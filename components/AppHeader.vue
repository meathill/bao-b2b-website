<script lang="ts" setup>
const search = ref<string>('');

function doSearch(): void {
  const router = useRouter();
  router.push({
    name: 'search',
    query: {
      search: search.value,
    },
  });
}
</script>

<template lang="pug">
.navbar
  .container.mx-auto.justify-between
    nuxt-link.text-2xl.font-bold(to="/") Roger

    form.join(
      class="w-1/3"
      @submit.prevent="doSearch"
    )
      label.sr-only(for="global-search") Search
      input#global-search.input.input-bordered.join-item.flex-1(
        type="search"
        placeholder="Search..."
        v-model="search"
      )
      .indicator
        button.btn.btn-secondary.join-item.text-white Search

    request-quotation

.navbar.w-full.bg-primary.text-primary-content
  .container.mx-auto
    ul.menu.menu-horizontal
      li
        nuxt-link(to="/") Home
      li
        nuxt-link(to="/about") About
      li
        nuxt-link(to="/products") Products
      li
        nuxt-link(to="/contact") Contact

</template>

<script lang="ts">
export default {
  name: 'AppHeader',
};
</script>

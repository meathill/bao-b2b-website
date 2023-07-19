<script setup lang="ts">
import { useProductStore } from '~/store';
import type { Category } from '~/db/types';

const productStore = useProductStore();

const { data: categories } = useAsyncData<Category[]>(
  'categories',
  async function () {
    const categories = productStore.isLoaded
      ? Object.values(productStore.categories)
      : await productStore.refreshCategories();
    return categories.filter(category => category.isHomepage);
  },
  {
    default() {
      return productStore.isLoaded
        ? Object.values(productStore.categories).filter(category => category.isHomepage)
        : [];
    },
  },
);
</script>

<template lang="pug">
main.flex.container.mx-auto.pt-4.gap-4
  aside.border.w-80.flex.flex-col
    header.bg-base-300.px-4.py-2
      h2.text-xl.font-semibold Product Category
    ul.menu
      li(
        v-for="item in categories"
        :key="item.id"
      )
        nuxt-link(:to="'/category/' + item.id") {{item.name}}
    nuxt-link.block.px-4.py-1.flex.justify-between.bg-base-200.border-t.mt-auto(
      to="/category"
    ) View all
      i.bi.bi-chevron-right

  .flex-1.border.h-60
    img.w-full.h-full.block.object-cover(
      src="https://evereditor.com/mui2.jpg"
      alt="Muimui"
    )
.flex.container.mx-auto.pt-4.gap-4
  .border.w-80
    img.block(
      src="https://evereditor.com/mui2.jpg"
      alt="Muimui"
    )
  .flex-1.border.flex.flex-col
    header.flex.px-4.py-2.border-b.items-center.justify-between
      h2.text-lg.font-semibold Newest Products
      nuxt-link.text-xs(to="/products") View all
        i.bi.bi-chevron-right
    .flex.flex-1
      nuxt-link.flex-1.px-4.py-2.border-r.flex.flex-col.items-center
        img.block.w-24(
          src="https://evereditor.com/mui2.jpg"
          alt="Muimui"
        )
        h3 Muimui
        p.text-xs SiT2025B MEMS OscillatorsSiTime’s SiT2025B series offers board-level solder joint reliabi...
      nuxt-link.flex-1.px-4.py-2.border-r.flex.flex-col.items-center
        img.block.w-24(
          src="https://evereditor.com/mui2.jpg"
          alt="Muimui"
        )
        h3 Muimui
        p.text-xs SiT2025B MEMS OscillatorsSiTime’s SiT2025B series offers board-level solder joint reliabi...
      nuxt-link.flex-1.px-4.py-2.border-r.flex.flex-col.items-center
        img.block.w-24(
          src="https://evereditor.com/mui2.jpg"
          alt="Muimui"
        )
        h3 Muimui
        p.text-xs SiT2025B MEMS OscillatorsSiTime’s SiT2025B series offers board-level solder joint reliabi...
      nuxt-link.flex-1.px-4.py-2.border-r.flex.flex-col.items-center
        img.block.w-24(
          src="https://evereditor.com/mui2.jpg"
          alt="Muimui"
        )
        h3 Muimui
        p.text-xs SiT2025B MEMS OscillatorsSiTime’s SiT2025B series offers board-level solder joint reliabi...
.container.mx-auto.mt-4.border
  header.flex.px-4.py-2.border-b.items-center.justify-between
    h2.text-xl.font-semibold Hot Selling Products
    nuxt-link.text-xs(to="/products") View all
      i.bi.bi-chevron-right
  p

</template>

<script lang="ts">
export default {
  name: 'Index',
};
</script>

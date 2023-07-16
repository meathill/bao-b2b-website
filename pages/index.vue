<script setup lang="ts">

</script>

<template lang="pug">
main.flex.container.mx-auto.pt-4.gap-4
  aside.border.w-80.flex.flex-col
    header.bg-base-300.px-4.py-2
      h2.text-xl.font-semibold Product Category
    ul.menu
      li
        nuxt-link(to="/category/1") Product 1
      li
        nuxt-link(to="/category/2") Product 2
      li
        nuxt-link(to="/category/3") Product 3
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

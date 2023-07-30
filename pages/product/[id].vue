<script setup lang="ts">
import { parse } from 'marked';
import type { ApiResponse } from '~/types';
import type { Product } from '~/db/types';

const route = useRoute();
const idOrSlug = route.params.id;
const Tabs = ['Description', 'Specification', 'Reviews'];

const { data: product } = useAsyncData<ApiResponse<Product>>(
  'product-' + idOrSlug,
  async function () {
    const { data } = await $fetch<ApiResponse<Product>>('/api/product/' + idOrSlug);
    return data;
  },
  {
    default() {
      return {};
    },
  },
);

const currentImage = ref<number>(0);
const currentTab = ref<number>(0);

function doSwitchTab(tab: number): void {
  currentTab.value = tab;
}
function addToCart(product: Product): void {

}
</script>

<template lang="pug">
main.container.mx-auto.py-4
  breadcrumbs(
    :category="product.category"
    :title="product.name"
  )
  h1.text-2xl.font-bold.mb-4 {{product.name}}
  .flex.mb-4.gap-8
    .flex-none.w-96
      .carousel.w-full.h-72
        .carousel-item.w-full(
          v-for="(item, index) in product.images"
          :key="item"
          :id="'product-image-' + index"
        )
          img.w-full.h-full.block.object-cover.rounded-box(
            :src="item"
            :alt="product.name"
          )
      .flex.w-full.pt-2.gap-2
        img.w-22-5.h-16.block.object-cover.rounded-box(
          v-for="(item, index) in product.images"
          :class="{'outline outline-primary': currentImage === index}"
          :key="item"
          :src="item"
          :alt="product.name"
          @click="currentImage = index"
        )
    .flex-1
      dl.grid.grid-cols-6.gap-2.mb-4
        template(
          v-for="item in product.specifications"
          :key="item.specId"
        )
          dt.text-right(class="text-neutral/75") {{item.name}}:
          dd.font-semibold {{item.value}}

      label.btn.btn-primary.ml-12.cursor-pointer(
        for="request-quotation"
      )
        i.bi.bi-clipboard2-plus
        | Request quotation

  .tabs
    .tab.tab-lifted.tab-lg.cursor-pointer(
      v-for="(item, index) in Tabs"
      :key="index"
      :class="{'tab-active': currentTab === index}"
      @click="doSwitchTab(index)"
    ) {{item}}
    .border-b.flex-1
  .tab-content(v-if="currentTab === 0")
    .prose.mx-auto(
      class="lg:prose-lg",
    )
      article(
        v-html="parse(product.description)"
      )
  .tab-content.pt-4(v-else-if="currentTab === 1")
    table.table.border.max-w-4xl.mx-auto
      thead
        tr
          th.border-r Parameter name
          th Value
      tbody
        tr.hover(
          v-for="(item, index) in product.more"
          :key="index"
        )
          td.border-r {{item.name}}
          td {{item.value}}
</template>

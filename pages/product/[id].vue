<script setup lang="ts">
import { marked } from 'marked';
import type { ApiResponse } from '~/types';
import type { Category, Product } from '~/db/types';
import { useProductStore } from '~/store';

const route = useRoute();
const idOrSlug = route.params.id;
const Tabs = ['Description', 'Specification'];
const productStore = useProductStore();
if (!productStore.isLoaded) {
  productStore.refreshCategories();
}

const { data: product } = await useAsyncData<ApiResponse<Product>>(
  'product-' + idOrSlug,
  async function () {
    const { data } = await $fetch<ApiResponse<Product>>('/api/product/' + idOrSlug, {
      params: {
        related: 1,
      },
    });
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
const category = computed<Category>(() => {
  return (product.value && productStore.categories[product.value.category]) ||
    {};
});
const description = computed<string>(() => {
  return product.description ? marked.parse(useImageProxy(product.description)) : '';
});

function doSwitchTab(tab: number): void {
  currentTab.value = tab;
}
function doAddToQuotation(product: Product): void {

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
            :src="useImageProxy(item)"
            :alt="product.name"
          )
      .flex.w-full.pt-2.gap-2
        img.w-17-6.h-13-2.block.object-cover.rounded-box(
          v-for="(item, index) in product.images"
          :class="{'outline outline-primary': currentImage === index}"
          :key="item"
          :src="useImageProxy(item)"
          :alt="product.name"
          @click="currentImage = index"
        )
    .flex-1.flex.flex-col
      p.mb-auto
        i.bi.bi-dot
        | Model: {{product.model}}

      .mb-auto(v-if="product.file || category.file")
        nuxt-link.btn.btn-outline.btn-sm(
          :to="product.file || category.file"
          target="_blank"
        ) Download manual

      request-quotation(
        :product="product"
      )

  .tabs.gap-4
    .tab.tab-bordered.tab-lg.cursor-pointer.static(
      v-for="(item, index) in Tabs"
      :key="index"
      :class="{'tab-active': currentTab === index, 'border-transparent': currentTab !== index}"
      @click="doSwitchTab(index)"
    ) {{item}}
  .tab-content(v-if="currentTab === 0")
    .prose.mx-auto(
      class="lg:prose-lg",
    )
      article(
        v-html="description"
      )
  .tab-content.pt-4(v-else-if="currentTab === 1")
    table.table.border.max-w-4xl.mx-auto(
      v-if="Array.isArray(product.more)"
    )
      thead
        tr
          th.border-r.bg-base-200 Parameter name
          th.bg-base-200 Value
      tbody
        tr.hover(
          v-for="(item, index) in product.more"
          :key="index"
        )
          td.border-r {{item.name}}
          td {{item.value}}
    table.table.border.max-w-4xl.mx-auto(
      v-else
    )
      template(
        v-for="(group, key) in product.more"
        :key="key"
      )
        thead
          tr
            th.bg-base-200(colspan="2") {{key}}
        tbody
          tr.hover(
            v-for="(value, key) in group"
            :key="key"
          )
            td.border-r {{key}}
            td {{value}}

  header.flex.justify-start(
    v-if="product.related?.length"
  )
    h3.text-lg.font-medium.mt-4.px-5.border-b-2.border-neutral.pb-2 Related Products

  .flex.gap-4(v-if="product.related?.length")
    nuxt-link.border.p-4(
      v-for="item in product.related"
      :key="item.id"
      :to="'/product/' + item.slug"
    )
      img.block.w-full.object-fit(
        v-if="item.images.length"
        :src="useImageProxy(item.images[0])"
        :alt="item.name"
      )
      h4.font-bold.mt-2 {{item.name}}
</template>

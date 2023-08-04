<script setup lang="ts">
import { useQuotationStore } from '~/store';
import type { Product, QuotationItem } from '~/db/types';
import { createQuotationItem } from '~/utils';

type Props = {
  product: Product;
};
const props = defineProps<Props>();

const quotationStore = useQuotationStore();

const quotation = ref<QuotationItem>(createQuotationItem());
const message = ref<string>('');

function doSave(): void {
  const item = {
    ...quotation.value,
    productId: props.product.id,
    productName: props.product.name,
    price: quotation.value.price * 100,
  };
  quotationStore.addQuotation(quotation.value);
  message.value = 'Saved.';
  quotation.value = createQuotationItem();
}
</script>

<template lang="pug">
.flex.gap-2
  input.input.input-bordered.w-20.always-spin(
    type="number"
    min="1"
    v-model="quotation.quantity"
  )

  label.btn.btn-primary.cursor-pointer(
    for="request-quotation"
  )
    i.bi.bi-clipboard2-plus
    | Request quotation

teleport(to="body")
  .drawer.drawer-end
    input#request-quotation.drawer-toggle(type="checkbox")
    .drawer-side
      label.drawer-overlay(for="request-quotation")
      .p-4.w-120.h-full.bg-base-100.text-base-content
        header.flex.items-center.border-b.mb-2.pb-2
          h2 Request Quotation
          label.btn.btn-ghost.btn-circle.ml-auto(
            for="request-quotation"
          )
            i.bi.bi-x-lg

        form#sidebar-quotation-form(
          @submit.prevent="doSave"
        )
          .form-control.mb-2
            label.label(for="quotation-product-name")
              span.label-text Product name
            input#quotation-product-name.input.input-bordered(
              readonly
              placeholder="Your name"
              :value="product.name"
            )
          .form-control.mb-2
            label.label(for="quotation-product-price")
              span.label-text Product price
            .join
              span.join-item.flex.justify-center.items-center.w-12.bg-base-200 $
              input#quotation-product-price.input.input-bordered.join-item(
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Price"
                required
                v-model="quotation.price"
              )
          .form-control.mb-2
            label.label(for="quotation-product-quantity")
              span.label-text Product quantity
            input#quotation-product-quantity.input.input-bordered(
              type="number"
              min="1"
              placeholder="Quantity"
              required
              v-model="quotation.quantity"
            )
          .form-control.mb-4
            label.label(for="quotation-product-comment")
              span.label-text Comment
            textarea#quotation-product-comment.textarea.textarea-bordered(
              rows="3"
              placeholder="Comment (optional)"
              v-model="quotation.comment"
            )
          footer.border-t.pt-4
            .alert.alert-success.mb-4(v-if="message")
              | {{message}}
              nuxt-link.link.ml-auto(to="/rfq") View all my list
            button.btn.btn-primary Save to my list
</template>

<script setup lang="ts">
import { useQuotationStore } from '~/store';
import type { ClientInfo } from '~/db/types';
import { createClientInfo } from '~/utils';

const quotationStore = useQuotationStore();

const isSending = ref<boolean>(false);
const clientInfo = ref<ClientInfo>(createClientInfo());
const comment = ref<string>('');
const status = ref<boolean>(false);
const message = ref<string>('');

async function doSubmit(event: Event): Promise<void> {
  if ((event.target as HTMLFormElement).matches(':invalid')) { return }
  if (isSending.value) { return }

  isSending.value = true;
  try {
    await $fetch('/api/request', {
      method: 'POST',
      body: {
        products: quotationStore.quotations,
        ...clientInfo,
        comment,
      },
    });
    status.value = true;
    message.value = 'You request quotation submitted successfully, please wait for our reply.';
  } catch (e) {
    message.value = (e as Error).message || String(e);
  }
  isSending.value = false;
}
</script>

<template lang="pug">
main.rfq.container.mx-auto.py-4
  h1.text-2xl.font-bold.mb-4 Request Quotation
  table.table.border
    thead
      tr
        th Name
        th Price
        th Quantity
        th Comment
        th
    tbody
      tr(v-for="(item, pId) in quotationStore.quotations")
        td {{item.productName}}
        td ${{item.price / 100}}
        td {{item.quantity}}
        td {{item.comment}}
        td
          button.btn.btn-error.btn-sm(
            type="button"
            @click="quotationStore.removeQuotation(pId)"
          ) Remove

  hr.my-4
  h2.text-xl.font-bold.mb-4.text-center Please fill in the following information
  form.grid.grid-cols-2.gap-4.max-w-4xl.mx-auto(
    @submit.prevent="doSubmit"
  )
    .form-control
      label.label(for="company-name")
        span.label-text Compnay name
      input#company-name.input.input-bordered(
        required
        placeholder="Company name"
        v-model="clientInfo.companyName"
      )
    .form-control
      label.label(for="contact-name")
        span.label-text Contact name
      input#contact-name.input.input-bordered(
        required
        placeholder="Contact name"
        v-model="clientInfo.contactName"
      )
    .form-control
      label.label(for="email")
        span.label-text Email
      input#email.input.input-bordered(
        required
        placeholder="Email"
        type="email"
        v-model="clientInfo.email"
      )
    .form-control
      label.label(for="phone")
        span.label-text Phone
      input#phone.input.input-bordered(
        required
        placeholder="Phone"
        type="tel"
        v-model="clientInfo.phone"
      )
    .form-control
      label.label(for="country")
        span.label-text Country
      input#address.input.input-bordered(
        required
        placeholder="Country"
        v-model="clientInfo.country"
      )
    .form-control.col-span-2
      label.label(for="comment")
        span.label-text Comment
      textarea#comment.textarea.textarea-bordered(
        rows="3"
        placeholder="Please include part number and quantity or special requests if any."
        v-model="comment"
      )
    .alert(
      v-if="message"
      :class="status ? 'alert-success' : 'alert-error'"
    ) {{message}}
    .form-control.col-span-2
      button.btn.btn-primary(
        :disabled="isSending"
      )
        span.loading.loading-spinner(v-if="isSending")
        template(v-if="isSending") Sending...
        template(v-else) Submit
</template>

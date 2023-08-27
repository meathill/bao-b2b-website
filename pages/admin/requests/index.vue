<script setup lang="ts">
import reduce from 'lodash/reduce';
import type { Quotation } from '~/db/types';
import type { RowItem, ApiResponse } from '~/types';
import { formatDate } from '~/utils';
import { QuotationStatus } from '~/db/types';

type LocalRowItem = Quotation & RowItem;

const StatusLabel: Record<string, string> = reduce(QuotationStatus, (acc, value, key) => {
  if (isNaN(Number(key))) { return acc }
  acc[key] = value;
  return acc;
}, {} as Record<string, string>);

const { data: quotations, pending } = await useAsyncData(
  'quotations',
  async function () {
    const { data } = await $fetch<ApiResponse<Quotation[]>>('/api/requests');
    return data;
  },
  {
    default() {
      return [];
    },
    transform(from: Quotation[]): LocalRowItem[] {
      return from.map((quotation: Quotation) => {
        const { createdAt, updatedAt } = quotation;
        return {
          ...quotation,
          isSaving: false,
          createdAt: formatDate(createdAt),
          updatedAt: formatDate(updatedAt),
        };
      });
    },
  },
);

const selected = ref<LocalRowItem>();
const selectedStatus = ref<QuotationStatus>();
const openToggle = ref<boolean>(false);
const isSaving = ref<boolean>(false);
const message = ref<string>('');
const status = ref<boolean>(false);

function doView(row: LocalRowItem) {
  selected.value = unref(row);
  selectedStatus.value = row.status;
  openToggle.value = true;
}
async function doUpdate(event: Event): Promise<void> {
  if ((event.target as HTMLFormElement).matches(':invalid')) { return }
  if (isSaving.value || !selected.value) { return }

  isSaving.value = true;
  message.value = '';
  status.value = false;
  try {
    await $fetch('/api/request/' + selected.value.id, {
      method: 'PATCH',
      body: {
        status: selectedStatus.value,
      },
    });
    selected.value.status = selectedStatus.value;
    status.value = true;
    message.value = 'You request quotation updated successfully.';
  } catch (e) {
    message.value = (e as Error).message || String(e);
  }
  isSaving.value = false;
}
</script>

<template lang="pug">
h1.text-2xl.font-bold.mb-4 Request Quotations
table.table
  thead
    tr
      th Company name
      th Contact name
      th Email
      th Phone
      th Comment
      th Status
      th Action
  tbody
    tr(v-for="request in quotations" :key="request.id")
      td {{ request.companyName }}
      td {{ request.contactName }}
      td {{ request.email }}
      td {{ request.phone }}
      td {{ request.comment }}
      td {{ StatusLabel[request.status] }}
      td
        button.btn.btn-primary.btn-xs(
          type="button"
          @click="doView(request)"
        ) Details

teleport(to="body")
  .drawer.drawer-end
    input#request-details.drawer-toggle(
      ref="drawerToggle"
      type="checkbox"
      :disabled="isSaving"
      v-model="openToggle"
    )
    .drawer-side
      label.drawer-overlay(for="request-details")
      .p-4.w-120.h-full.bg-base-100.text-base-content
        header.flex.items-center
          h2.text-xl.font-semibold Quotation details
          label.btn.btn-sm.btn-circle.btn-ghost(for="request-details")
            i.bi.bi-x-lg
        hr.mt-2.mb-4
        template(v-if="selected")
          table.table.mb-4.border(
            v-for="item in selected.products"
            :key="item.productId"
          )
            tr
              th Product name
              td {{item.productName}}
            tr
              th Price
              td ${{item.price / 100}}
            tr
              th Quantity
              td {{item.quantity}}
            tr
              th Comment
              td {{item.comment}}
          .alert.mb-2(
            v-if="message"
            :class="status ? 'alert-success' : 'alert-error'"
          ) {{message}}
          form.flex.items-center(
            @submit.prevent="doUpdate"
          )
            label.label.mr-2
              span.label-text Status
            select.select.select-bordered(
              v-model="selectedStatus"
            )
              option(
                v-for="(label, value) in StatusLabel"
                :key="value"
                :value="value"
              ) {{label}}
            button.btn.btn-primary.ml-auto(
              :disabled="isSaving"
            )
              span.loading.loading-spinner(v-if="isSaving")
              | Update
</template>

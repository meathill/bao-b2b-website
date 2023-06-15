<script setup lang="ts">
import { RequestQuotation, RowItem } from '~/types';
import { formatDate } from '~/utils';

type LocalRowItem = RequestQuotation & RowItem;

const { data: quotations, pending } = useFetch('/api/requests',
  {
    default() {
      return [];
    },
    transform(from: RequestQuotation[]): LocalRowItem[] {
      return from.map((quotation: RequestQuotation) => {
        const { created_at, updated_at } = quotation;
        return {
          ...quotation,
          isSaving: false,
          createdAt: formatDate(created_at as string),
          updatedAt: formatDate(updated_at as string),
        };
      });
    },
  },
);
</script>

<template lang="pug">
h1.text-2xl.font-bold.mb-4 Request Quotations
table.table.table-xs
  thead
    tr
      th Name
      th Email
      th Phone
      th Message
      th Status
      th Action
  tbody
    tr(v-for="request in quotations" :key="request.id")
      td {{ request.name }}
      td {{ request.email }}
      td {{ request.phone }}
      td {{ request.message }}
      td {{ request.status }}
      td
        button.btn.btn-primary.btn-xs(type="button") View
</template>

<script lang="ts">
export default {
  name: 'AdminRequestsIndex',
};
</script>

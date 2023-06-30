<script setup lang="ts">
import type { Quotation } from '~/db/types';
import type { RowItem } from '~/types';
import { formatDate } from '~/utils';

type LocalRowItem = Quotation & RowItem;

const { data: quotations, pending } = useFetch('/api/requests',
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

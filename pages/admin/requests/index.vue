<script setup lang="ts">
const requests = [];
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
    tr(v-for="request in requests" :key="request.id")
      td {{ request.name }}
      td {{ request.email }}
      td {{ request.phone }}
      td {{ request.message }}
      td {{ request.status }}
      td
        button.btn.btn-primary.btn-xs(type="button") View
</template>

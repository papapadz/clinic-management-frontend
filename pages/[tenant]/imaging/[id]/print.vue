<template>
  <PrintableDocumentPage :id="id" kind="imaging" :back-to="`/${tenant}/imaging/${id}`" :encounter-linked="true" />
</template>

<script setup lang="ts">
const route = useRoute()
const tenant = String(route.params.tenant)
const id = String(route.params.id)

definePageMeta({ middleware: ['auth', 'tenant'], layout: false })
</script>

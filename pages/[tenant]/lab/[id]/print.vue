<template>
  <PrintableDocumentPage :id="id" kind="lab" :back-to="`/${tenant}/lab/${id}`" :encounter-linked="true" />
</template>

<script setup lang="ts">
const route = useRoute()
const tenant = String(route.params.tenant)
const id = String(route.params.id)

definePageMeta({ middleware: ['auth', 'tenant'], layout: false })
</script>

<template>
  <PrintableDocumentPage :id="id" kind="billing" :back-to="`/${tenant}/billing`" />
</template>

<script setup lang="ts">
const route = useRoute()
const tenant = String(route.params.tenant)
const id = String(route.params.id)

definePageMeta({ middleware: ['auth', 'tenant'], layout: false })
</script>

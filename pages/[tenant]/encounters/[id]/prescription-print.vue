<template>
  <PrintableDocumentPage :id="id" kind="prescription" :back-to="`/${tenant}/patients`" />
</template>

<script setup lang="ts">
const route = useRoute()
const tenant = String(route.params.tenant)
const id = String(route.params.id)

definePageMeta({ middleware: ['auth', 'tenant'], layout: false })
</script>

<template>
  <BatchPrintableDocumentPage kind="imaging" />
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'tenant'], layout: false })
</script>

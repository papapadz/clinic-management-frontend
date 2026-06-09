<template>
  <BatchPrintableDocumentPage kind="lab" />
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['auth', 'tenant'], layout: false })
</script>

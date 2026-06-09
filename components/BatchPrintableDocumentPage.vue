<template>
  <div :class="embedded ? '' : 'space-y-4'">
    <div v-if="!embedded" class="no-print flex flex-wrap items-center justify-between gap-3">
      <BaseButton variant="outline" :to="`/${tenant}/${kind}`">Back</BaseButton>
      <BaseButton :icon="Printer" :disabled="documents.length === 0 || failedIds.length > 0" @click="printDocument">Print</BaseButton>
    </div>

    <div v-if="error" class="no-print rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
      {{ error }}
      <span v-if="failedIds.length"> Failed request IDs: {{ failedIds.join(', ') }}.</span>
    </div>
    <LoadingState v-if="loading" class="no-print" />
    <div v-else-if="documents.length" class="space-y-6 print:space-y-0">
      <PrintableDocument
        v-for="document in documents"
        :key="document.document_number"
        :document="document"
        class="break-after-page last:break-after-auto"
      />
    </div>
    <EmptyState v-else class="no-print" title="Documents unavailable" description="These printable documents could not be loaded." />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { Printer } from 'lucide-vue-next'
import type { PrintableDocument } from '~/types'
import type { DiagnosticPrintKind } from '~/utils/diagnosticPrint'
import { useApi } from '~/composables/useApi'
import { printDocumentPathFor } from '~/composables/usePrintDocuments'
import { signalPrintReady } from '~/utils/printReady'

const props = defineProps<{
  kind: DiagnosticPrintKind
}>()

const route = useRoute()
const tenant = computed(() => String(route.params.tenant))
const embedded = computed(() => route.query.embedded === '1')
const autoPrint = computed(() => route.query.autoprint === '1')
const ids = computed(() => String(route.query.ids || '').split(',').map((id) => id.trim()).filter(Boolean))
const documents = ref<PrintableDocument[]>([])
const failedIds = ref<string[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const api = useApi()

onMounted(async () => {
  await fetchDocuments()
  if (documents.value.length > 0 && failedIds.value.length === 0) {
    await nextTick()
    await new Promise((resolve) => requestAnimationFrame(resolve))
    if (autoPrint.value) {
      printDocument()
    } else if (embedded.value) {
      signalPrintReady()
    }
  }
})

async function fetchDocuments() {
  loading.value = true
  error.value = null
  documents.value = []
  failedIds.value = []

  if (ids.value.length === 0) {
    error.value = 'No diagnostic request IDs were provided.'
    loading.value = false
    return
  }

  const results = await Promise.all(ids.value.map(async (id) => {
    try {
      const res = await api.api<PrintableDocument>(api.tenantPath(printDocumentPathFor(props.kind, id)))
      return res.success ? { id, document: res.data } : { id, document: null }
    } catch {
      return { id, document: null }
    }
  }))

  documents.value = results.flatMap((result) => result.document ? [result.document] : [])
  failedIds.value = results.filter((result) => !result.document).map((result) => result.id)
  if (failedIds.value.length > 0) {
    error.value = 'Some printable documents could not be loaded.'
  }
  loading.value = false
}

function printDocument() {
  window.print()
}
</script>

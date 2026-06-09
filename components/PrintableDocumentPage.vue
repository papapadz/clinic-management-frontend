<template>
  <div :class="embedded ? '' : 'space-y-4'">
    <div v-if="!embedded" class="no-print flex flex-wrap items-center justify-between gap-3">
      <BaseButton variant="outline" :to="backTo">Back</BaseButton>
      <BaseButton :icon="Printer" :disabled="documents.length === 0" @click="printDocument">Print</BaseButton>
    </div>

    <div v-if="error" class="no-print rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
      {{ error }}
    </div>
    <LoadingState v-if="loading" class="no-print" />
    <div v-else-if="documents.length" class="space-y-6 print:space-y-0">
      <PrintableDocument
        v-for="doc in documents"
        :key="doc.document_number"
        :document="doc"
        class="break-after-page last:break-after-auto"
      />
    </div>
    <EmptyState v-else class="no-print" title="Document unavailable" description="This printable document could not be loaded." />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted } from 'vue'
import { Printer } from 'lucide-vue-next'
import type { PrintableDocumentKind } from '~/composables/usePrintDocuments'
import { usePrintDocuments } from '~/composables/usePrintDocuments'
import { signalPrintReady } from '~/utils/printReady'

const props = defineProps<{
  id: string | number
  kind: PrintableDocumentKind
  backTo: string
  encounterLinked?: boolean
}>()

const { documents, loading, error, fetchPrintDocument } = usePrintDocuments()
const route = useRoute()
const router = useRouter()
const embedded = computed(() => route.query.embedded === '1')
const autoPrint = computed(() => route.query.autoprint === '1')

async function waitForRender(): Promise<void> {
  await nextTick()
  // Double RAF: first schedules after current frame, second fires after paint completes
  await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
  // Wait for fonts to finish loading so text renders before print dialog opens
  if (window.document.fonts?.ready) {
    await Promise.race([
      window.document.fonts.ready,
      new Promise<void>(resolve => setTimeout(resolve, 2000)),
    ])
  }
  // Wait for any visible images to finish loading
  const images = Array.from(window.document.querySelectorAll<HTMLImageElement>('.print-document img'))
  const pending = images.filter(img => !img.complete)
  if (pending.length > 0) {
    await Promise.race([
      Promise.all(pending.map(img => new Promise<void>(resolve => {
        img.addEventListener('load', () => resolve(), { once: true })
        img.addEventListener('error', () => resolve(), { once: true })
      }))),
      new Promise<void>(resolve => setTimeout(resolve, 2000)),
    ])
  }
}

let afterPrintHandler: (() => void) | null = null

onUnmounted(() => {
  if (afterPrintHandler) {
    window.removeEventListener('afterprint', afterPrintHandler)
    afterPrintHandler = null
  }
})

onMounted(async () => {
  await fetchPrintDocument(props.kind, props.id, { encounterLinked: props.encounterLinked })
  if (documents.value.length > 0) {
    try {
      await waitForRender()
    } catch {
      // The hidden print launcher depends on this signal; print with loaded content
      // even when a browser render-readiness API is unavailable or errors.
    }
    if (autoPrint.value) {
      afterPrintHandler = () => {
        afterPrintHandler = null
        router.back()
      }
      window.addEventListener('afterprint', afterPrintHandler, { once: true })
      printDocument()
    } else if (embedded.value) {
      signalPrintReady()
    }
  }
})

function printDocument() {
  window.print()
}
</script>

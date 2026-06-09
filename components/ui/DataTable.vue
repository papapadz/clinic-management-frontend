<template>
  <section class="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
    <LoadingState v-if="loading" :rows="5" class="border-0 shadow-none" />
    <EmptyState v-else-if="rows.length === 0" :title="emptyTitle" :description="emptyDescription" />
    <template v-else>
      <div class="hidden overflow-x-auto md:block">
        <table class="min-w-full divide-y divide-border text-sm">
          <thead class="bg-muted/60">
            <tr>
              <th
                v-for="column in columns"
                :key="column.key"
                scope="col"
                :class="[
                  'px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted-foreground',
                  column.align === 'right' ? 'text-right' : '',
                ]"
              >
                {{ column.label }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr
              v-for="(row, index) in rows"
              :key="resolveRowKey(row, index)"
              v-motion
              :initial="{ opacity: 0, y: 8 }"
              :enter="{ opacity: 1, y: 0, transition: { delay: index * 25, duration: 180 } }"
              class="transition hover:bg-muted/40 motion-reduce:transition-none"
            >
              <td
                v-for="column in columns"
                :key="column.key"
                :class="[
                  'px-4 py-3 align-middle',
                  column.align === 'right' ? 'text-right' : '',
                ]"
              >
                <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                  {{ formatCell(row[column.key]) }}
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="divide-y divide-border md:hidden">
        <article
          v-for="(row, index) in rows"
          :key="resolveRowKey(row, index)"
          class="space-y-3 p-4"
        >
          <slot name="mobile-card" :row="row">
            <div v-for="column in columns" :key="column.key" class="flex items-start justify-between gap-3">
              <span class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{{ column.label }}</span>
              <span class="text-right text-sm text-foreground">{{ formatCell(row[column.key]) }}</span>
            </div>
          </slot>
        </article>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import type { DataTableColumn } from '~/types/ui'

const props = withDefaults(defineProps<{
  columns: DataTableColumn[]
  rows: T[]
  rowKey?: string | ((row: T, index: number) => string | number)
  loading?: boolean
  emptyTitle?: string
  emptyDescription?: string
}>(), {
  rowKey: 'id',
  emptyTitle: 'No records found',
  emptyDescription: 'Records will appear here when they are available.',
})

function resolveRowKey(row: T, index: number): string | number {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(row, index)
  }

  return row[props.rowKey] ?? index
}

function formatCell(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return '-'
  }

  if (Array.isArray(value)) {
    return value.length.toString()
  }

  return String(value)
}
</script>

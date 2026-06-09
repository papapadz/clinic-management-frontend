<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="System billing"
      title="Payment modes"
      description="Manage the global payment mode catalog used by billing transactions."
    >
      <template #actions>
        <BaseButton :icon="Plus" @click="openCreate">Add mode</BaseButton>
      </template>
    </PageHeader>

    <div v-if="error" class="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
      {{ error }}
    </div>
    <div v-if="successMessage" class="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
      {{ successMessage }}
    </div>

    <section class="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-border bg-muted/50 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          <tr>
            <th class="px-4 py-3">Mode</th>
            <th class="px-4 py-3">Code</th>
            <th class="px-4 py-3">Reference</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3 text-right">Sort</th>
            <th class="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          <tr v-for="mode in paymentModes" :key="mode.code" class="bg-background/60">
            <td class="px-4 py-3 font-semibold">{{ mode.name }}</td>
            <td class="px-4 py-3 text-muted-foreground">{{ mode.code }}</td>
            <td class="px-4 py-3">{{ mode.add_reference_number ? 'Required' : 'Not used' }}</td>
            <td class="px-4 py-3">
              <span :class="mode.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-muted text-muted-foreground'" class="rounded-full px-2 py-1 text-xs font-bold">
                {{ mode.is_active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-4 py-3 text-right">{{ mode.sort_order }}</td>
            <td class="px-4 py-3 text-right">
              <BaseButton size="sm" variant="outline" @click="openEdit(mode)">Edit</BaseButton>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <BaseDialog v-model:open="showEditor" :title="editingMode ? `Edit ${editingMode.code}` : 'Add payment mode'">
      <form class="space-y-4 p-5" @submit.prevent="saveMode">
        <FormField v-if="!editingMode" id="code" label="Code" :errors="fieldErrors('code')">
          <BaseInput id="code" v-model="form.code" required :has-error="fieldErrors('code').length > 0" />
        </FormField>
        <FormField id="name" label="Name" :errors="fieldErrors('name')">
          <BaseInput id="name" v-model="form.name" required :has-error="fieldErrors('name').length > 0" />
        </FormField>
        <FormField id="sort_order" label="Sort order" :errors="fieldErrors('sort_order')">
          <BaseInput id="sort_order" v-model="form.sort_order" type="number" min="0" required :has-error="fieldErrors('sort_order').length > 0" />
        </FormField>
        <label class="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm font-semibold">
          <input v-model="form.add_reference_number" type="checkbox" class="h-4 w-4 rounded border-input">
          Requires reference number
        </label>
        <label class="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm font-semibold">
          <input v-model="form.is_active" type="checkbox" class="h-4 w-4 rounded border-input">
          Active for new payments
        </label>
        <div class="flex justify-end gap-2">
          <BaseButton type="button" variant="outline" @click="closeEditor">Cancel</BaseButton>
          <BaseButton type="submit" :loading="saving">{{ editingMode ? 'Save changes' : 'Create mode' }}</BaseButton>
        </div>
      </form>
    </BaseDialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { Plus } from 'lucide-vue-next'
import type { PaymentModeRecord } from '~/types'
import { useApi } from '~/composables/useApi'

definePageMeta({ middleware: ['auth', 'tenant'] })

const api = useApi()
const paymentModes = ref<PaymentModeRecord[]>([])
const showEditor = ref(false)
const editingMode = ref<PaymentModeRecord | null>(null)
const saving = ref(false)
const error = ref('')
const successMessage = ref('')
const validationErrors = ref<Record<string, string[]> | null>(null)
const form = reactive({
  code: '',
  name: '',
  add_reference_number: false,
  is_active: true,
  sort_order: 0,
})

onMounted(loadModes)

async function loadModes() {
  const res = await api.api<PaymentModeRecord[]>(api.tenantPath('/billing/payment-modes'), { params: { include_inactive: 1 } })
  if (res.success) {
    paymentModes.value = res.data
  } else {
    error.value = res.message || 'Failed to load payment modes.'
  }
}

function openCreate() {
  editingMode.value = null
  Object.assign(form, { code: '', name: '', add_reference_number: false, is_active: true, sort_order: nextSortOrder() })
  validationErrors.value = null
  showEditor.value = true
}

function openEdit(mode: PaymentModeRecord) {
  editingMode.value = mode
  Object.assign(form, {
    code: mode.code,
    name: mode.name,
    add_reference_number: mode.add_reference_number,
    is_active: mode.is_active,
    sort_order: mode.sort_order,
  })
  validationErrors.value = null
  showEditor.value = true
}

function closeEditor() {
  showEditor.value = false
}

async function saveMode() {
  saving.value = true
  error.value = ''
  successMessage.value = ''
  validationErrors.value = null

  const body = {
    name: form.name,
    add_reference_number: form.add_reference_number,
    is_active: form.is_active,
    sort_order: Number(form.sort_order),
    ...(!editingMode.value ? { code: form.code } : {}),
  }
  const path = editingMode.value
    ? api.tenantPath(`/billing/payment-modes/${editingMode.value.id}`)
    : api.tenantPath('/billing/payment-modes')
  const method = editingMode.value ? 'PATCH' : 'POST'
  const res = await api.api<PaymentModeRecord>(path, { method, body })

  saving.value = false
  if (!res.success) {
    validationErrors.value = res.errors
    error.value = res.message || 'Payment mode request failed.'
    return
  }

  successMessage.value = res.message || 'Payment mode saved.'
  closeEditor()
  await loadModes()
}

function fieldErrors(field: string): string[] {
  return validationErrors.value?.[field] ?? []
}

function nextSortOrder(): number {
  return Math.max(0, ...paymentModes.value.map((mode) => Number(mode.sort_order))) + 10
}
</script>

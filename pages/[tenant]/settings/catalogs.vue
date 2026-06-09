<template>
  <div class="space-y-6">
    <PageHeader eyebrow="Settings" title="Catalogs" description="Manage tenant-wide clinic libraries and billing-adjacent catalog data.">
      <template #actions>
        <BaseButton v-if="isLibraryTab" :icon="Plus" @click="openCreate">Add item</BaseButton>
      </template>
    </PageHeader>

    <div v-if="error || successMessage" :class="error ? 'border-destructive/30 bg-destructive/10 text-destructive' : 'border-emerald-200 bg-emerald-50 text-emerald-800'" class="rounded-lg border px-4 py-3 text-sm font-medium">
      {{ error || successMessage }}
    </div>

    <div class="flex flex-wrap gap-2 border-b border-border pb-2">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        class="rounded-lg px-3 py-2 text-sm font-bold text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        :class="{ 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground': activeTab === tab.key }"
        @click="selectTab(tab.key)"
      >
        {{ tab.label }}
      </button>
    </div>

    <section v-if="isLibraryTab" class="space-y-4">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchToolbar v-model="search" placeholder="Search catalog..." label="Search catalog" class="sm:max-w-md" />
        <label class="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <input v-model="showDeleted" type="checkbox" class="h-4 w-4 rounded border-input">
          Show deleted
        </label>
      </div>

      <div class="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-border bg-muted/50 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            <tr>
              <th class="px-4 py-3">Name</th>
              <th class="px-4 py-3">Code</th>
              <th class="px-4 py-3">Metadata</th>
              <th class="px-4 py-3 text-right">Price</th>
              <th class="px-4 py-3 text-right">Sort</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-for="item in libraryItems" :key="item.id ?? item.code" class="bg-background/60 align-top">
              <td class="px-4 py-3">
                <p class="font-semibold">{{ item.name }}</p>
                <p v-if="item.description" class="mt-1 text-xs text-muted-foreground">{{ item.description }}</p>
              </td>
              <td class="px-4 py-3 font-mono text-xs text-muted-foreground">{{ item.code }}</td>
              <td class="px-4 py-3 text-xs text-muted-foreground">{{ metadataSummary(item) }}</td>
              <td class="px-4 py-3 text-right">{{ money(item.price) }}</td>
              <td class="px-4 py-3 text-right">{{ item.sort_order }}</td>
              <td class="px-4 py-3">
                <span :class="item.deleted_at ? 'bg-rose-50 text-rose-700' : item.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-muted text-muted-foreground'" class="rounded-full px-2 py-1 text-xs font-bold">
                  {{ item.deleted_at ? 'Deleted' : item.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex justify-end gap-2">
                  <BaseButton v-if="!item.deleted_at" size="sm" variant="outline" @click="openEdit(item)">Edit</BaseButton>
                  <BaseButton v-if="!item.deleted_at && item.is_active" size="sm" variant="outline" @click="deactivateItem(item)">Deactivate</BaseButton>
                  <BaseButton v-if="!item.deleted_at" size="sm" variant="danger" @click="deleteItem(item)">Delete</BaseButton>
                  <BaseButton v-if="item.deleted_at" size="sm" variant="outline" @click="restoreItem(item)">Restore</BaseButton>
                </div>
              </td>
            </tr>
            <tr v-if="!loading && libraryItems.length === 0">
              <td colspan="7" class="px-4 py-10 text-center text-sm font-medium text-muted-foreground">No catalog items found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-else-if="activeTab === 'vat_rates'" class="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-border bg-muted/50 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          <tr>
            <th class="px-4 py-3">Rate</th>
            <th class="px-4 py-3 text-right">Percentage</th>
            <th class="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          <tr v-for="rate in vatRates" :key="rate.id ?? rate.name">
            <td class="px-4 py-3 font-semibold">{{ rate.name }}</td>
            <td class="px-4 py-3 text-right">{{ rate.percentage }}%</td>
            <td class="px-4 py-3">{{ rate.is_default ? 'Default' : 'Available' }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section v-else-if="activeTab === 'pharmacy_inventory'" class="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-border bg-muted/50 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          <tr>
            <th class="px-4 py-3">Item</th>
            <th class="px-4 py-3">Strength</th>
            <th class="px-4 py-3 text-right">Stock</th>
            <th class="px-4 py-3 text-right">Selling price</th>
            <th class="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          <tr v-for="item in pharmacyItems" :key="item.id">
            <td class="px-4 py-3">
              <p class="font-semibold">{{ item.generic_name }}</p>
              <p v-if="item.brand_name" class="text-xs text-muted-foreground">{{ item.brand_name }}</p>
            </td>
            <td class="px-4 py-3">{{ item.strength || item.dosage_form }}</td>
            <td class="px-4 py-3 text-right">{{ item.current_stock }}</td>
            <td class="px-4 py-3 text-right">{{ money(item.selling_price) }}</td>
            <td class="px-4 py-3">{{ item.is_active ? 'Active' : 'Inactive' }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section v-else class="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-base font-bold">Global payment modes</p>
          <p class="mt-1 text-sm text-muted-foreground">{{ paymentModes.length }} configured modes</p>
        </div>
        <BaseButton :to="`/${route.params.tenant}/settings/payment-modes`" variant="outline">Open payment modes</BaseButton>
      </div>
    </section>

    <BaseDialog v-model:open="showEditor" :title="editingItem ? `Edit ${editingItem.code}` : 'Add catalog item'">
      <form class="grid max-h-[75vh] gap-4 overflow-y-auto p-5 md:grid-cols-2" @submit.prevent="saveItem">
        <FormField id="name" label="Name" :errors="fieldErrors('name')">
          <BaseInput id="name" v-model="form.name" required :has-error="fieldErrors('name').length > 0" @input="syncCode" />
        </FormField>
        <FormField id="code" label="Code" :errors="fieldErrors('code')">
          <BaseInput id="code" v-model="form.code" :disabled="Boolean(editingItem)" required :has-error="fieldErrors('code').length > 0" />
        </FormField>
        <FormField id="price" label="Price" :errors="fieldErrors('price')">
          <BaseInput id="price" v-model="form.price" type="number" min="0" step="0.01" :has-error="fieldErrors('price').length > 0" />
        </FormField>
        <FormField id="sort_order" label="Sort order" :errors="fieldErrors('sort_order')">
          <BaseInput id="sort_order" v-model="form.sort_order" type="number" min="0" :has-error="fieldErrors('sort_order').length > 0" />
        </FormField>
        <FormField id="description" label="Description" class="md:col-span-2" :errors="fieldErrors('description')">
          <textarea id="description" v-model="form.description" class="min-h-20 w-full rounded-lg border border-input bg-background/90 px-3 py-2 text-sm shadow-sm outline-none focus:border-primary/50 focus:ring-4 focus:ring-ring/15" />
        </FormField>
        <template v-if="activeTab === 'lab_procedure'">
          <FormField id="loinc_code" label="LOINC code">
            <BaseInput id="loinc_code" v-model="form.metadata.loinc_code" />
          </FormField>
          <FormField id="specimen_type" label="Specimen type">
            <BaseInput id="specimen_type" v-model="form.metadata.specimen_type" />
          </FormField>
        </template>
        <template v-if="activeTab === 'imaging_procedure'">
          <FormField id="modality" label="Modality" :errors="fieldErrors('modality')">
            <BaseInput id="modality" v-model="form.metadata.modality" required :has-error="fieldErrors('modality').length > 0" />
          </FormField>
          <FormField id="body_part" label="Body part" :errors="fieldErrors('body_part')">
            <BaseInput id="body_part" v-model="form.metadata.body_part" required :has-error="fieldErrors('body_part').length > 0" />
          </FormField>
        </template>
        <label class="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm font-semibold md:col-span-2">
          <input v-model="form.is_active" type="checkbox" class="h-4 w-4 rounded border-input">
          Active
        </label>
        <div class="flex justify-end gap-2 md:col-span-2">
          <BaseButton type="button" variant="outline" @click="showEditor = false">Cancel</BaseButton>
          <BaseButton type="submit" :loading="saving">{{ editingItem ? 'Save changes' : 'Create item' }}</BaseButton>
        </div>
      </form>
    </BaseDialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { Plus } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import type { LibraryForm, LibraryKey, LibraryRecord } from '~/types'
import { useAuthStore } from '~/stores/auth'
import { useCatalogs } from '~/composables/useCatalogs'
import { catalogTabsForRoles, libraryTabs, suggestLibraryCode } from '~/utils/catalogs'

definePageMeta({ middleware: ['auth', 'tenant'] })

const route = useRoute()
const auth = useAuthStore()
const {
  libraryItems,
  vatRates,
  pharmacyItems,
  paymentModes,
  loading,
  saving,
  error,
  validationErrors,
  fetchLibrary,
  saveLibraryItem,
  deactivateLibraryItem,
  deleteLibraryItem,
  restoreLibraryItem,
  fetchVatRates,
  fetchPharmacyItems,
  fetchPaymentModes,
} = useCatalogs()

const roles = computed(() => auth.user?.roles ?? [])
const tabs = computed(() => catalogTabsForRoles(roles.value))
const activeTab = ref<LibraryKey | 'vat_rates' | 'pharmacy_inventory' | 'payment_modes'>('appointment_type')
const search = ref('')
const showDeleted = ref(false)
const showEditor = ref(false)
const editingItem = ref<LibraryRecord | null>(null)
const successMessage = ref('')
const form = reactive<LibraryForm>(emptyForm('appointment_type'))
const isLibraryTab = computed(() => libraryTabs.some((tab) => tab.key === activeTab.value))

onMounted(loadActiveTab)

watch([search, showDeleted], () => {
  if (isLibraryTab.value) {
    loadActiveTab()
  }
})

function selectTab(tab: typeof activeTab.value) {
  activeTab.value = tab
  search.value = ''
  showDeleted.value = false
  loadActiveTab()
}

async function loadActiveTab() {
  if (isLibraryTab.value) {
    await fetchLibrary(activeTab.value as LibraryKey, {
      search: search.value || undefined,
      show_deleted: showDeleted.value ? 1 : undefined,
      per_page: 50,
    })
  } else if (activeTab.value === 'vat_rates') {
    await fetchVatRates()
  } else if (activeTab.value === 'pharmacy_inventory') {
    await fetchPharmacyItems({ per_page: 50 })
  } else {
    await fetchPaymentModes()
  }
}

function openCreate() {
  editingItem.value = null
  Object.assign(form, emptyForm(activeTab.value as LibraryKey))
  showEditor.value = true
}

function openEdit(item: LibraryRecord) {
  editingItem.value = item
  Object.assign(form, {
    library: item.library,
    code: item.code,
    name: item.name,
    description: item.description ?? '',
    price: item.price ?? 0,
    sort_order: item.sort_order ?? 0,
    is_active: item.is_active,
    metadata: { ...(item.metadata ?? {}) },
  })
  showEditor.value = true
}

async function saveItem() {
  successMessage.value = ''
  const res = await saveLibraryItem(form, editingItem.value?.id)
  if (res.success) {
    successMessage.value = res.message || 'Catalog item saved.'
    showEditor.value = false
    await loadActiveTab()
  }
}

async function deactivateItem(item: LibraryRecord) {
  const res = await deactivateLibraryItem(item.library, item.id as string | number)
  if (res.success) {
    successMessage.value = res.message || 'Catalog item deactivated.'
    await loadActiveTab()
  }
}

async function deleteItem(item: LibraryRecord) {
  const res = await deleteLibraryItem(item.library, item.id as string | number)
  if (res.success) {
    successMessage.value = res.message || 'Catalog item deleted.'
    await loadActiveTab()
  }
}

async function restoreItem(item: LibraryRecord) {
  const res = await restoreLibraryItem(item.library, item.id as string | number)
  if (res.success) {
    successMessage.value = res.message || 'Catalog item restored.'
    await loadActiveTab()
  }
}

function syncCode() {
  if (!editingItem.value && form.name && !form.code) {
    form.code = suggestLibraryCode(form.name)
  }
}

function emptyForm(library: LibraryKey): LibraryForm {
  return {
    library,
    code: '',
    name: '',
    description: '',
    price: 0,
    sort_order: nextSortOrder(),
    is_active: true,
    metadata: {},
  }
}

function nextSortOrder(): number {
  return Math.max(0, ...libraryItems.value.map((item) => Number(item.sort_order))) + 10
}

function fieldErrors(field: string): string[] {
  return validationErrors.value?.[field] ?? []
}

function metadataSummary(item: LibraryRecord): string {
  const metadata = item.metadata ?? {}
  return [metadata.loinc_code, metadata.specimen_type, metadata.modality, metadata.body_part]
    .filter(Boolean)
    .join(' / ') || '-'
}

function money(value: string | number): string {
  return Number(value || 0).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })
}
</script>

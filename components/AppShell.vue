<template>
  <div class="min-h-screen bg-background text-foreground">
    <div class="flex min-h-screen">
      <aside class="hidden w-72 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex lg:flex-col">
        <div class="px-5 py-5">
          <div class="flex items-center gap-3">
            <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-primary/20">
              <HeartPulse class="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p class="text-base font-bold">ClinicMS</p>
              <p class="text-xs text-sidebar-foreground/60">{{ tenantLabel }}</p>
            </div>
          </div>
        </div>
        <nav class="flex-1 space-y-1 px-3" aria-label="Clinic navigation">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-sidebar-foreground/70 transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-primary motion-reduce:transition-none"
            :class="{ 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm shadow-primary/20 hover:bg-sidebar-primary hover:text-sidebar-primary-foreground': isActive(item.to) }"
          >
            <component :is="item.icon" class="h-4 w-4 shrink-0" aria-hidden="true" />
            {{ item.label }}
          </NuxtLink>
        </nav>
        <div class="border-t border-sidebar-border p-4">
          <div class="rounded-2xl bg-sidebar-accent p-4">
            <p class="text-sm font-bold">Daily flow</p>
            <p class="mt-1 text-xs leading-5 text-sidebar-foreground/65">Patients, appointments, labs, billing, and handoffs in one calm workspace.</p>
          </div>
        </div>
      </aside>

      <div class="flex min-w-0 flex-1 flex-col pb-20 lg:pb-0">
        <header class="sticky top-0 z-40 border-b border-border/80 bg-background/85 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="text-xs font-bold uppercase tracking-[0.18em] text-primary">{{ tenantLabel }}</p>
              <slot name="header">
                <p class="truncate text-lg font-bold text-foreground">{{ currentSection }}</p>
              </slot>
            </div>
            <div class="flex items-center gap-2">
              <slot name="actions" />
              <BaseButton variant="ghost" size="icon" :icon="Bell" aria-label="Notifications" />
              <button class="flex items-center gap-2 rounded-xl border border-border bg-card px-2.5 py-2 text-left shadow-sm transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none">
                <span class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {{ initials }}
                </span>
                <span class="hidden min-w-0 sm:block">
                  <span class="block truncate text-sm font-bold">{{ auth.user?.name ?? 'Clinic user' }}</span>
                  <span class="block truncate text-xs text-muted-foreground">{{ roleLabel }}</span>
                </span>
              </button>
              <BaseButton variant="ghost" size="icon" :icon="LogOut" aria-label="Sign out" @click="signOut" />
            </div>
          </div>
        </header>

        <main class="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div class="mx-auto w-full max-w-7xl">
            <slot />
          </div>
        </main>
      </div>
    </div>

    <nav class="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-2 py-2 shadow-[0_-12px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:hidden" aria-label="Mobile clinic navigation">
      <div class="grid grid-cols-5 gap-1">
        <NuxtLink
          v-for="item in mobileNavItems"
          :key="item.to"
          :to="item.to"
          class="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-semibold text-muted-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
          :class="{ 'bg-primary/10 text-primary': isActive(item.to) }"
        >
          <component :is="item.icon" class="h-5 w-5" aria-hidden="true" />
          <span class="max-w-full truncate">{{ item.label }}</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Bell,
  CalendarDays,
  ClipboardList,
  CreditCard,
  FileText,
  FolderCog,
  Landmark,
  HeartPulse,
  Home,
  Image,
  LogOut,
  Pill,
  TestTube2,
  Users,
} from 'lucide-vue-next'
import type { Component } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useTenantStore } from '~/stores/tenant'

interface NavItem {
  label: string
  to: string
  icon: Component
  visible?: boolean
}

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const tenantStore = useTenantStore()

const tenant = computed(() => String(route.params.tenant ?? tenantStore.currentTenant?.slug ?? 'default'))
const permissions = computed(() => auth.user?.permissions ?? [])
const roles = computed(() => auth.user?.roles ?? [])
const isSuperAdmin = computed(() => roles.value.includes('super_admin'))
const isAdmin = computed(() => roles.value.includes('admin'))
const isClinician = computed(() => roles.value.includes('clinician'))
const isReceptionist = computed(() => roles.value.includes('receptionist'))
const isPharmacist = computed(() => roles.value.includes('pharmacist'))
const isMedTech = computed(() => roles.value.includes('medtech'))
const isRadTech = computed(() => roles.value.includes('radtech'))
const isCashier = computed(() => roles.value.includes('cashier'))
const canViewPatients = computed(() => isSuperAdmin.value || permissions.value.length === 0 || permissions.value.includes('patients.viewAny'))
const canManageCatalogs = computed(() => isSuperAdmin.value || isAdmin.value || permissions.value.includes('manage_catalogs'))
const canViewAppointments = computed(() => isSuperAdmin.value || isAdmin.value || isClinician.value || isReceptionist.value)
const canViewLab = computed(() => isSuperAdmin.value || isAdmin.value || isMedTech.value || isReceptionist.value)
const canViewImaging = computed(() => isSuperAdmin.value || isAdmin.value || isRadTech.value || isReceptionist.value)
const canViewBilling = computed(() => isSuperAdmin.value || isAdmin.value || isCashier.value || isReceptionist.value)
const canViewPharmacy = computed(() => isSuperAdmin.value || isAdmin.value || isPharmacist.value || isReceptionist.value)
const canViewRecords = computed(() => isSuperAdmin.value || isAdmin.value || permissions.value.includes('records.viewAny'))
const canViewReports = computed(() => isSuperAdmin.value || isAdmin.value || permissions.value.includes('reports.viewAny'))
const tenantLabel = computed(() => tenantStore.currentTenant?.name ?? `${tenant.value.charAt(0).toUpperCase()}${tenant.value.slice(1)} clinic`)
const roleLabel = computed(() => {
  const role = auth.user?.roles?.[0] as unknown
  const roleName = typeof role === 'string'
    ? role
    : role && typeof role === 'object' && 'name' in role && typeof role.name === 'string'
      ? role.name
      : null

  return roleName?.replace(/_/g, ' ') ?? 'Staff workspace'
})
const initials = computed(() => {
  const name = auth.user?.name ?? 'Clinic User'
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
})

const navItems = computed<NavItem[]>(() => [
  { label: 'Dashboard', to: `/${tenant.value}/dashboard`, icon: Home },
  { label: 'Patients', to: `/${tenant.value}/patients`, icon: Users, visible: canViewPatients.value },
  { label: 'Appointments', to: `/${tenant.value}/appointments`, icon: CalendarDays, visible: canViewAppointments.value },
  { label: 'Lab', to: `/${tenant.value}/lab`, icon: TestTube2, visible: canViewLab.value },
  { label: 'Imaging', to: `/${tenant.value}/imaging`, icon: Image, visible: canViewImaging.value },
  { label: 'Pharmacy', to: `/${tenant.value}/pharmacy`, icon: Pill, visible: canViewPharmacy.value },
  { label: 'Billing', to: `/${tenant.value}/billing`, icon: CreditCard, visible: canViewBilling.value },
  { label: 'Catalogs', to: `/${tenant.value}/settings/catalogs`, icon: FolderCog, visible: canManageCatalogs.value },
  { label: 'Payment modes', to: `/${tenant.value}/settings/payment-modes`, icon: Landmark, visible: isSuperAdmin.value },
  { label: 'Records', to: `/${tenant.value}/records`, icon: FileText, visible: canViewRecords.value },
  { label: 'Reports', to: `/${tenant.value}/reports`, icon: ClipboardList, visible: canViewReports.value },
].filter((item) => item.visible !== false))

const mobileNavItems = computed(() => {
  const preferred = ['Dashboard', 'Patients', 'Appointments', 'Billing']
  const primary = navItems.value.filter((item) => preferred.includes(item.label))
  const reports = navItems.value.find((item) => item.label === 'Reports')
  return reports ? [...primary, reports] : primary.slice(0, 5)
})

const currentSection = computed(() => {
  const item = navItems.value.find((navItem) => isActive(navItem.to))
  return item?.label ?? 'Clinic workspace'
})

function isActive(path: string): boolean {
  return route.path === path || route.path.startsWith(`${path}/`)
}

function signOut() {
  auth.clearAuth()
  tenantStore.clearTenant()
  router.push('/login')
}
</script>

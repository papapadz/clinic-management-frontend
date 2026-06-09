<template>
  <div class="min-h-screen bg-background text-foreground">
    <main class="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
      <section class="relative hidden overflow-hidden bg-sidebar p-10 text-sidebar-foreground lg:flex lg:flex-col lg:justify-between">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(45,212,191,0.26),transparent_30rem)]" aria-hidden="true" />
        <div class="relative z-10 flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-primary/20">
            <span class="text-lg font-black">C</span>
          </div>
          <div>
            <p class="text-lg font-bold">ClinicMS</p>
            <p class="text-sm text-sidebar-foreground/65">Warm clinic operations</p>
          </div>
        </div>

        <div class="relative z-10 max-w-xl">
          <p class="text-sm font-bold uppercase tracking-[0.18em] text-sidebar-primary">Daily flow, softened</p>
          <h1 class="mt-4 text-5xl font-bold leading-tight tracking-normal">
            A calmer workspace for busy care teams.
          </h1>
          <p class="mt-5 text-base leading-7 text-sidebar-foreground/70">
            Patient lookup, schedules, labs, imaging, pharmacy, and billing stay close at hand without making the day feel louder than it already is.
          </p>
        </div>

        <div class="relative z-10 grid grid-cols-3 gap-3">
          <div class="rounded-2xl border border-sidebar-border bg-sidebar-accent/70 p-4">
            <p class="text-2xl font-bold">24/7</p>
            <p class="mt-1 text-xs text-sidebar-foreground/60">Care-ready access</p>
          </div>
          <div class="rounded-2xl border border-sidebar-border bg-sidebar-accent/70 p-4">
            <p class="text-2xl font-bold">FHIR</p>
            <p class="mt-1 text-xs text-sidebar-foreground/60">Record-aware core</p>
          </div>
          <div class="rounded-2xl border border-sidebar-border bg-sidebar-accent/70 p-4">
            <p class="text-2xl font-bold">PHI</p>
            <p class="mt-1 text-xs text-sidebar-foreground/60">Privacy-first flow</p>
          </div>
        </div>
      </section>

      <section class="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <div class="w-full max-w-md">
          <div class="mb-8 text-center lg:hidden">
            <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <span class="text-lg font-black">C</span>
            </div>
            <p class="text-lg font-bold">ClinicMS</p>
          </div>
          <div class="rounded-3xl border border-border bg-card/90 p-6 shadow-warm backdrop-blur sm:p-8">
            <slot />
          </div>
          <footer class="mt-6 text-center text-xs text-muted-foreground">
            &copy; {{ new Date().getFullYear() }} ClinicMS. All rights reserved.
          </footer>
        </div>
      </section>
    </main>
  </div>
</template>
<script setup lang="ts"></script>

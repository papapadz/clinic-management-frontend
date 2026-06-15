<template>
  <div class="landing-page">
    <a class="skip-link" href="#main">Skip to content</a>

    <header id="nav" class="nav" :class="{ 'is-scrolled': isScrolled }">
      <div class="nav__inner">
        <a class="nav__brand" href="#top">
          <img class="nav__mark" :src="appIconUrl" :alt="`${appName} logo`">
          {{ appName }}
        </a>
        <nav class="nav__links" :class="{ 'is-open': isMenuOpen }" aria-label="Primary">
          <a href="#journey" @click="closeMenu">Workflow</a>
          <a href="#features" @click="closeMenu">Features</a>
          <a href="#roles" @click="closeMenu">Roles</a>
          <a href="#why" @click="closeMenu">Why {{ appName }}</a>
        </nav>
        <div class="nav__actions">
          <a class="btn btn--primary btn--sm" href="#cta">Login</a>
          <button
            class="nav__toggle"
            aria-label="Toggle menu"
            :aria-expanded="isMenuOpen"
            @click="isMenuOpen = !isMenuOpen"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <main id="main">
      <section id="top" class="hero">
        <div class="hero__ecg" aria-hidden="true">
          <svg viewBox="0 0 1600 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <g class="ecg-group">
              <path class="ecg-path" :d="ecgPath" />
            </g>
          </svg>
        </div>
        <div class="section-inner hero__inner">
          <div>
            <p class="eyebrow eyebrow--light">Clinic operations platform</p>
            <h1 class="hero__title">One chart.<br>Every department.</h1>
            <p class="hero__sub">
              {{ appName }} connects your front desk, consultation rooms, lab, pharmacy, and cashier into a single patient record so nothing gets re-typed, re-explained, or lost between departments.
            </p>
            <div class="hero__actions">
              <a class="btn btn--primary" href="#cta">Login</a>
              <a class="btn btn--ghost" href="#journey">See how it works &darr;</a>
            </div>
            <ul class="hero__chips">
              <li>Multi-clinic ready</li>
              <li>Role-based access</li>
              <li>Print-ready documents</li>
            </ul>
          </div>

          <div class="hero__mock" aria-hidden="true">
            <div class="mock__bar">
              <span class="mock__dot" />
              <span class="mock__dot" />
              <span class="mock__dot" />
              <span class="mock__url">{{ appName }} workspace / sunrise clinic</span>
            </div>
            <div class="mock__body">
              <div class="mock__stats">
                <div class="mock__stat"><span class="mock__num">1,248</span><span class="mock__label">Patients</span></div>
                <div class="mock__stat"><span class="mock__num">37</span><span class="mock__label">Appointments</span></div>
                <div class="mock__stat"><span class="mock__num">19</span><span class="mock__label">Encounters</span></div>
              </div>
              <div class="mock__rows">
                <div class="mock__row"><span>Dela Cruz, Maria - Follow-up</span><span class="badge badge--warning">Checked in</span></div>
                <div class="mock__row"><span>CBC + Urinalysis - Lab</span><span class="badge badge--success">Released</span></div>
                <div class="mock__row"><span>INV-00231 - &#8369;850.00</span><span class="badge badge--success">Paid</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="journey" class="journey">
        <div class="section-inner">
          <p class="eyebrow">The patient journey</p>
          <h2 class="section-title">From walk-in to receipt, one record.</h2>
          <p class="section-sub">
            Every visit moves through the same statuses your staff already use day to day. {{ appName }} just makes sure each department sees them the moment they change.
          </p>

          <div class="journey__steps">
            <article class="journey__step reveal">
              <span class="journey__dept">Front desk</span>
              <h3>Patient record</h3>
              <div class="journey__badges"><span class="badge badge--success">Active</span></div>
            </article>
            <span class="journey__arrow" aria-hidden="true">&rarr;</span>

            <article class="journey__step reveal">
              <span class="journey__dept">Scheduling</span>
              <h3>Appointment</h3>
              <div class="journey__badges">
                <span class="badge badge--warning">Scheduled</span>
                <span class="badge badge--info">Checked in</span>
              </div>
            </article>
            <span class="journey__arrow" aria-hidden="true">&rarr;</span>

            <article class="journey__step reveal">
              <span class="journey__dept">Consultation</span>
              <h3>Encounter &middot; SOAP note</h3>
              <div class="journey__badges">
                <span class="badge badge--neutral">Draft</span>
                <span class="badge badge--success">Signed</span>
              </div>
            </article>
            <span class="journey__arrow" aria-hidden="true">&rarr;</span>

            <article class="journey__step reveal">
              <span class="journey__dept">Diagnostics</span>
              <h3>Lab &amp; imaging</h3>
              <div class="journey__badges">
                <span class="badge badge--warning">Requested</span>
                <span class="badge badge--success">Released</span>
              </div>
            </article>
            <span class="journey__arrow" aria-hidden="true">&rarr;</span>

            <article class="journey__step reveal">
              <span class="journey__dept">Pharmacy</span>
              <h3>Dispensing</h3>
              <div class="journey__badges"><span class="badge badge--warning">Dispensing</span></div>
            </article>
            <span class="journey__arrow" aria-hidden="true">&rarr;</span>

            <article class="journey__step reveal">
              <span class="journey__dept">Cashier</span>
              <h3>Billing</h3>
              <div class="journey__badges">
                <span class="badge badge--warning">Pending</span>
                <span class="badge badge--success">Paid</span>
              </div>
            </article>
            <span class="journey__arrow" aria-hidden="true">&rarr;</span>

            <article class="journey__step reveal">
              <span class="journey__dept">Records</span>
              <h3>Medical records</h3>
              <div class="journey__badges"><span class="badge badge--success">Released</span></div>
            </article>
          </div>
        </div>
      </section>

      <section id="features" class="features">
        <div class="section-inner">
          <p class="eyebrow">Everything in one place</p>
          <h2 class="section-title">Eight modules. One workspace.</h2>
          <p class="section-sub">
            No more switching between a scheduling book, a spreadsheet for billing, and a drawer of paper charts. Every part of the visit lives in the same system.
          </p>

          <div class="features__grid">
            <article v-for="feature in features" :key="feature.title" class="feature reveal">
              <div class="feature__icon" aria-hidden="true" v-html="feature.icon" />
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="roles" class="roles">
        <div class="section-inner">
          <p class="eyebrow">One login. The right screen.</p>
          <h2 class="section-title">Built for every seat in the clinic.</h2>
          <p class="section-sub">
            {{ appName }} shows each staff member exactly what their job needs: nothing to dig through, nothing they should not see.
          </p>

          <div class="roles__grid">
            <article v-for="role in roles" :key="role.title" class="role reveal">
              <h3>{{ role.title }}</h3>
              <p>{{ role.description }}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="why" class="why">
        <div class="section-inner">
          <p class="eyebrow eyebrow--dark">Why clinics switch</p>
          <h2 class="section-title">Made for how clinics actually run.</h2>
          <p class="section-sub">
            Not a generic spreadsheet replacement, a system modeled on the way your front desk, consult rooms, and cashier already work.
          </p>

          <div class="why__grid">
            <article v-for="reason in reasons" :key="reason.title" class="why__item reveal">
              <div class="why__icon" aria-hidden="true" v-html="reason.icon" />
              <h3>{{ reason.title }}</h3>
              <p>{{ reason.description }}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="cta" class="cta-final">
        <div class="section-inner">
          <h2>See {{ appName }} running with your clinic's data.</h2>
          <p>Book a walkthrough and we will set up a sample workspace using your clinic's appointment types, lab panels, and payment modes.</p>
          <NuxtLink class="btn btn--primary btn--lg" to="/login">Login</NuxtLink>
          <p class="cta-final__note">No commitment, just a look at your workflow inside {{ appName }}.</p>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="section-inner footer__inner">
        <a class="footer__brand" href="#top">
          <img class="footer__mark" :src="appIconUrl" :alt="`${appName} logo`">
          {{ appName }}
        </a>
        <nav class="footer__links" aria-label="Footer">
          <a href="#journey">Workflow</a>
          <a href="#features">Features</a>
          <a href="#roles">Roles</a>
          <NuxtLink to="/login">Login</NuxtLink>
        </nav>
        <div class="footer__fine">&copy; {{ appName }}. Built for clinics that run on more than one piece of paper.</div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import appIconUrl from '~/assets/logo/honeycomb-ehr-app-icon.png'

definePageMeta({
  layout: false,
})

const config = useRuntimeConfig()
const appName = computed(() => config.public.appName)
const isScrolled = ref(false)
const isMenuOpen = ref(false)

useHead(() => ({
  title: `${appName.value} - One chart. Every department.`,
  meta: [
    {
      name: 'description',
      content: `${appName.value} connects registration, scheduling, consultations, lab and imaging, pharmacy, and billing into one clinic workspace.`,
    },
  ],
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap',
    },
  ],
}))

const ecgPath = computed(() => {
  const unit = 'L40,60 L52,42 L64,60 L78,94 L92,14 L106,80 L120,60 L150,48 L170,60 L200,60'
  return `M0,60 ${Array.from({ length: 9 }, (_, index) =>
    unit.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_, x: string, y: string) => `${Number.parseFloat(x) + index * 200},${y}`),
  ).join(' ')}`
})

const features = [
  {
    title: 'Patients',
    description: 'One record per person: demographics, allergies, chronic conditions, PhilHealth and HMO details, searchable in seconds.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.2"/><path d="M4.5 20c0-3.8 3.3-6 7.5-6s7.5 2.2 7.5 6"/></svg>',
  },
  {
    title: 'Appointments',
    description: 'Book, confirm, and check patients in. Track status from scheduled through completed or no-show, and print a slip at the counter.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 9.5h17M8 3v3M16 3v3"/></svg>',
  },
  {
    title: 'Encounters & SOAP notes',
    description: 'Capture chief complaint, vitals, exam findings, assessment, and plan in a structured note, then sign it to lock the record.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M9 3.5V3a1 1 0 011-1h4a1 1 0 011 1v.5M8.5 9h7M8.5 12.5h7M8.5 16h4.5"/></svg>',
  },
  {
    title: 'Lab & imaging',
    description: 'Order tests and studies straight from the consult, set priority from routine to stat, record results, and release reports.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2.5h5"/><path d="M10.5 2.5v12.5a3.5 3.5 0 007 0V2.5"/><path d="M10.5 10.5h7"/></svg>',
  },
  {
    title: 'Pharmacy',
    description: "Dispense against live stock. Every transaction updates inventory and writes back to the patient's chart automatically.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><g transform="rotate(45 12 12)"><rect x="4" y="9" width="16" height="6" rx="3"/><line x1="12" y1="9" x2="12" y2="15"/></g></svg>',
  },
  {
    title: 'Billing',
    description: 'Itemized bills with discounts and VAT, partial payments, and the payment modes your patients already use: cash, card, GCash, Maya, PhilHealth, HMO.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18"/><circle cx="17" cy="14.5" r="1" fill="currentColor" stroke="none"/></svg>',
  },
  {
    title: 'Medical records',
    description: 'Track every certificate, referral, and report you release: who received it, when, and why.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 2.5h7l4 4v13a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 016 19.5V4A1.5 1.5 0 017.5 2.5z"/><path d="M14 2.5v4h4"/><path d="M9 12h6M9 15.5h6"/></svg>',
  },
  {
    title: 'Reports',
    description: 'Daily census, revenue, lab turnaround, appointment analytics, and inventory valuation: as charts or tables, any date range.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 20V11M11 20V5M17 20V13M3 20h18"/></svg>',
  },
]

const roles = [
  { title: 'Admin', description: "Runs the clinic's catalogs, users, and configuration." },
  { title: 'Clinician', description: 'Consults, documents SOAP notes, and orders care.' },
  { title: 'Receptionist', description: 'Registers patients and manages the schedule.' },
  { title: 'Pharmacist', description: 'Dispenses medication against live inventory.' },
  { title: 'Medtech', description: 'Processes lab requests through to release.' },
  { title: 'Radtech', description: 'Processes imaging studies and reports.' },
  { title: 'Cashier', description: 'Creates bills, takes payments, manages voids.' },
  { title: 'Super admin', description: 'Oversees every clinic from one account.' },
]

const reasons = [
  {
    title: 'Multi-tenant by design',
    description: "Every clinic gets its own private workspace and address. Your records never mix with anyone else's, even on a shared system.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/></svg>',
  },
  {
    title: 'Print-ready, every time',
    description: "Invoices, prescriptions, lab and imaging requests, and dispensing slips print clean, with your clinic's details already in place.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8V3h12v5"/><rect x="4" y="8" width="16" height="8" rx="1.5"/><rect x="7" y="14" width="10" height="6" rx="1"/></svg>',
  },
  {
    title: 'Quick orders from the consult room',
    description: 'A clinician can order labs, imaging, medicine, a follow-up, and the bill, all without leaving the encounter.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h6l-1 8 9-12h-6z"/></svg>',
  },
  {
    title: 'Local payments and insurance, built in',
    description: 'Cash, card, GCash, Maya, PhilHealth, and HMO, recorded the way your cashier already collects them.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z"/><path d="M9 12l2.2 2.2L15.5 9.5"/></svg>',
  },
]

function closeMenu() {
  isMenuOpen.value = false
}

function onScroll() {
  isScrolled.value = window.scrollY > 8
}

let observer: IntersectionObserver | null = null

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer?.unobserve(entry.target)
        }
      })
    }, { threshold: 0.15 })

    document.querySelectorAll('.reveal').forEach((element) => observer?.observe(element))
  } else {
    document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'))
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  observer?.disconnect()
})
</script>

<style scoped>
.landing-page {
  --ink: #14241f;
  --paper: #f6f4ee;
  --forest: #1e4438;
  --forest-deep: #142e26;
  --sage: #e1eae3;
  --leaf: #3f8a6d;
  --pulse: #ee7b4f;
  --line: #d6ded9;
  --font-display: 'Space Grotesk', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;
  min-height: 100vh;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-body);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

.landing-page *,
.landing-page *::before,
.landing-page *::after {
  box-sizing: border-box;
}

.landing-page :deep(img),
.landing-page :deep(svg) {
  display: block;
}

.landing-page a {
  color: inherit;
}

.landing-page ul {
  margin: 0;
}

.skip-link {
  position: absolute;
  left: -999px;
  top: 0;
  z-index: 100;
  background: var(--ink);
  color: #fff;
  padding: 10px 16px;
}

.skip-link:focus {
  left: 16px;
  top: 16px;
  border-radius: 8px;
}

.section-inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 24px;
}

.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid transparent;
  background: rgba(246, 244, 238, 0.86);
  backdrop-filter: blur(10px);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.nav.is-scrolled {
  border-color: var(--line);
  box-shadow: 0 1px 0 var(--line);
}

.nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1120px;
  margin: 0 auto;
  padding: 14px 24px;
  gap: 24px;
}

.nav__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}

.nav__mark {
  width: 30px;
  height: 30px;
  flex: 0 0 auto;
  border-radius: 8px;
  object-fit: cover;
}

.nav__links {
  display: flex;
  gap: 28px;
  font-size: 0.95rem;
  font-weight: 500;
}

.nav__links a {
  opacity: 0.72;
  text-decoration: none;
  transition: opacity 0.15s ease;
}

.nav__links a:hover,
.nav__links a:focus-visible {
  opacity: 1;
}

.nav__actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav__toggle {
  display: none;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: #fff;
  cursor: pointer;
}

.nav__toggle svg {
  width: 18px;
  height: 18px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1.5px solid transparent;
  border-radius: 999px;
  cursor: pointer;
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 600;
  padding: 13px 24px;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease, color 0.15s ease;
}

.btn--primary {
  background: var(--pulse);
  color: #fff;
  box-shadow: 0 10px 24px -10px rgba(238, 123, 79, 0.65);
}

.btn--primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 28px -10px rgba(238, 123, 79, 0.75);
}

.btn--ghost {
  border-color: rgba(255, 255, 255, 0.45);
  background: transparent;
  color: #fff;
}

.btn--ghost:hover {
  background: rgba(255, 255, 255, 0.08);
}

.btn--sm {
  padding: 9px 18px;
  font-size: 0.85rem;
}

.btn--lg {
  padding: 16px 34px;
  font-size: 1.05rem;
}

.btn:focus-visible {
  outline: 3px solid var(--leaf);
  outline-offset: 2px;
}

.eyebrow {
  margin: 0 0 14px;
  color: var(--leaf);
  font-family: var(--font-mono);
  font-size: 0.76rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.eyebrow--light,
.eyebrow--dark {
  color: var(--pulse);
}

.section-title {
  margin: 0 0 16px;
  font-family: var(--font-display);
  font-size: clamp(1.7rem, 3.2vw, 2.5rem);
  font-weight: 700;
  letter-spacing: 0;
}

.section-sub {
  max-width: 620px;
  margin: 0 0 40px;
  color: rgba(20, 36, 31, 0.68);
  font-size: 1.04rem;
}

.hero {
  position: relative;
  overflow: hidden;
  background: var(--forest);
  color: #fff;
  padding: 104px 0 88px;
}

.hero__ecg {
  position: absolute;
  inset: 0;
  opacity: 0.32;
  pointer-events: none;
}

.hero__ecg svg {
  width: 100%;
  height: 100%;
}

.ecg-group {
  animation: ecg-scroll 7s linear infinite;
}

.ecg-path {
  fill: none;
  stroke: var(--pulse);
  stroke-width: 2;
}

@keyframes ecg-scroll {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-200px);
  }
}

.hero__inner {
  position: relative;
  z-index: 1;
  display: grid;
  align-items: center;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 52px;
}

.hero__title {
  margin: 0 0 20px;
  font-family: var(--font-display);
  font-size: clamp(2.3rem, 5.6vw, 3.8rem);
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1.06;
}

.hero__sub {
  max-width: 480px;
  margin: 0 0 32px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 1.08rem;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 30px;
}

.hero__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 0;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  list-style: none;
  text-transform: uppercase;
}

.hero__chips li {
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 999px;
  color: rgba(255, 255, 255, 0.85);
  padding: 7px 14px;
}

.hero__mock {
  overflow: hidden;
  border-radius: 20px;
  background: var(--paper);
  color: var(--ink);
  box-shadow: 0 36px 70px -24px rgba(0, 0, 0, 0.45);
}

.mock__bar {
  display: flex;
  align-items: center;
  gap: 7px;
  border-bottom: 1px solid var(--line);
  padding: 14px 16px;
}

.mock__dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--line);
}

.mock__url {
  margin-left: 10px;
  color: rgba(20, 36, 31, 0.5);
  font-family: var(--font-mono);
  font-size: 0.76rem;
}

.mock__body {
  padding: 26px 18px;
}

.mock__stats {
  display: flex;
  gap: 0;
  margin-bottom: 22px;
}

.mock__stat {
  flex: 1;
  border-right: 1px solid var(--line);
  padding: 0 6px;
  text-align: center;
}

.mock__stat:last-child {
  border-right: none;
}

.mock__num {
  display: block;
  font-family: var(--font-display);
  font-size: 1.55rem;
  font-weight: 700;
}

.mock__label {
  color: rgba(20, 36, 31, 0.5);
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.mock__rows {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mock__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 10px 12px;
}

.mock__row span:first-child {
  font-size: 0.85rem;
  font-weight: 600;
}

.journey,
.roles {
  background: var(--paper);
  padding: 88px 0;
}

.journey__steps {
  display: flex;
  align-items: stretch;
  gap: 0;
  margin: 0 -24px;
  overflow-x: auto;
  padding: 6px 24px 14px;
  scroll-snap-type: x mandatory;
}

.journey__step {
  display: flex;
  flex: 0 0 192px;
  flex-direction: column;
  gap: 12px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: #fff;
  padding: 20px;
  scroll-snap-align: start;
}

.journey__dept {
  color: rgba(20, 36, 31, 0.45);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.journey__step h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.02rem;
  line-height: 1.3;
}

.journey__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;
}

.journey__arrow {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 36px;
  color: var(--line);
  font-family: var(--font-mono);
  font-size: 1.3rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 0.66rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  padding: 4px 10px;
  text-transform: uppercase;
}

.badge--success {
  background: #e3f1ea;
  color: #2f7a52;
}

.badge--warning {
  background: #fcefd8;
  color: #b8782a;
}

.badge--info {
  background: #e5eef8;
  color: #3e6b97;
}

.badge--neutral {
  background: #eef0ee;
  color: #6b7670;
}

.features {
  background: var(--sage);
  padding: 88px 0;
}

.features__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.feature {
  border: 1px solid var(--line);
  border-radius: 16px;
  background: #fff;
  padding: 24px;
}

.feature__icon {
  display: flex;
  width: 42px;
  height: 42px;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  border-radius: 11px;
  background: var(--sage);
  color: var(--leaf);
}

.feature__icon :deep(svg) {
  width: 22px;
  height: 22px;
}

.feature h3 {
  margin: 0 0 8px;
  font-family: var(--font-display);
  font-size: 1.04rem;
}

.feature p {
  margin: 0;
  color: rgba(20, 36, 31, 0.68);
  font-size: 0.92rem;
}

.roles__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.role {
  border: 1px dashed var(--line);
  border-radius: 14px;
  padding: 18px;
}

.role h3 {
  margin: 0 0 8px;
  color: var(--leaf);
  font-family: var(--font-mono);
  font-size: 0.82rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.role p {
  margin: 0;
  color: rgba(20, 36, 31, 0.7);
  font-size: 0.92rem;
}

.why {
  background: var(--forest-deep);
  color: #fff;
  padding: 88px 0;
}

.why .section-sub {
  color: rgba(255, 255, 255, 0.7);
}

.why__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
  margin-top: 8px;
}

.why__item {
  border-top: 2px solid var(--pulse);
  padding-top: 18px;
}

.why__icon {
  width: 34px;
  height: 34px;
  margin-bottom: 14px;
  color: var(--pulse);
}

.why__icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.why__item h3 {
  margin: 0 0 8px;
  font-family: var(--font-display);
  font-size: 1.08rem;
}

.why__item p {
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.95rem;
}

.cta-final {
  background: var(--pulse);
  color: #fff;
  padding: 96px 0;
  text-align: center;
}

.cta-final h2 {
  margin: 0 0 16px;
  font-family: var(--font-display);
  font-size: clamp(1.7rem, 4vw, 2.5rem);
  font-weight: 700;
}

.cta-final p {
  max-width: 560px;
  margin: 0 auto 32px;
  color: rgba(255, 255, 255, 0.92);
  font-size: 1.04rem;
}

.cta-final .btn--primary {
  background: #fff;
  color: var(--pulse);
  box-shadow: 0 10px 24px -10px rgba(0, 0, 0, 0.25);
}

.cta-final__note {
  margin-top: 18px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.85rem;
}

.footer {
  background: var(--ink);
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  padding: 44px 0;
}

.footer__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.footer__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
  font-family: var(--font-display);
  font-weight: 700;
  text-decoration: none;
}

.footer__mark {
  width: 24px;
  height: 24px;
  border-radius: 7px;
  object-fit: cover;
}

.footer__links {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.footer__links a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
}

.footer__links a:hover {
  color: #fff;
}

.footer__fine {
  width: 100%;
  margin-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.8rem;
  padding-top: 18px;
}

.reveal {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.55s ease, transform 0.55s ease;
}

.reveal.is-visible {
  opacity: 1;
  transform: none;
}

@media (max-width: 980px) {
  .features__grid,
  .roles__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 880px) {
  .hero {
    padding: 80px 0 64px;
  }

  .hero__inner {
    grid-template-columns: 1fr;
    gap: 36px;
  }
}

@media (max-width: 860px) {
  .nav__links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    display: none;
    flex-direction: column;
    gap: 14px;
    border-bottom: 1px solid var(--line);
    background: var(--paper);
    padding: 18px 24px 22px;
  }

  .nav__links.is-open {
    display: flex;
  }

  .nav__toggle {
    display: inline-flex;
  }
}

@media (max-width: 760px) {
  .why__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .journey__step {
    flex-basis: 170px;
  }
}

@media (max-width: 560px) {
  .features__grid,
  .roles__grid {
    grid-template-columns: 1fr;
  }

  .nav__actions .btn {
    display: none;
  }

  .mock__row {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (prefers-reduced-motion: reduce) {
  .landing-page {
    scroll-behavior: auto;
  }

  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .ecg-group {
    animation: none;
  }
}
</style>

globalThis.__timing__.logStart('Load chunks/build/auth-CE8hgz-a');import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';
import 'vue-router';
import 'framesync';
import 'popmotion';
import 'style-value-types';

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background text-foreground" }, _attrs))}><main class="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]"><section class="relative hidden overflow-hidden bg-sidebar p-10 text-sidebar-foreground lg:flex lg:flex-col lg:justify-between"><div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(45,212,191,0.26),transparent_30rem)]" aria-hidden="true"></div><div class="relative z-10 flex items-center gap-3"><div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-primary/20"><span class="text-lg font-black">C</span></div><div><p class="text-lg font-bold">ClinicMS</p><p class="text-sm text-sidebar-foreground/65">Warm clinic operations</p></div></div><div class="relative z-10 max-w-xl"><p class="text-sm font-bold uppercase tracking-[0.18em] text-sidebar-primary">Daily flow, softened</p><h1 class="mt-4 text-5xl font-bold leading-tight tracking-normal"> A calmer workspace for busy care teams. </h1><p class="mt-5 text-base leading-7 text-sidebar-foreground/70"> Patient lookup, schedules, labs, imaging, pharmacy, and billing stay close at hand without making the day feel louder than it already is. </p></div><div class="relative z-10 grid grid-cols-3 gap-3"><div class="rounded-2xl border border-sidebar-border bg-sidebar-accent/70 p-4"><p class="text-2xl font-bold">24/7</p><p class="mt-1 text-xs text-sidebar-foreground/60">Care-ready access</p></div><div class="rounded-2xl border border-sidebar-border bg-sidebar-accent/70 p-4"><p class="text-2xl font-bold">FHIR</p><p class="mt-1 text-xs text-sidebar-foreground/60">Record-aware core</p></div><div class="rounded-2xl border border-sidebar-border bg-sidebar-accent/70 p-4"><p class="text-2xl font-bold">PHI</p><p class="mt-1 text-xs text-sidebar-foreground/60">Privacy-first flow</p></div></div></section><section class="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6"><div class="w-full max-w-md"><div class="mb-8 text-center lg:hidden"><div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"><span class="text-lg font-black">C</span></div><p class="text-lg font-bold">ClinicMS</p></div><div class="rounded-3xl border border-border bg-card/90 p-6 shadow-warm backdrop-blur sm:p-8">`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div><footer class="mt-6 text-center text-xs text-muted-foreground"> \xA9 ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} ClinicMS. All rights reserved. </footer></div></section></main></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/auth.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const auth = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { auth as default };;globalThis.__timing__.logEnd('Load chunks/build/auth-CE8hgz-a');
//# sourceMappingURL=auth-CE8hgz-a.mjs.map

globalThis.__timing__.logStart('Load chunks/build/default-BLLq1LpG');import { _ as __nuxt_component_0 } from './nuxt-link-CfPMJNCN.mjs';
import { _ as _sfc_main$2 } from './BaseButton-BkIETyp0.mjs';
import { defineComponent, unref, withCtx, renderSlot, mergeProps, computed, createVNode, resolveDynamicComponent, openBlock, createBlock, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderSlot, ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderVNode } from 'vue/server-renderer';
import { useRoute, useRouter } from 'vue-router';
import { Home, Users, CalendarDays, TestTube2, Image, Pill, CreditCard, FileText, ClipboardList, HeartPulse, Bell, LogOut } from 'lucide-vue-next';
import { u as useAuthStore, g as useTenantStore } from './server.mjs';
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
import 'framesync';
import 'popmotion';
import 'style-value-types';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "AppShell",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const auth = useAuthStore();
    const tenantStore = useTenantStore();
    const tenant = computed(() => {
      var _a2, _b;
      var _a;
      return String((_b = (_a2 = route.params.tenant) != null ? _a2 : (_a = tenantStore.currentTenant) == null ? void 0 : _a.slug) != null ? _b : "default");
    });
    const permissions = computed(() => {
      var _a2;
      var _a;
      return (_a2 = (_a = auth.user) == null ? void 0 : _a.permissions) != null ? _a2 : [];
    });
    const canViewPatients = computed(() => permissions.value.length === 0 || permissions.value.includes("patients.viewAny"));
    const tenantLabel = computed(() => {
      var _a2;
      var _a;
      return (_a2 = (_a = tenantStore.currentTenant) == null ? void 0 : _a.name) != null ? _a2 : `${tenant.value.charAt(0).toUpperCase()}${tenant.value.slice(1)} clinic`;
    });
    const roleLabel = computed(() => {
      var _a2;
      var _a, _b;
      const role = (_b = (_a = auth.user) == null ? void 0 : _a.roles) == null ? void 0 : _b[0];
      const roleName = typeof role === "string" ? role : role && typeof role === "object" && "name" in role && typeof role.name === "string" ? role.name : null;
      return (_a2 = roleName == null ? void 0 : roleName.replace(/_/g, " ")) != null ? _a2 : "Staff workspace";
    });
    const initials = computed(() => {
      var _a2;
      var _a;
      const name = (_a2 = (_a = auth.user) == null ? void 0 : _a.name) != null ? _a2 : "Clinic User";
      return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
    });
    const navItems = computed(() => [
      { label: "Dashboard", to: `/${tenant.value}/dashboard`, icon: Home },
      { label: "Patients", to: `/${tenant.value}/patients`, icon: Users, visible: canViewPatients.value },
      { label: "Appointments", to: `/${tenant.value}/appointments`, icon: CalendarDays },
      { label: "Lab", to: `/${tenant.value}/lab`, icon: TestTube2 },
      { label: "Imaging", to: `/${tenant.value}/imaging`, icon: Image },
      { label: "Pharmacy", to: `/${tenant.value}/pharmacy`, icon: Pill },
      { label: "Billing", to: `/${tenant.value}/billing`, icon: CreditCard },
      { label: "Records", to: `/${tenant.value}/records`, icon: FileText },
      { label: "Reports", to: `/${tenant.value}/reports`, icon: ClipboardList }
    ].filter((item) => item.visible !== false));
    const mobileNavItems = computed(() => {
      const preferred = ["Dashboard", "Patients", "Appointments", "Billing"];
      const primary = navItems.value.filter((item) => preferred.includes(item.label));
      const reports = navItems.value.find((item) => item.label === "Reports");
      return reports ? [...primary, reports] : primary.slice(0, 5);
    });
    const currentSection = computed(() => {
      var _a;
      const item = navItems.value.find((navItem) => isActive(navItem.to));
      return (_a = item == null ? void 0 : item.label) != null ? _a : "Clinic workspace";
    });
    function isActive(path) {
      return route.path === path || route.path.startsWith(`${path}/`);
    }
    function signOut() {
      auth.clearAuth();
      tenantStore.clearTenant();
      router.push("/login");
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a2;
      var _a;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_BaseButton = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background text-foreground" }, _attrs))}><div class="flex min-h-screen"><aside class="hidden w-72 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex lg:flex-col"><div class="px-5 py-5"><div class="flex items-center gap-3"><div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-primary/20">`);
      _push(ssrRenderComponent(unref(HeartPulse), {
        class: "h-5 w-5",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`</div><div><p class="text-base font-bold">ClinicMS</p><p class="text-xs text-sidebar-foreground/60">${ssrInterpolate(tenantLabel.value)}</p></div></div></div><nav class="flex-1 space-y-1 px-3" aria-label="Clinic navigation"><!--[-->`);
      ssrRenderList(navItems.value, (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.to,
          to: item.to,
          class: ["group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-sidebar-foreground/70 transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-primary motion-reduce:transition-none", { "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm shadow-primary/20 hover:bg-sidebar-primary hover:text-sidebar-primary-foreground": isActive(item.to) }]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(item.icon), {
                class: "h-4 w-4 shrink-0",
                "aria-hidden": "true"
              }, null), _parent2, _scopeId);
              _push2(` ${ssrInterpolate(item.label)}`);
            } else {
              return [
                (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                  class: "h-4 w-4 shrink-0",
                  "aria-hidden": "true"
                })),
                createTextVNode(" " + toDisplayString(item.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav><div class="border-t border-sidebar-border p-4"><div class="rounded-2xl bg-sidebar-accent p-4"><p class="text-sm font-bold">Daily flow</p><p class="mt-1 text-xs leading-5 text-sidebar-foreground/65">Patients, appointments, labs, billing, and handoffs in one calm workspace.</p></div></div></aside><div class="flex min-w-0 flex-1 flex-col pb-20 lg:pb-0"><header class="sticky top-0 z-40 border-b border-border/80 bg-background/85 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8"><div class="flex items-center justify-between gap-3"><div class="min-w-0"><p class="text-xs font-bold uppercase tracking-[0.18em] text-primary">${ssrInterpolate(tenantLabel.value)}</p>`);
      ssrRenderSlot(_ctx.$slots, "header", {}, () => {
        _push(`<p class="truncate text-lg font-bold text-foreground">${ssrInterpolate(currentSection.value)}</p>`);
      }, _push, _parent);
      _push(`</div><div class="flex items-center gap-2">`);
      ssrRenderSlot(_ctx.$slots, "actions", {}, null, _push, _parent);
      _push(ssrRenderComponent(_component_BaseButton, {
        variant: "ghost",
        size: "icon",
        icon: unref(Bell),
        "aria-label": "Notifications"
      }, null, _parent));
      _push(`<button class="flex items-center gap-2 rounded-xl border border-border bg-card px-2.5 py-2 text-left shadow-sm transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"><span class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">${ssrInterpolate(initials.value)}</span><span class="hidden min-w-0 sm:block"><span class="block truncate text-sm font-bold">${ssrInterpolate((_a2 = (_a = unref(auth).user) == null ? void 0 : _a.name) != null ? _a2 : "Clinic user")}</span><span class="block truncate text-xs text-muted-foreground">${ssrInterpolate(roleLabel.value)}</span></span></button>`);
      _push(ssrRenderComponent(_component_BaseButton, {
        variant: "ghost",
        size: "icon",
        icon: unref(LogOut),
        "aria-label": "Sign out",
        onClick: signOut
      }, null, _parent));
      _push(`</div></div></header><main class="flex-1 px-4 py-6 sm:px-6 lg:px-8"><div class="mx-auto w-full max-w-7xl">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></main></div></div><nav class="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-2 py-2 shadow-[0_-12px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:hidden" aria-label="Mobile clinic navigation"><div class="grid grid-cols-5 gap-1"><!--[-->`);
      ssrRenderList(mobileNavItems.value, (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.to,
          to: item.to,
          class: ["flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-semibold text-muted-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none", { "bg-primary/10 text-primary": isActive(item.to) }]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(item.icon), {
                class: "h-5 w-5",
                "aria-hidden": "true"
              }, null), _parent2, _scopeId);
              _push2(`<span class="max-w-full truncate"${_scopeId}>${ssrInterpolate(item.label)}</span>`);
            } else {
              return [
                (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                  class: "h-5 w-5",
                  "aria-hidden": "true"
                })),
                createVNode("span", { class: "max-w-full truncate" }, toDisplayString(item.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></nav></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppShell.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const auth = useAuthStore();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AppShell = _sfc_main$1;
      if (unref(auth).token) {
        _push(ssrRenderComponent(_component_AppShell, _attrs, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "header", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "header")
              ];
            }
          }),
          actions: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "actions", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "actions")
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "default")
              ];
            }
          }),
          _: 3
        }, _parent));
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background text-foreground" }, _attrs))}>`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };;globalThis.__timing__.logEnd('Load chunks/build/default-BLLq1LpG');
//# sourceMappingURL=default-BLLq1LpG.mjs.map

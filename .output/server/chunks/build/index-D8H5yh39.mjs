globalThis.__timing__.logStart('Load chunks/build/index-D8H5yh39');import { u as useApi, _ as _sfc_main$1 } from './useApi-BqLSQQg_.mjs';
import { _ as _sfc_main$2 } from './BaseButton-BkIETyp0.mjs';
import { _ as _sfc_main$3 } from './MetricCard-D2TSdre9.mjs';
import { _ as _sfc_main$4 } from './StatusBadge-CKDkR-Tg.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, unref, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { RefreshCw, Users, CalendarDays, Stethoscope, CreditCard } from 'lucide-vue-next';
import { useRoute } from 'vue-router';
import './server.mjs';
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
import './nuxt-link-CfPMJNCN.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const stats = ref({ patients: 0, appointments: 0, encounters: 0 });
    const loading = ref(false);
    const error = ref(null);
    const api = useApi();
    const route = useRoute();
    const flowItems = computed(() => [
      { label: "Waiting room", value: stats.value.appointments, helper: "Appointments to coordinate" },
      { label: "Clinical activity", value: stats.value.encounters, helper: "Encounters in the record" },
      { label: "Patient base", value: stats.value.patients, helper: "People in care" }
    ]);
    async function fetchStats() {
      var _a2, _b, _c, _d;
      var _a;
      loading.value = true;
      error.value = null;
      try {
        const res = await api.api(api.tenantPath("/reports"));
        const results = (_a2 = (_a = res.data) == null ? void 0 : _a.results) != null ? _a2 : {};
        if (res.success) {
          stats.value = {
            patients: (_b = results.patients) != null ? _b : 0,
            appointments: (_c = results.appointments) != null ? _c : 0,
            encounters: (_d = results.encounters) != null ? _d : 0
          };
        } else {
          error.value = res.message || "Failed to load stats";
        }
      } catch (e) {
        error.value = e.message || "Failed to load stats";
      } finally {
        loading.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PageHeader = _sfc_main$1;
      const _component_BaseButton = _sfc_main$2;
      const _component_MetricCard = _sfc_main$3;
      const _component_StatusBadge = _sfc_main$4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_PageHeader, {
        eyebrow: "Clinic command",
        title: "Good day, care team",
        description: "A warm operational view of today\u2019s patient flow, appointments, and clinical activity."
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_BaseButton, {
              variant: "outline",
              icon: unref(RefreshCw),
              loading: loading.value,
              onClick: fetchStats
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Refresh `);
                } else {
                  return [
                    createTextVNode(" Refresh ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_BaseButton, {
                variant: "outline",
                icon: unref(RefreshCw),
                loading: loading.value,
                onClick: fetchStats
              }, {
                default: withCtx(() => [
                  createTextVNode(" Refresh ")
                ]),
                _: 1
              }, 8, ["icon", "loading"])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (error.value) {
        _push(`<div class="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">${ssrInterpolate(error.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid grid-cols-1 gap-4 md:grid-cols-3">`);
      _push(ssrRenderComponent(_component_MetricCard, {
        label: "Patients",
        value: stats.value.patients,
        helper: "Registered patient records",
        icon: unref(Users),
        loading: loading.value
      }, null, _parent));
      _push(ssrRenderComponent(_component_MetricCard, {
        label: "Appointments",
        value: stats.value.appointments,
        helper: "Scheduled care moments",
        icon: unref(CalendarDays),
        tone: "success",
        loading: loading.value,
        delay: 80
      }, null, _parent));
      _push(ssrRenderComponent(_component_MetricCard, {
        label: "Encounters",
        value: stats.value.encounters,
        helper: "Clinical visits captured",
        icon: unref(Stethoscope),
        tone: "warning",
        loading: loading.value,
        delay: 160
      }, null, _parent));
      _push(`</div><div class="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]"><section class="rounded-xl border border-border bg-card p-5 shadow-sm"><div class="flex items-center justify-between gap-3"><div><h2 class="text-lg font-bold">Today\u2019s flow</h2><p class="mt-1 text-sm text-muted-foreground">A quick staff handoff view for the front desk and clinical team.</p></div>`);
      _push(ssrRenderComponent(_component_StatusBadge, {
        status: "IN_PROGRESS",
        label: "Live workspace"
      }, null, _parent));
      _push(`</div><div class="mt-5 grid gap-3 sm:grid-cols-3"><!--[-->`);
      ssrRenderList(flowItems.value, (item) => {
        _push(`<div class="rounded-xl border border-border bg-background/70 p-4"><p class="text-sm font-semibold text-muted-foreground">${ssrInterpolate(item.label)}</p><p class="mt-2 text-2xl font-bold">${ssrInterpolate(item.value)}</p><p class="mt-1 text-xs text-muted-foreground">${ssrInterpolate(item.helper)}</p></div>`);
      });
      _push(`<!--]--></div></section><section class="rounded-xl border border-border bg-card p-5 shadow-sm"><h2 class="text-lg font-bold">Quick actions</h2><div class="mt-4 space-y-2">`);
      _push(ssrRenderComponent(_component_BaseButton, {
        to: `/${unref(route).params.tenant}/patients`,
        variant: "outline",
        block: "",
        icon: unref(Users)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Find patient `);
          } else {
            return [
              createTextVNode(" Find patient ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_BaseButton, {
        to: `/${unref(route).params.tenant}/appointments`,
        variant: "outline",
        block: "",
        icon: unref(CalendarDays)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Review appointments `);
          } else {
            return [
              createTextVNode(" Review appointments ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_BaseButton, {
        to: `/${unref(route).params.tenant}/billing`,
        variant: "outline",
        block: "",
        icon: unref(CreditCard)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Open billing `);
          } else {
            return [
              createTextVNode(" Open billing ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[tenant]/dashboard/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };;globalThis.__timing__.logEnd('Load chunks/build/index-D8H5yh39');
//# sourceMappingURL=index-D8H5yh39.mjs.map

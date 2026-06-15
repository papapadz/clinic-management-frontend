globalThis.__timing__.logStart('Load chunks/build/index-B5L7NHlw');import { _ as _sfc_main$1, u as useApi } from './useApi-BqLSQQg_.mjs';
import { _ as _sfc_main$2 } from './BaseButton-BkIETyp0.mjs';
import { _ as _sfc_main$3 } from './SearchToolbar-CBkU1n6Q.mjs';
import { _ as _sfc_main$4 } from './DataTable-Ckf_gyhV.mjs';
import { _ as _sfc_main$5 } from './StatusBadge-CKDkR-Tg.mjs';
import { defineComponent, ref, watch, mergeProps, withCtx, unref, createTextVNode, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { Plus } from 'lucide-vue-next';
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
import './BaseInput-CXB4y4hS.mjs';
import './EmptyState-n5ZY7_uF.mjs';

function useAppointment() {
  const appointments = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const api = useApi();
  async function fetchAppointments(params = {}) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.api(api.tenantPath("/appointments"), { params });
      if (res.success) {
        appointments.value = res.data;
      } else {
        error.value = res.message || "Failed to fetch appointments";
      }
    } catch (e) {
      error.value = e.message || "Failed to fetch appointments";
    } finally {
      loading.value = false;
    }
  }
  async function createAppointment(data) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.api(api.tenantPath("/appointments"), {
        method: "POST",
        body: data
      });
      if (res.success) {
        await fetchAppointments();
      } else {
        error.value = res.message || "Failed to create appointment";
      }
    } catch (e) {
      error.value = e.message || "Failed to create appointment";
    } finally {
      loading.value = false;
    }
  }
  return { appointments, loading, error, fetchAppointments, createAppointment };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const search = ref("");
    const showCreate = ref(false);
    const { appointments, loading, error, fetchAppointments } = useAppointment();
    const route = useRoute();
    const columns = [
      { key: "appointment_date", label: "Date" },
      { key: "time_slot", label: "Time" },
      { key: "patient", label: "Patient" },
      { key: "clinician", label: "Clinician" },
      { key: "appointment_type", label: "Type" },
      { key: "status", label: "Status" },
      { key: "actions", label: "Actions" }
    ];
    watch(search, (val) => {
      fetchAppointments(val ? { search: val } : {});
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PageHeader = _sfc_main$1;
      const _component_BaseButton = _sfc_main$2;
      const _component_SearchToolbar = _sfc_main$3;
      const _component_DataTable = _sfc_main$4;
      const _component_StatusBadge = _sfc_main$5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_PageHeader, {
        eyebrow: "Schedule",
        title: "Appointments",
        description: "Coordinate check-ins, clinicians, visit types, and appointment status from one clear list."
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_BaseButton, {
              icon: unref(Plus),
              onClick: ($event) => showCreate.value = true
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Add appointment`);
                } else {
                  return [
                    createTextVNode("Add appointment")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_BaseButton, {
                icon: unref(Plus),
                onClick: ($event) => showCreate.value = true
              }, {
                default: withCtx(() => [
                  createTextVNode("Add appointment")
                ]),
                _: 1
              }, 8, ["icon", "onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(error)) {
        _push(`<div class="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_SearchToolbar, {
        modelValue: search.value,
        "onUpdate:modelValue": ($event) => search.value = $event,
        placeholder: "Search appointments...",
        label: "Search appointments"
      }, null, _parent));
      _push(ssrRenderComponent(_component_DataTable, {
        columns,
        rows: unref(appointments),
        loading: unref(loading),
        "empty-title": "No appointments found",
        "empty-description": "Scheduled appointments will appear here."
      }, {
        "cell-patient": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(`<span class="font-semibold"${_scopeId}>${ssrInterpolate(((_a = row.patient) == null ? void 0 : _a.full_name) || row.patient_id)}</span>`);
          } else {
            return [
              createVNode("span", { class: "font-semibold" }, toDisplayString(((_b = row.patient) == null ? void 0 : _b.full_name) || row.patient_id), 1)
            ];
          }
        }),
        "cell-clinician": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(`<span class="text-muted-foreground"${_scopeId}>${ssrInterpolate(((_a = row.clinician) == null ? void 0 : _a.name) || row.clinician_id)}</span>`);
          } else {
            return [
              createVNode("span", { class: "text-muted-foreground" }, toDisplayString(((_b = row.clinician) == null ? void 0 : _b.name) || row.clinician_id), 1)
            ];
          }
        }),
        "cell-status": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_StatusBadge, {
              status: row.status
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_StatusBadge, {
                status: row.status
              }, null, 8, ["status"])
            ];
          }
        }),
        "cell-actions": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_BaseButton, {
              to: `/${unref(route).params.tenant}/appointments/${row.id}`,
              variant: "outline",
              size: "sm"
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` View `);
                } else {
                  return [
                    createTextVNode(" View ")
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_BaseButton, {
                to: `/${unref(route).params.tenant}/appointments/${row.id}`,
                variant: "outline",
                size: "sm"
              }, {
                default: withCtx(() => [
                  createTextVNode(" View ")
                ]),
                _: 1
              }, 8, ["to"])
            ];
          }
        }),
        "mobile-card": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d;
          if (_push2) {
            _push2(`<div class="flex items-start justify-between gap-3"${_scopeId}><div${_scopeId}><p class="font-bold"${_scopeId}>${ssrInterpolate(((_a = row.patient) == null ? void 0 : _a.full_name) || row.patient_id)}</p><p class="mt-1 text-xs text-muted-foreground"${_scopeId}>${ssrInterpolate(row.appointment_date)} at ${ssrInterpolate(row.time_slot)}</p></div>`);
            _push2(ssrRenderComponent(_component_StatusBadge, {
              status: row.status
            }, null, _parent2, _scopeId));
            _push2(`</div><p class="text-sm text-muted-foreground"${_scopeId}>${ssrInterpolate(row.appointment_type)} with ${ssrInterpolate(((_b = row.clinician) == null ? void 0 : _b.name) || row.clinician_id)}</p>`);
            _push2(ssrRenderComponent(_component_BaseButton, {
              to: `/${unref(route).params.tenant}/appointments/${row.id}`,
              variant: "outline",
              size: "sm"
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` View appointment `);
                } else {
                  return [
                    createTextVNode(" View appointment ")
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                createVNode("div", null, [
                  createVNode("p", { class: "font-bold" }, toDisplayString(((_c = row.patient) == null ? void 0 : _c.full_name) || row.patient_id), 1),
                  createVNode("p", { class: "mt-1 text-xs text-muted-foreground" }, toDisplayString(row.appointment_date) + " at " + toDisplayString(row.time_slot), 1)
                ]),
                createVNode(_component_StatusBadge, {
                  status: row.status
                }, null, 8, ["status"])
              ]),
              createVNode("p", { class: "text-sm text-muted-foreground" }, toDisplayString(row.appointment_type) + " with " + toDisplayString(((_d = row.clinician) == null ? void 0 : _d.name) || row.clinician_id), 1),
              createVNode(_component_BaseButton, {
                to: `/${unref(route).params.tenant}/appointments/${row.id}`,
                variant: "outline",
                size: "sm"
              }, {
                default: withCtx(() => [
                  createTextVNode(" View appointment ")
                ]),
                _: 1
              }, 8, ["to"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[tenant]/appointments/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };;globalThis.__timing__.logEnd('Load chunks/build/index-B5L7NHlw');
//# sourceMappingURL=index-B5L7NHlw.mjs.map

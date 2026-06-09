globalThis.__timing__.logStart('Load chunks/build/index-5J89rG2r');import { _ as _sfc_main$1, u as useApi } from './useApi-BqLSQQg_.mjs';
import { _ as _sfc_main$2 } from './SearchToolbar-CBkU1n6Q.mjs';
import { _ as _sfc_main$3 } from './DataTable-Ckf_gyhV.mjs';
import { _ as _sfc_main$4 } from './StatusBadge-CKDkR-Tg.mjs';
import { _ as _sfc_main$5 } from './BaseButton-BkIETyp0.mjs';
import { defineComponent, ref, watch, mergeProps, unref, withCtx, createVNode, toDisplayString, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
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
import './BaseInput-CXB4y4hS.mjs';
import 'lucide-vue-next';
import './EmptyState-n5ZY7_uF.mjs';
import './nuxt-link-CfPMJNCN.mjs';

function useLab() {
  const requests = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const api = useApi();
  async function fetchRequests(params = {}) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.api(api.tenantPath("/lab/requests"), { params });
      if (res.success) {
        requests.value = res.data;
      } else {
        error.value = res.message || "Failed to fetch lab requests";
      }
    } catch (e) {
      error.value = e.message || "Failed to fetch lab requests";
    } finally {
      loading.value = false;
    }
  }
  return { requests, loading, error, fetchRequests };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const search = ref("");
    const { requests, loading, error, fetchRequests } = useLab();
    const route = useRoute();
    const columns = [
      { key: "created_at", label: "Date" },
      { key: "patient", label: "Patient" },
      { key: "tests", label: "Tests" },
      { key: "priority", label: "Priority" },
      { key: "status", label: "Status" },
      { key: "actions", label: "Actions" }
    ];
    function panelNames(panels = []) {
      return panels.map((panel) => panel.name).join(", ") || "-";
    }
    watch(search, (val) => {
      fetchRequests(val ? { search: val } : {});
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PageHeader = _sfc_main$1;
      const _component_SearchToolbar = _sfc_main$2;
      const _component_DataTable = _sfc_main$3;
      const _component_StatusBadge = _sfc_main$4;
      const _component_BaseButton = _sfc_main$5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_PageHeader, {
        eyebrow: "Diagnostics",
        title: "Lab requests",
        description: "Track specimen flow, priorities, and result release status."
      }, null, _parent));
      if (unref(error)) {
        _push(`<div class="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_SearchToolbar, {
        modelValue: search.value,
        "onUpdate:modelValue": ($event) => search.value = $event,
        placeholder: "Search lab...",
        label: "Search lab requests"
      }, null, _parent));
      _push(ssrRenderComponent(_component_DataTable, {
        columns,
        rows: unref(requests),
        loading: unref(loading),
        "empty-title": "No lab requests found",
        "empty-description": "Lab requests will appear here after they are ordered."
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
        "cell-tests": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-muted-foreground"${_scopeId}>${ssrInterpolate(panelNames(row.test_panels))}</span>`);
          } else {
            return [
              createVNode("span", { class: "text-muted-foreground" }, toDisplayString(panelNames(row.test_panels)), 1)
            ];
          }
        }),
        "cell-priority": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_StatusBadge, {
              status: row.priority
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_StatusBadge, {
                status: row.priority
              }, null, 8, ["status"])
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
              to: `/${unref(route).params.tenant}/lab/${row.id}`,
              variant: "outline",
              size: "sm"
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`View`);
                } else {
                  return [
                    createTextVNode("View")
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_BaseButton, {
                to: `/${unref(route).params.tenant}/lab/${row.id}`,
                variant: "outline",
                size: "sm"
              }, {
                default: withCtx(() => [
                  createTextVNode("View")
                ]),
                _: 1
              }, 8, ["to"])
            ];
          }
        }),
        "mobile-card": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(`<div class="flex items-start justify-between gap-3"${_scopeId}><div${_scopeId}><p class="font-bold"${_scopeId}>${ssrInterpolate(((_a = row.patient) == null ? void 0 : _a.full_name) || row.patient_id)}</p><p class="mt-1 text-xs text-muted-foreground"${_scopeId}>${ssrInterpolate(row.created_at)}</p></div>`);
            _push2(ssrRenderComponent(_component_StatusBadge, {
              status: row.priority
            }, null, _parent2, _scopeId));
            _push2(`</div><p class="text-sm text-muted-foreground"${_scopeId}>${ssrInterpolate(panelNames(row.test_panels))}</p>`);
            _push2(ssrRenderComponent(_component_StatusBadge, {
              status: row.status
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                createVNode("div", null, [
                  createVNode("p", { class: "font-bold" }, toDisplayString(((_b = row.patient) == null ? void 0 : _b.full_name) || row.patient_id), 1),
                  createVNode("p", { class: "mt-1 text-xs text-muted-foreground" }, toDisplayString(row.created_at), 1)
                ]),
                createVNode(_component_StatusBadge, {
                  status: row.priority
                }, null, 8, ["status"])
              ]),
              createVNode("p", { class: "text-sm text-muted-foreground" }, toDisplayString(panelNames(row.test_panels)), 1),
              createVNode(_component_StatusBadge, {
                status: row.status
              }, null, 8, ["status"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[tenant]/lab/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };;globalThis.__timing__.logEnd('Load chunks/build/index-5J89rG2r');
//# sourceMappingURL=index-5J89rG2r.mjs.map

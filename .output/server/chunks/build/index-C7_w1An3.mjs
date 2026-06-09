globalThis.__timing__.logStart('Load chunks/build/index-C7_w1An3');import { _ as _sfc_main$1, u as useApi } from './useApi-BqLSQQg_.mjs';
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

function usePharmacy() {
  const transactions = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const api = useApi();
  async function fetchTransactions(params = {}) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.api(api.tenantPath("/pharmacy/transactions"), { params });
      if (res.success) {
        transactions.value = res.data;
      } else {
        error.value = res.message || "Failed to fetch pharmacy transactions";
      }
    } catch (e) {
      error.value = e.message || "Failed to fetch pharmacy transactions";
    } finally {
      loading.value = false;
    }
  }
  return { transactions, loading, error, fetchTransactions };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const search = ref("");
    const { transactions, loading, error, fetchTransactions } = usePharmacy();
    const route = useRoute();
    const columns = [
      { key: "transaction_date", label: "Date" },
      { key: "transaction_type", label: "Type" },
      { key: "patient", label: "Patient" },
      { key: "items", label: "Items" },
      { key: "total_amount", label: "Amount", align: "right" },
      { key: "actions", label: "Actions" }
    ];
    function itemSummary(items = []) {
      return items.map((item) => {
        var _a, _b;
        return `${((_a = item.item) == null ? void 0 : _a.brand_name) || ((_b = item.item) == null ? void 0 : _b.generic_name) || item.item_id} x ${item.quantity}`;
      }).join(", ") || "-";
    }
    function formatMoney(value) {
      return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(value);
    }
    watch(search, (val) => {
      fetchTransactions(val ? { search: val } : {});
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PageHeader = _sfc_main$1;
      const _component_SearchToolbar = _sfc_main$2;
      const _component_DataTable = _sfc_main$3;
      const _component_StatusBadge = _sfc_main$4;
      const _component_BaseButton = _sfc_main$5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_PageHeader, {
        eyebrow: "Dispensing",
        title: "Pharmacy transactions",
        description: "Review dispensing, returns, restocks, adjustments, and waste transactions."
      }, null, _parent));
      if (unref(error)) {
        _push(`<div class="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_SearchToolbar, {
        modelValue: search.value,
        "onUpdate:modelValue": ($event) => search.value = $event,
        placeholder: "Search pharmacy...",
        label: "Search pharmacy transactions"
      }, null, _parent));
      _push(ssrRenderComponent(_component_DataTable, {
        columns,
        rows: unref(transactions),
        loading: unref(loading),
        "empty-title": "No pharmacy transactions found",
        "empty-description": "Pharmacy activity will appear here."
      }, {
        "cell-transaction_type": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_StatusBadge, {
              status: row.transaction_type
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_StatusBadge, {
                status: row.transaction_type
              }, null, 8, ["status"])
            ];
          }
        }),
        "cell-patient": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(`<span class="font-semibold"${_scopeId}>${ssrInterpolate(((_a = row.patient) == null ? void 0 : _a.full_name) || row.patient_id || "-")}</span>`);
          } else {
            return [
              createVNode("span", { class: "font-semibold" }, toDisplayString(((_b = row.patient) == null ? void 0 : _b.full_name) || row.patient_id || "-"), 1)
            ];
          }
        }),
        "cell-items": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-muted-foreground"${_scopeId}>${ssrInterpolate(itemSummary(row.items))}</span>`);
          } else {
            return [
              createVNode("span", { class: "text-muted-foreground" }, toDisplayString(itemSummary(row.items)), 1)
            ];
          }
        }),
        "cell-total_amount": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="font-semibold"${_scopeId}>${ssrInterpolate(formatMoney(row.total_amount))}</span>`);
          } else {
            return [
              createVNode("span", { class: "font-semibold" }, toDisplayString(formatMoney(row.total_amount)), 1)
            ];
          }
        }),
        "cell-actions": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_BaseButton, {
              to: `/${unref(route).params.tenant}/pharmacy/${row.id}`,
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
                to: `/${unref(route).params.tenant}/pharmacy/${row.id}`,
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
            _push2(`<div class="flex items-start justify-between gap-3"${_scopeId}><div${_scopeId}><p class="font-bold"${_scopeId}>${ssrInterpolate(((_a = row.patient) == null ? void 0 : _a.full_name) || row.patient_id || "Inventory transaction")}</p><p class="mt-1 text-xs text-muted-foreground"${_scopeId}>${ssrInterpolate(row.transaction_date)}</p></div>`);
            _push2(ssrRenderComponent(_component_StatusBadge, {
              status: row.transaction_type
            }, null, _parent2, _scopeId));
            _push2(`</div><p class="text-sm text-muted-foreground"${_scopeId}>${ssrInterpolate(itemSummary(row.items))}</p><p class="text-sm font-bold"${_scopeId}>${ssrInterpolate(formatMoney(row.total_amount))}</p>`);
          } else {
            return [
              createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                createVNode("div", null, [
                  createVNode("p", { class: "font-bold" }, toDisplayString(((_b = row.patient) == null ? void 0 : _b.full_name) || row.patient_id || "Inventory transaction"), 1),
                  createVNode("p", { class: "mt-1 text-xs text-muted-foreground" }, toDisplayString(row.transaction_date), 1)
                ]),
                createVNode(_component_StatusBadge, {
                  status: row.transaction_type
                }, null, 8, ["status"])
              ]),
              createVNode("p", { class: "text-sm text-muted-foreground" }, toDisplayString(itemSummary(row.items)), 1),
              createVNode("p", { class: "text-sm font-bold" }, toDisplayString(formatMoney(row.total_amount)), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[tenant]/pharmacy/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };;globalThis.__timing__.logEnd('Load chunks/build/index-C7_w1An3');
//# sourceMappingURL=index-C7_w1An3.mjs.map

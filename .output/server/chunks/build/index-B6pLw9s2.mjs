globalThis.__timing__.logStart('Load chunks/build/index-B6pLw9s2');import { _ as _sfc_main$1, u as useApi } from './useApi-BqLSQQg_.mjs';
import { _ as _sfc_main$2 } from './MetricCard-D2TSdre9.mjs';
import { _ as _sfc_main$3 } from './SearchToolbar-CBkU1n6Q.mjs';
import { _ as _sfc_main$4 } from './DataTable-Ckf_gyhV.mjs';
import { _ as _sfc_main$5 } from './StatusBadge-CKDkR-Tg.mjs';
import { _ as _sfc_main$6 } from './BaseButton-BkIETyp0.mjs';
import { _ as _sfc_main$7 } from './FormField-BBFT5EVR.mjs';
import { _ as _sfc_main$8 } from './BaseInput-CXB4y4hS.mjs';
import { defineComponent, reactive, ref, computed, watch, mergeProps, unref, withCtx, createVNode, toDisplayString, createTextVNode, withDirectives, openBlock, createBlock, Fragment, renderList, vModelSelect, vModelText, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { WalletCards, ReceiptText, CircleDollarSign, Ban, Plus } from 'lucide-vue-next';
import { f as formatCurrency, s as statusLabel, a as formatDateTime } from './format-yZrm7N67.mjs';
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
import 'vue-router';
import 'framesync';
import 'popmotion';
import 'style-value-types';
import './EmptyState-n5ZY7_uF.mjs';
import './nuxt-link-CfPMJNCN.mjs';
import 'date-fns';

function useBilling() {
  const transactions = ref([]);
  const meta = ref(null);
  const loading = ref(false);
  const saving = ref(false);
  const error = ref(null);
  const validationErrors = ref(null);
  const api = useApi();
  async function fetchTransactions(params = {}) {
    var _a;
    loading.value = true;
    error.value = null;
    try {
      const res = await api.api(api.tenantPath("/billing/transactions"), { params });
      if (res.success) {
        transactions.value = res.data;
        meta.value = (_a = res.meta) != null ? _a : null;
      } else {
        error.value = res.message || "Failed to fetch billing transactions";
      }
    } catch (e) {
      error.value = e.message || "Failed to fetch billing transactions";
    } finally {
      loading.value = false;
    }
  }
  async function createTransaction(data) {
    return submit(api.tenantPath("/billing/transactions"), "POST", data);
  }
  async function processTransaction(id) {
    return submit(api.tenantPath(`/billing/${id}/process`), "POST", {});
  }
  async function voidTransaction(id, voidReason) {
    return submit(api.tenantPath(`/billing/${id}/void`), "POST", { void_reason: voidReason });
  }
  async function submit(path, method, body) {
    saving.value = true;
    error.value = null;
    validationErrors.value = null;
    try {
      const res = await api.api(path, { method, body });
      if (!res.success) {
        validationErrors.value = res.errors;
        error.value = res.message || "Billing request failed";
      }
      return res;
    } catch (e) {
      error.value = e.message || "Billing request failed";
      throw e;
    } finally {
      saving.value = false;
    }
  }
  return {
    transactions,
    meta,
    loading,
    saving,
    error,
    validationErrors,
    fetchTransactions,
    createTransaction,
    processTransaction,
    voidTransaction
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const paymentModes = ["CASH", "CARD", "GCASH", "MAYA", "PHILHEALTH", "HMO", "CORPORATE"];
    const billingStatuses = ["PENDING", "PARTIAL", "PAID", "VOIDED", "REFUNDED"];
    const columns = [
      { key: "transaction_number", label: "Transaction" },
      { key: "patient", label: "Patient" },
      { key: "grand_total", label: "Total", align: "right" },
      { key: "balance", label: "Balance", align: "right" },
      { key: "status", label: "Status" },
      { key: "actions", label: "Actions", align: "right" }
    ];
    const { transactions, loading, saving, error, validationErrors, fetchTransactions, processTransaction } = useBilling();
    const filters = reactive({ search: "", status: "" });
    const selectedTransaction = ref(null);
    const voidTarget = ref(null);
    const voidReason = ref("");
    const form = reactive({
      patient_id: "",
      encounter_id: "",
      line_items: [blankLineItem()],
      payment_mode: "CASH",
      amount_paid: 0,
      vat_amount: 0,
      or_number: ""
    });
    const filteredTransactions = computed(() => {
      if (!filters.status) return transactions.value;
      return transactions.value.filter((transaction) => transaction.status === filters.status);
    });
    const summary = computed(() => transactions.value.reduce((totals2, transaction) => {
      var _a, _b;
      if (transaction.status === "PENDING" || transaction.status === "PARTIAL") {
        totals2.pendingBalance += Number((_a = transaction.balance) != null ? _a : 0);
      }
      if (transaction.status === "PAID") {
        totals2.paidRevenue += Number((_b = transaction.grand_total) != null ? _b : 0);
      }
      if (transaction.status === "PARTIAL") totals2.partialCount += 1;
      if (transaction.status === "VOIDED") totals2.voidedCount += 1;
      return totals2;
    }, {
      pendingBalance: 0,
      paidRevenue: 0,
      partialCount: 0,
      voidedCount: 0
    }));
    const totals = computed(() => {
      const subtotal = form.line_items.reduce((sum, item) => sum + toNumber(item.quantity) * toNumber(item.unit_price), 0);
      const discountTotal = form.line_items.reduce((sum, item) => sum + toNumber(item.discount), 0);
      const grandTotal = Math.max(0, subtotal - discountTotal + toNumber(form.vat_amount));
      const amountPaid = toNumber(form.amount_paid);
      return {
        subtotal,
        discountTotal,
        grandTotal,
        balance: Math.max(0, grandTotal - amountPaid),
        changeAmount: Math.max(0, amountPaid - grandTotal)
      };
    });
    watch(() => filters.search, (search) => {
      fetchTransactions(search ? { search } : {});
    });
    function blankLineItem() {
      return { description: "", quantity: 1, unit_price: 0, discount: 0, total: 0 };
    }
    function addLineItem() {
      form.line_items.push(blankLineItem());
    }
    function removeLineItem(index) {
      form.line_items.splice(index, 1);
    }
    function lineTotal(item) {
      return Math.max(0, toNumber(item.quantity) * toNumber(item.unit_price) - toNumber(item.discount));
    }
    async function handleProcess(transaction) {
      selectedTransaction.value = transaction;
      const res = await processTransaction(transaction.id);
      if (res.success) await fetchTransactions();
      selectedTransaction.value = null;
    }
    function selectVoid(transaction) {
      voidTarget.value = transaction;
      voidReason.value = "";
    }
    function resetForm() {
      form.patient_id = "";
      form.encounter_id = "";
      form.line_items = [blankLineItem()];
      form.payment_mode = "CASH";
      form.amount_paid = 0;
      form.vat_amount = 0;
      form.or_number = "";
    }
    function toNumber(value) {
      const parsed = Number(value != null ? value : 0);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_PageHeader = _sfc_main$1;
      const _component_MetricCard = _sfc_main$2;
      const _component_SearchToolbar = _sfc_main$3;
      const _component_DataTable = _sfc_main$4;
      const _component_StatusBadge = _sfc_main$5;
      const _component_BaseButton = _sfc_main$6;
      const _component_FormField = _sfc_main$7;
      const _component_BaseInput = _sfc_main$8;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_PageHeader, {
        eyebrow: "Cashier desk",
        title: "Billing transactions",
        description: "Create bills, process payments, and manage voided cashier transactions."
      }, null, _parent));
      if (unref(error)) {
        _push(`<div class="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">`);
      _push(ssrRenderComponent(_component_MetricCard, {
        label: "Pending balance",
        value: unref(formatCurrency)(summary.value.pendingBalance),
        helper: "Open receivables",
        icon: unref(WalletCards),
        tone: "warning",
        loading: unref(loading)
      }, null, _parent));
      _push(ssrRenderComponent(_component_MetricCard, {
        label: "Paid revenue",
        value: unref(formatCurrency)(summary.value.paidRevenue),
        helper: "Fully paid transactions",
        icon: unref(ReceiptText),
        tone: "success",
        loading: unref(loading)
      }, null, _parent));
      _push(ssrRenderComponent(_component_MetricCard, {
        label: "Partial",
        value: summary.value.partialCount,
        helper: "Partially paid bills",
        icon: unref(CircleDollarSign),
        tone: "primary",
        loading: unref(loading)
      }, null, _parent));
      _push(ssrRenderComponent(_component_MetricCard, {
        label: "Voided",
        value: summary.value.voidedCount,
        helper: "Cancelled bills",
        icon: unref(Ban),
        tone: "danger",
        loading: unref(loading)
      }, null, _parent));
      _push(`</div><section class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]"><div class="space-y-4"><div class="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">`);
      _push(ssrRenderComponent(_component_SearchToolbar, {
        modelValue: filters.search,
        "onUpdate:modelValue": ($event) => filters.search = $event,
        placeholder: "Search billing...",
        label: "Search billing transactions",
        class: "md:min-w-80"
      }, null, _parent));
      _push(`<select class="h-10 rounded-lg border border-input bg-background px-3 text-sm font-semibold text-foreground shadow-sm focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-ring/15"><option value=""${ssrIncludeBooleanAttr(Array.isArray(filters.status) ? ssrLooseContain(filters.status, "") : ssrLooseEqual(filters.status, "")) ? " selected" : ""}>All statuses</option><!--[-->`);
      ssrRenderList(billingStatuses, (status) => {
        _push(`<option${ssrRenderAttr("value", status)}${ssrIncludeBooleanAttr(Array.isArray(filters.status) ? ssrLooseContain(filters.status, status) : ssrLooseEqual(filters.status, status)) ? " selected" : ""}>${ssrInterpolate(unref(statusLabel)(status))}</option>`);
      });
      _push(`<!--]--></select></div>`);
      _push(ssrRenderComponent(_component_DataTable, {
        columns,
        rows: filteredTransactions.value,
        loading: unref(loading),
        "empty-title": "No billing transactions found",
        "empty-description": "Create a bill or adjust your filters to see cashier activity."
      }, {
        "cell-transaction_number": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><p class="font-semibold"${_scopeId}>${ssrInterpolate(row.transaction_number)}</p><p class="text-xs text-muted-foreground"${_scopeId}>${ssrInterpolate(unref(formatDateTime)(row.transaction_date))}</p></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("p", { class: "font-semibold" }, toDisplayString(row.transaction_number), 1),
                createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(unref(formatDateTime)(row.transaction_date)), 1)
              ])
            ];
          }
        }),
        "cell-patient": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          var _a2, _b2;
          if (_push2) {
            _push2(`<span class="font-semibold"${_scopeId}>${ssrInterpolate(((_a2 = row.patient) == null ? void 0 : _a2.full_name) || `Patient #${row.patient_id}`)}</span>`);
          } else {
            return [
              createVNode("span", { class: "font-semibold" }, toDisplayString(((_b2 = row.patient) == null ? void 0 : _b2.full_name) || `Patient #${row.patient_id}`), 1)
            ];
          }
        }),
        "cell-grand_total": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="font-bold"${_scopeId}>${ssrInterpolate(unref(formatCurrency)(Number(row.grand_total)))}</span>`);
          } else {
            return [
              createVNode("span", { class: "font-bold" }, toDisplayString(unref(formatCurrency)(Number(row.grand_total))), 1)
            ];
          }
        }),
        "cell-balance": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="font-semibold"${_scopeId}>${ssrInterpolate(unref(formatCurrency)(Number(row.balance)))}</span>`);
          } else {
            return [
              createVNode("span", { class: "font-semibold" }, toDisplayString(unref(formatCurrency)(Number(row.balance))), 1)
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
          var _a2, _b2;
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_BaseButton, {
              size: "sm",
              variant: "outline",
              disabled: row.status === "PAID" || row.status === "VOIDED",
              loading: unref(saving) && ((_a2 = selectedTransaction.value) == null ? void 0 : _a2.id) === row.id,
              onClick: ($event) => handleProcess(row)
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Process `);
                } else {
                  return [
                    createTextVNode(" Process ")
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_BaseButton, {
              size: "sm",
              variant: "danger",
              disabled: row.status === "VOIDED",
              onClick: ($event) => selectVoid(row)
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Void `);
                } else {
                  return [
                    createTextVNode(" Void ")
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex justify-end gap-2" }, [
                createVNode(_component_BaseButton, {
                  size: "sm",
                  variant: "outline",
                  disabled: row.status === "PAID" || row.status === "VOIDED",
                  loading: unref(saving) && ((_b2 = selectedTransaction.value) == null ? void 0 : _b2.id) === row.id,
                  onClick: ($event) => handleProcess(row)
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Process ")
                  ]),
                  _: 1
                }, 8, ["disabled", "loading", "onClick"]),
                createVNode(_component_BaseButton, {
                  size: "sm",
                  variant: "danger",
                  disabled: row.status === "VOIDED",
                  onClick: ($event) => selectVoid(row)
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Void ")
                  ]),
                  _: 1
                }, 8, ["disabled", "onClick"])
              ])
            ];
          }
        }),
        "mobile-card": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          var _a2, _b2;
          if (_push2) {
            _push2(`<div class="flex items-start justify-between gap-3"${_scopeId}><div${_scopeId}><p class="font-bold"${_scopeId}>${ssrInterpolate(row.transaction_number)}</p><p class="mt-1 text-xs text-muted-foreground"${_scopeId}>${ssrInterpolate(((_a2 = row.patient) == null ? void 0 : _a2.full_name) || `Patient #${row.patient_id}`)}</p></div>`);
            _push2(ssrRenderComponent(_component_StatusBadge, {
              status: row.status
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="grid grid-cols-2 gap-3 text-sm"${_scopeId}><div${_scopeId}><p class="text-xs font-semibold uppercase text-muted-foreground"${_scopeId}>Total</p><p class="font-bold"${_scopeId}>${ssrInterpolate(unref(formatCurrency)(Number(row.grand_total)))}</p></div><div${_scopeId}><p class="text-xs font-semibold uppercase text-muted-foreground"${_scopeId}>Balance</p><p class="font-bold"${_scopeId}>${ssrInterpolate(unref(formatCurrency)(Number(row.balance)))}</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                createVNode("div", null, [
                  createVNode("p", { class: "font-bold" }, toDisplayString(row.transaction_number), 1),
                  createVNode("p", { class: "mt-1 text-xs text-muted-foreground" }, toDisplayString(((_b2 = row.patient) == null ? void 0 : _b2.full_name) || `Patient #${row.patient_id}`), 1)
                ]),
                createVNode(_component_StatusBadge, {
                  status: row.status
                }, null, 8, ["status"])
              ]),
              createVNode("div", { class: "grid grid-cols-2 gap-3 text-sm" }, [
                createVNode("div", null, [
                  createVNode("p", { class: "text-xs font-semibold uppercase text-muted-foreground" }, "Total"),
                  createVNode("p", { class: "font-bold" }, toDisplayString(unref(formatCurrency)(Number(row.grand_total))), 1)
                ]),
                createVNode("div", null, [
                  createVNode("p", { class: "text-xs font-semibold uppercase text-muted-foreground" }, "Balance"),
                  createVNode("p", { class: "font-bold" }, toDisplayString(unref(formatCurrency)(Number(row.balance))), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><aside class="space-y-4"><form class="rounded-xl border border-border bg-card p-4 shadow-sm"><div class="mb-4 flex items-center justify-between gap-3"><div><h2 class="text-base font-bold">Create bill</h2><p class="text-sm text-muted-foreground">Enter cashier line items and payment details.</p></div>`);
      _push(ssrRenderComponent(_component_BaseButton, {
        type: "button",
        variant: "ghost",
        size: "sm",
        onClick: resetForm
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Reset`);
          } else {
            return [
              createTextVNode("Reset")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="space-y-4"><div class="grid gap-3 sm:grid-cols-2">`);
      _push(ssrRenderComponent(_component_FormField, {
        id: "patient_id",
        label: "Patient ID",
        errors: (_a = unref(validationErrors)) == null ? void 0 : _a.patient_id
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b2;
          if (_push2) {
            _push2(ssrRenderComponent(_component_BaseInput, {
              id: "patient_id",
              modelValue: form.patient_id,
              "onUpdate:modelValue": ($event) => form.patient_id = $event,
              "has-error": Boolean((_a2 = unref(validationErrors)) == null ? void 0 : _a2.patient_id)
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_BaseInput, {
                id: "patient_id",
                modelValue: form.patient_id,
                "onUpdate:modelValue": ($event) => form.patient_id = $event,
                "has-error": Boolean((_b2 = unref(validationErrors)) == null ? void 0 : _b2.patient_id)
              }, null, 8, ["modelValue", "onUpdate:modelValue", "has-error"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_FormField, {
        id: "encounter_id",
        label: "Encounter ID",
        errors: (_b = unref(validationErrors)) == null ? void 0 : _b.encounter_id
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b2;
          if (_push2) {
            _push2(ssrRenderComponent(_component_BaseInput, {
              id: "encounter_id",
              modelValue: form.encounter_id,
              "onUpdate:modelValue": ($event) => form.encounter_id = $event,
              "has-error": Boolean((_a2 = unref(validationErrors)) == null ? void 0 : _a2.encounter_id)
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_BaseInput, {
                id: "encounter_id",
                modelValue: form.encounter_id,
                "onUpdate:modelValue": ($event) => form.encounter_id = $event,
                "has-error": Boolean((_b2 = unref(validationErrors)) == null ? void 0 : _b2.encounter_id)
              }, null, 8, ["modelValue", "onUpdate:modelValue", "has-error"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="space-y-3"><div class="flex items-center justify-between"><p class="text-sm font-bold">Line items</p>`);
      _push(ssrRenderComponent(_component_BaseButton, {
        type: "button",
        size: "sm",
        variant: "outline",
        icon: unref(Plus),
        onClick: addLineItem
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Add`);
          } else {
            return [
              createTextVNode("Add")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><!--[-->`);
      ssrRenderList(form.line_items, (item, index) => {
        _push(`<div class="space-y-3 rounded-lg border border-border bg-background/70 p-3">`);
        _push(ssrRenderComponent(_component_FormField, {
          id: `description-${index}`,
          label: "Description"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_BaseInput, {
                id: `description-${index}`,
                modelValue: item.description,
                "onUpdate:modelValue": ($event) => item.description = $event
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_BaseInput, {
                  id: `description-${index}`,
                  modelValue: item.description,
                  "onUpdate:modelValue": ($event) => item.description = $event
                }, null, 8, ["id", "modelValue", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`<div class="grid grid-cols-3 gap-2">`);
        _push(ssrRenderComponent(_component_FormField, {
          id: `quantity-${index}`,
          label: "Qty"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_BaseInput, {
                id: `quantity-${index}`,
                modelValue: item.quantity,
                "onUpdate:modelValue": ($event) => item.quantity = $event,
                type: "number",
                min: "1"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_BaseInput, {
                  id: `quantity-${index}`,
                  modelValue: item.quantity,
                  "onUpdate:modelValue": ($event) => item.quantity = $event,
                  type: "number",
                  min: "1"
                }, null, 8, ["id", "modelValue", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(ssrRenderComponent(_component_FormField, {
          id: `unit-${index}`,
          label: "Price"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_BaseInput, {
                id: `unit-${index}`,
                modelValue: item.unit_price,
                "onUpdate:modelValue": ($event) => item.unit_price = $event,
                type: "number",
                min: "0",
                step: "0.01"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_BaseInput, {
                  id: `unit-${index}`,
                  modelValue: item.unit_price,
                  "onUpdate:modelValue": ($event) => item.unit_price = $event,
                  type: "number",
                  min: "0",
                  step: "0.01"
                }, null, 8, ["id", "modelValue", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(ssrRenderComponent(_component_FormField, {
          id: `discount-${index}`,
          label: "Discount"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_BaseInput, {
                id: `discount-${index}`,
                modelValue: item.discount,
                "onUpdate:modelValue": ($event) => item.discount = $event,
                type: "number",
                min: "0",
                step: "0.01"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_BaseInput, {
                  id: `discount-${index}`,
                  modelValue: item.discount,
                  "onUpdate:modelValue": ($event) => item.discount = $event,
                  type: "number",
                  min: "0",
                  step: "0.01"
                }, null, 8, ["id", "modelValue", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div><div class="flex items-center justify-between"><p class="text-sm font-bold">${ssrInterpolate(unref(formatCurrency)(lineTotal(item)))}</p>`);
        _push(ssrRenderComponent(_component_BaseButton, {
          type: "button",
          size: "sm",
          variant: "ghost",
          disabled: form.line_items.length === 1,
          onClick: ($event) => removeLineItem(index)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Remove`);
            } else {
              return [
                createTextVNode("Remove")
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div></div>`);
      });
      _push(`<!--]--></div><div class="grid gap-3 sm:grid-cols-2">`);
      _push(ssrRenderComponent(_component_FormField, {
        id: "payment_mode",
        label: "Payment mode"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<select id="payment_mode" class="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"${_scopeId}><!--[-->`);
            ssrRenderList(paymentModes, (mode) => {
              _push2(`<option${ssrRenderAttr("value", mode)}${ssrIncludeBooleanAttr(Array.isArray(form.payment_mode) ? ssrLooseContain(form.payment_mode, mode) : ssrLooseEqual(form.payment_mode, mode)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(mode)}</option>`);
            });
            _push2(`<!--]--></select>`);
          } else {
            return [
              withDirectives(createVNode("select", {
                id: "payment_mode",
                "onUpdate:modelValue": ($event) => form.payment_mode = $event,
                class: "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              }, [
                (openBlock(), createBlock(Fragment, null, renderList(paymentModes, (mode) => {
                  return createVNode("option", {
                    key: mode,
                    value: mode
                  }, toDisplayString(mode), 9, ["value"]);
                }), 64))
              ], 8, ["onUpdate:modelValue"]), [
                [vModelSelect, form.payment_mode]
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_FormField, {
        id: "or_number",
        label: "OR number"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_BaseInput, {
              id: "or_number",
              modelValue: form.or_number,
              "onUpdate:modelValue": ($event) => form.or_number = $event
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_BaseInput, {
                id: "or_number",
                modelValue: form.or_number,
                "onUpdate:modelValue": ($event) => form.or_number = $event
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_FormField, {
        id: "amount_paid",
        label: "Amount paid"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_BaseInput, {
              id: "amount_paid",
              modelValue: form.amount_paid,
              "onUpdate:modelValue": ($event) => form.amount_paid = $event,
              type: "number",
              min: "0",
              step: "0.01"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_BaseInput, {
                id: "amount_paid",
                modelValue: form.amount_paid,
                "onUpdate:modelValue": ($event) => form.amount_paid = $event,
                type: "number",
                min: "0",
                step: "0.01"
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_FormField, {
        id: "vat_amount",
        label: "VAT"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_BaseInput, {
              id: "vat_amount",
              modelValue: form.vat_amount,
              "onUpdate:modelValue": ($event) => form.vat_amount = $event,
              type: "number",
              min: "0",
              step: "0.01"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_BaseInput, {
                id: "vat_amount",
                modelValue: form.vat_amount,
                "onUpdate:modelValue": ($event) => form.vat_amount = $event,
                type: "number",
                min: "0",
                step: "0.01"
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="rounded-lg bg-muted/60 p-3 text-sm"><div class="flex justify-between"><span>Subtotal</span><strong>${ssrInterpolate(unref(formatCurrency)(totals.value.subtotal))}</strong></div><div class="flex justify-between"><span>Discount</span><strong>${ssrInterpolate(unref(formatCurrency)(totals.value.discountTotal))}</strong></div><div class="flex justify-between"><span>Grand total</span><strong>${ssrInterpolate(unref(formatCurrency)(totals.value.grandTotal))}</strong></div><div class="flex justify-between"><span>Balance</span><strong>${ssrInterpolate(unref(formatCurrency)(totals.value.balance))}</strong></div><div class="flex justify-between"><span>Change</span><strong>${ssrInterpolate(unref(formatCurrency)(totals.value.changeAmount))}</strong></div></div>`);
      _push(ssrRenderComponent(_component_BaseButton, {
        type: "submit",
        block: "",
        loading: unref(saving)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Create transaction`);
          } else {
            return [
              createTextVNode("Create transaction")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></form>`);
      if (voidTarget.value) {
        _push(`<form class="rounded-xl border border-destructive/30 bg-destructive/5 p-4 shadow-sm"><h2 class="text-base font-bold">Void ${ssrInterpolate(voidTarget.value.transaction_number)}</h2><p class="mt-1 text-sm text-muted-foreground">A reason is required for cashier audit context.</p>`);
        _push(ssrRenderComponent(_component_FormField, {
          id: "void_reason",
          label: "Void reason",
          class: "mt-4"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<textarea id="void_reason" rows="3" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"${_scopeId}>${ssrInterpolate(voidReason.value)}</textarea>`);
            } else {
              return [
                withDirectives(createVNode("textarea", {
                  id: "void_reason",
                  "onUpdate:modelValue": ($event) => voidReason.value = $event,
                  rows: "3",
                  class: "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, voidReason.value]
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="mt-4 flex gap-2">`);
        _push(ssrRenderComponent(_component_BaseButton, {
          type: "submit",
          variant: "danger",
          loading: unref(saving)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Void transaction`);
            } else {
              return [
                createTextVNode("Void transaction")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_BaseButton, {
          type: "button",
          variant: "ghost",
          onClick: ($event) => voidTarget.value = null
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Cancel`);
            } else {
              return [
                createTextVNode("Cancel")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></form>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</aside></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[tenant]/billing/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };;globalThis.__timing__.logEnd('Load chunks/build/index-B6pLw9s2');
//# sourceMappingURL=index-B6pLw9s2.mjs.map

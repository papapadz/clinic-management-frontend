globalThis.__timing__.logStart('Load chunks/build/index-B4AeOuWB');import { _ as _sfc_main$1, u as useApi } from './useApi-BqLSQQg_.mjs';
import { _ as _sfc_main$2 } from './FormField-BBFT5EVR.mjs';
import { _ as _sfc_main$3 } from './BaseInput-CXB4y4hS.mjs';
import { _ as _sfc_main$4 } from './BaseButton-BkIETyp0.mjs';
import { _ as _sfc_main$5 } from './MetricCard-D2TSdre9.mjs';
import { a as _sfc_main$1$1, _ as _sfc_main$6 } from './EmptyState-n5ZY7_uF.mjs';
import { defineComponent, reactive, ref, computed, mergeProps, unref, withCtx, withDirectives, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, vModelSelect, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';
import { BarChart3, ClipboardList, Coins, CalendarDays, PackageSearch } from 'lucide-vue-next';
import { b as formatNumber } from './format-yZrm7N67.mjs';
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
import './nuxt-link-CfPMJNCN.mjs';
import 'date-fns';

function normalizeReportResult(type, results) {
  const data = results != null ? results : {};
  switch (type) {
    case "revenue":
      return normalizeRevenue(data);
    case "lab_tat":
    case "lab_turnaround":
      return normalizeLabTurnaround(data);
    case "appointments":
    case "appointment_analytics":
      return normalizeAppointments(data);
    case "inventory_valuation":
      return normalizeInventory(data);
    case "daily_census":
    default:
      return normalizeDailyCensus(data);
  }
}
function normalizeRevenue(data) {
  const groups = Array.isArray(data.by_status) ? data.by_status : [];
  return {
    summary: [
      { label: "Revenue", value: money(data.total), helper: "Paid and partial transactions", tone: "success" },
      { label: "Statuses", value: String(groups.length), helper: "Transaction status groups", tone: "primary" }
    ],
    chartRows: groups.map((group) => ({
      label: title(group.status),
      value: number(group.total),
      detail: `${number(group.count)} transactions`,
      tone: statusTone(group.status)
    })),
    tableRows: groups.map((group) => ({
      label: title(group.status),
      value: money(group.total),
      detail: `${number(group.count)} transactions`
    }))
  };
}
function normalizeDailyCensus(data) {
  const rows = [
    row("Patients", number(data.patients), "Registered patients", "primary"),
    row("Encounters", number(data.encounters), "Clinical encounters", "success"),
    row("Appointments", number(data.appointments), "Scheduled visits", "warning")
  ];
  return fromRows(rows);
}
function normalizeLabTurnaround(data) {
  const rows = [
    row("Total requests", number(data.total_requests), "Lab requests in scope", "primary"),
    row("Critical", number(data.critical), "Critical result flags", "danger")
  ];
  return fromRows(rows);
}
function normalizeAppointments(data) {
  const rows = [
    row("Total appointments", number(data.total), "Booked visits", "primary"),
    row("No-show", number(data.no_show), "Patients who missed visits", "warning"),
    row("Cancelled", number(data.cancelled), "Cancelled visits", "danger")
  ];
  return fromRows(rows);
}
function normalizeInventory(data) {
  return {
    summary: [
      { label: "Items", value: String(number(data.items)), helper: "Inventory SKUs", tone: "primary" },
      { label: "Stock value", value: money(data.stock_value), helper: "Current stock cost", tone: "success" },
      { label: "Near expiry", value: String(number(data.near_expiry)), helper: "Expiring within 90 days", tone: "warning" }
    ],
    chartRows: [
      { label: "Items", value: number(data.items), detail: "Inventory SKUs", tone: "primary" },
      { label: "Near expiry", value: number(data.near_expiry), detail: "Expiring within 90 days", tone: "warning" }
    ],
    tableRows: [
      { label: "Items", value: String(number(data.items)), detail: "Inventory SKUs" },
      { label: "Stock value", value: money(data.stock_value), detail: "Current stock cost" },
      { label: "Near expiry", value: String(number(data.near_expiry)), detail: "Expiring within 90 days" }
    ]
  };
}
function fromRows(rows) {
  return {
    summary: rows.map(({ label, value, detail, tone }) => ({
      label,
      value: String(value),
      helper: detail,
      tone
    })),
    chartRows: rows,
    tableRows: rows.map(({ label, value, detail }) => ({
      label,
      value: String(value),
      detail
    }))
  };
}
function row(label, value, detail, tone) {
  return { label, value, detail, tone };
}
function number(value) {
  const parsed = Number(value != null ? value : 0);
  return Number.isFinite(parsed) ? parsed : 0;
}
function money(value) {
  return `PHP ${number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}
function title(value) {
  return String(value != null ? value : "Unknown").replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}
function statusTone(status) {
  switch (String(status != null ? status : "").toUpperCase()) {
    case "PAID":
      return "success";
    case "PARTIAL":
      return "warning";
    case "VOIDED":
      return "danger";
    default:
      return "primary";
  }
}
function useReports() {
  const report = ref(null);
  const rawReport = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const api = useApi();
  async function fetchReport(params) {
    var _a;
    loading.value = true;
    error.value = null;
    try {
      const res = await api.api(api.tenantPath("/reports"), { params });
      if (res.success) {
        rawReport.value = res.data;
        report.value = normalizeReportResult(params.type, (_a = res.data) == null ? void 0 : _a.results);
      } else {
        error.value = res.message || "Failed to fetch report";
      }
      return res;
    } catch (e) {
      error.value = e.message || "Failed to fetch report";
      throw e;
    } finally {
      loading.value = false;
    }
  }
  return {
    report,
    rawReport,
    loading,
    error,
    fetchReport
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const reportOptions = [
      { label: "Daily census", value: "daily_census" },
      { label: "Revenue", value: "revenue" },
      { label: "Lab turnaround", value: "lab_turnaround" },
      { label: "Appointment analytics", value: "appointment_analytics" },
      { label: "Inventory valuation", value: "inventory_valuation" }
    ];
    const viewModes = [
      { label: "Graphical", value: "chart" },
      { label: "Tabular", value: "table" }
    ];
    const params = reactive({
      type: "daily_census",
      date_from: "",
      date_to: "",
      format: "json"
    });
    const viewMode = ref("chart");
    const { report, rawReport, loading, error, fetchReport } = useReports();
    const displayReport = computed(() => {
      var _a;
      return (_a = report.value) != null ? _a : normalizeReportResult(params.type, null);
    });
    const activeReportLabel = computed(() => {
      var _a2;
      var _a;
      return (_a2 = (_a = reportOptions.find((option) => option.value === params.type)) == null ? void 0 : _a.label) != null ? _a2 : "Report";
    });
    const maxChartValue = computed(() => Math.max(1, ...displayReport.value.chartRows.map((row2) => row2.value)));
    async function loadReport() {
      await fetchReport({ ...params });
    }
    function barWidth(value) {
      return Math.max(4, Math.round(value / maxChartValue.value * 100));
    }
    function barTone(tone) {
      const tones = {
        primary: "bg-primary",
        success: "bg-emerald-500",
        warning: "bg-amber-500",
        danger: "bg-rose-500"
      };
      return tones[tone];
    }
    function metricIcon(index) {
      return [ClipboardList, Coins, CalendarDays, PackageSearch][index % 4];
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_PageHeader = _sfc_main$1;
      const _component_FormField = _sfc_main$2;
      const _component_BaseInput = _sfc_main$3;
      const _component_BaseButton = _sfc_main$4;
      const _component_MetricCard = _sfc_main$5;
      const _component_LoadingState = _sfc_main$1$1;
      const _component_EmptyState = _sfc_main$6;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_PageHeader, {
        eyebrow: "Clinic insight",
        title: "Reports and analytics",
        description: "Review operational reports as summary cards, chart bars, and tabular rows."
      }, null, _parent));
      if (unref(error)) {
        _push(`<div class="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<section class="rounded-xl border border-border bg-card p-4 shadow-sm"><div class="grid gap-3 md:grid-cols-[1fr_160px_160px_auto] md:items-end">`);
      _push(ssrRenderComponent(_component_FormField, {
        id: "report_type",
        label: "Report type"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<select id="report_type" class="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-semibold"${_scopeId}><!--[-->`);
            ssrRenderList(reportOptions, (option) => {
              _push2(`<option${ssrRenderAttr("value", option.value)}${ssrIncludeBooleanAttr(Array.isArray(params.type) ? ssrLooseContain(params.type, option.value) : ssrLooseEqual(params.type, option.value)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(option.label)}</option>`);
            });
            _push2(`<!--]--></select>`);
          } else {
            return [
              withDirectives(createVNode("select", {
                id: "report_type",
                "onUpdate:modelValue": ($event) => params.type = $event,
                class: "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-semibold"
              }, [
                (openBlock(), createBlock(Fragment, null, renderList(reportOptions, (option) => {
                  return createVNode("option", {
                    key: option.value,
                    value: option.value
                  }, toDisplayString(option.label), 9, ["value"]);
                }), 64))
              ], 8, ["onUpdate:modelValue"]), [
                [vModelSelect, params.type]
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_FormField, {
        id: "date_from",
        label: "From"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_BaseInput, {
              id: "date_from",
              modelValue: params.date_from,
              "onUpdate:modelValue": ($event) => params.date_from = $event,
              type: "date"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_BaseInput, {
                id: "date_from",
                modelValue: params.date_from,
                "onUpdate:modelValue": ($event) => params.date_from = $event,
                type: "date"
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_FormField, {
        id: "date_to",
        label: "To"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_BaseInput, {
              id: "date_to",
              modelValue: params.date_to,
              "onUpdate:modelValue": ($event) => params.date_to = $event,
              type: "date"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_BaseInput, {
                id: "date_to",
                modelValue: params.date_to,
                "onUpdate:modelValue": ($event) => params.date_to = $event,
                type: "date"
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_BaseButton, {
        loading: unref(loading),
        onClick: loadReport
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Run report`);
          } else {
            return [
              createTextVNode("Run report")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section><div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><!--[-->`);
      ssrRenderList(displayReport.value.summary, (item, index) => {
        _push(ssrRenderComponent(_component_MetricCard, {
          key: item.label,
          label: item.label,
          value: item.value,
          helper: item.helper,
          tone: item.tone,
          icon: metricIcon(index),
          delay: index * 40,
          loading: unref(loading)
        }, null, _parent));
      });
      _push(`<!--]--></div><section class="overflow-hidden rounded-xl border border-border bg-card shadow-sm"><div class="flex flex-col gap-3 border-b border-border p-4 md:flex-row md:items-center md:justify-between"><div><h2 class="text-base font-bold">${ssrInterpolate(activeReportLabel.value)}</h2><p class="text-sm text-muted-foreground">${ssrInterpolate(((_a = unref(rawReport)) == null ? void 0 : _a.date_from) || params.date_from || "Start")} to ${ssrInterpolate(((_b = unref(rawReport)) == null ? void 0 : _b.date_to) || params.date_to || "today")}</p></div><div class="inline-flex rounded-lg border border-border bg-muted p-1"><!--[-->`);
      ssrRenderList(viewModes, (mode) => {
        _push(`<button type="button" class="${ssrRenderClass([viewMode.value === mode.value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground", "rounded-md px-3 py-1.5 text-sm font-semibold transition"])}">${ssrInterpolate(mode.label)}</button>`);
      });
      _push(`<!--]--></div></div>`);
      if (unref(loading)) {
        _push(ssrRenderComponent(_component_LoadingState, {
          rows: 5,
          class: "border-0 shadow-none"
        }, null, _parent));
      } else if (displayReport.value.chartRows.length === 0) {
        _push(ssrRenderComponent(_component_EmptyState, {
          title: "No report rows",
          description: "Run a report or choose a different date range.",
          icon: unref(BarChart3)
        }, null, _parent));
      } else if (viewMode.value === "chart") {
        _push(`<div class="space-y-4 p-4"><!--[-->`);
        ssrRenderList(displayReport.value.chartRows, (row2) => {
          _push(`<div class="space-y-2"><div class="flex items-center justify-between gap-3 text-sm"><div><p class="font-bold">${ssrInterpolate(row2.label)}</p><p class="text-xs text-muted-foreground">${ssrInterpolate(row2.detail)}</p></div><p class="font-bold">${ssrInterpolate(unref(formatNumber)(row2.value))}</p></div><div class="h-3 overflow-hidden rounded-full bg-muted"><div class="${ssrRenderClass([barTone(row2.tone), "h-full rounded-full transition-all duration-500"])}" style="${ssrRenderStyle({ width: `${barWidth(row2.value)}%` })}"></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="overflow-x-auto"><table class="min-w-full divide-y divide-border text-sm"><thead class="bg-muted/60"><tr><th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted-foreground">Metric</th><th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted-foreground">Value</th><th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted-foreground">Detail</th></tr></thead><tbody class="divide-y divide-border"><!--[-->`);
        ssrRenderList(displayReport.value.tableRows, (row2) => {
          _push(`<tr class="transition hover:bg-muted/40"><td class="px-4 py-3 font-semibold">${ssrInterpolate(row2.label)}</td><td class="px-4 py-3">${ssrInterpolate(row2.value)}</td><td class="px-4 py-3 text-muted-foreground">${ssrInterpolate(row2.detail)}</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div>`);
      }
      _push(`</section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[tenant]/reports/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };;globalThis.__timing__.logEnd('Load chunks/build/index-B4AeOuWB');
//# sourceMappingURL=index-B4AeOuWB.mjs.map

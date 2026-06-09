globalThis.__timing__.logStart('Load chunks/build/index-CVICTKKS');import { _ as _sfc_main$1, u as useApi } from './useApi-BqLSQQg_.mjs';
import { _ as _sfc_main$2 } from './MetricCard-D2TSdre9.mjs';
import { _ as _sfc_main$3 } from './SearchToolbar-CBkU1n6Q.mjs';
import { _ as _sfc_main$4 } from './DataTable-Ckf_gyhV.mjs';
import { _ as _sfc_main$5 } from './StatusBadge-CKDkR-Tg.mjs';
import { _ as _sfc_main$6 } from './BaseButton-BkIETyp0.mjs';
import { _ as _sfc_main$7 } from './FormField-BBFT5EVR.mjs';
import { _ as _sfc_main$8 } from './BaseInput-CXB4y4hS.mjs';
import { defineComponent, reactive, ref, computed, watch, mergeProps, unref, withCtx, createVNode, toDisplayString, createTextVNode, withDirectives, openBlock, createBlock, Fragment, renderList, vModelSelect, vModelText, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { Files, Send, FileClock, CalendarClock } from 'lucide-vue-next';
import { s as statusLabel, a as formatDateTime } from './format-yZrm7N67.mjs';
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

function useRecords() {
  const records = ref([]);
  const meta = ref(null);
  const loading = ref(false);
  const saving = ref(false);
  const error = ref(null);
  const validationErrors = ref(null);
  const api = useApi();
  async function fetchRecords(params = {}) {
    var _a;
    loading.value = true;
    error.value = null;
    try {
      const res = await api.api(api.tenantPath("/records"), { params });
      if (res.success) {
        records.value = res.data;
        meta.value = (_a = res.meta) != null ? _a : null;
      } else {
        error.value = res.message || "Failed to fetch medical records";
      }
      return res;
    } catch (e) {
      error.value = e.message || "Failed to fetch medical records";
      throw e;
    } finally {
      loading.value = false;
    }
  }
  async function createRecord(data) {
    return submit(api.tenantPath("/records"), "POST", data);
  }
  async function releaseRecord(id, data) {
    return submit(api.tenantPath(`/records/${id}/release`), "POST", data);
  }
  async function submit(path, method, body) {
    saving.value = true;
    error.value = null;
    validationErrors.value = null;
    try {
      const res = await api.api(path, { method, body });
      if (!res.success) {
        validationErrors.value = res.errors;
        error.value = res.message || "Record request failed";
      }
      return res;
    } catch (e) {
      error.value = e.message || "Record request failed";
      throw e;
    } finally {
      saving.value = false;
    }
  }
  return {
    records,
    meta,
    loading,
    saving,
    error,
    validationErrors,
    fetchRecords,
    createRecord,
    releaseRecord
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const recordTypes = ["ENCOUNTER", "LAB", "IMAGING", "PRESCRIPTION", "CERT", "REFERRAL"];
    const columns = [
      { key: "record_type", label: "Record" },
      { key: "patient", label: "Patient" },
      { key: "created_at", label: "Created" },
      { key: "is_released", label: "Release" },
      { key: "actions", label: "Actions", align: "right" }
    ];
    const { records, loading, saving, error, validationErrors, fetchRecords } = useRecords();
    const filters = reactive({ search: "", release: "" });
    const releaseTarget = ref(null);
    const releaseForm = reactive({ released_to: "", purpose: "" });
    const form = reactive({
      patient_id: "",
      record_type: "ENCOUNTER",
      reference_id: "",
      file_name: "",
      file_path: "",
      purpose: ""
    });
    const filteredRecords = computed(() => {
      if (!filters.release) return records.value;
      return records.value.filter((record) => filters.release === "released" ? record.is_released : !record.is_released);
    });
    const summary = computed(() => {
      const released = records.value.filter((record) => record.is_released).length;
      const recent = records.value.filter((record) => {
        if (!record.created_at) return false;
        return Date.now() - new Date(record.created_at).getTime() <= 7 * 24 * 60 * 60 * 1e3;
      }).length;
      return {
        total: records.value.length,
        released,
        unreleased: records.value.length - released,
        recent
      };
    });
    watch(() => filters.search, (search) => {
      fetchRecords(search ? { search } : {});
    });
    function selectRelease(record) {
      releaseTarget.value = record;
      releaseForm.released_to = record.released_to || "";
      releaseForm.purpose = record.purpose || "";
    }
    function resetForm() {
      form.patient_id = "";
      form.record_type = "ENCOUNTER";
      form.reference_id = "";
      form.file_name = "";
      form.file_path = "";
      form.purpose = "";
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
        eyebrow: "Document control",
        title: "Medical records",
        description: "Create record metadata, monitor releases, and keep staff-facing document handoffs traceable."
      }, null, _parent));
      if (unref(error)) {
        _push(`<div class="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">`);
      _push(ssrRenderComponent(_component_MetricCard, {
        label: "Records",
        value: summary.value.total,
        helper: "Metadata entries",
        icon: unref(Files),
        loading: unref(loading)
      }, null, _parent));
      _push(ssrRenderComponent(_component_MetricCard, {
        label: "Released",
        value: summary.value.released,
        helper: "Sent to recipients",
        icon: unref(Send),
        tone: "success",
        loading: unref(loading)
      }, null, _parent));
      _push(ssrRenderComponent(_component_MetricCard, {
        label: "Unreleased",
        value: summary.value.unreleased,
        helper: "Awaiting release",
        icon: unref(FileClock),
        tone: "warning",
        loading: unref(loading)
      }, null, _parent));
      _push(ssrRenderComponent(_component_MetricCard, {
        label: "Recent",
        value: summary.value.recent,
        helper: "Created in the last 7 days",
        icon: unref(CalendarClock),
        tone: "primary",
        loading: unref(loading)
      }, null, _parent));
      _push(`</div><section class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px]"><div class="space-y-4"><div class="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">`);
      _push(ssrRenderComponent(_component_SearchToolbar, {
        modelValue: filters.search,
        "onUpdate:modelValue": ($event) => filters.search = $event,
        placeholder: "Search records...",
        label: "Search medical records",
        class: "md:min-w-80"
      }, null, _parent));
      _push(`<select class="h-10 rounded-lg border border-input bg-background px-3 text-sm font-semibold text-foreground shadow-sm focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-ring/15"><option value=""${ssrIncludeBooleanAttr(Array.isArray(filters.release) ? ssrLooseContain(filters.release, "") : ssrLooseEqual(filters.release, "")) ? " selected" : ""}>All records</option><option value="released"${ssrIncludeBooleanAttr(Array.isArray(filters.release) ? ssrLooseContain(filters.release, "released") : ssrLooseEqual(filters.release, "released")) ? " selected" : ""}>Released</option><option value="unreleased"${ssrIncludeBooleanAttr(Array.isArray(filters.release) ? ssrLooseContain(filters.release, "unreleased") : ssrLooseEqual(filters.release, "unreleased")) ? " selected" : ""}>Unreleased</option></select></div>`);
      _push(ssrRenderComponent(_component_DataTable, {
        columns,
        rows: filteredRecords.value,
        loading: unref(loading),
        "empty-title": "No medical records found",
        "empty-description": "Create record metadata or adjust filters to see document activity."
      }, {
        "cell-record_type": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><p class="font-semibold"${_scopeId}>${ssrInterpolate(unref(statusLabel)(row.record_type))}</p><p class="text-xs text-muted-foreground"${_scopeId}>${ssrInterpolate(row.file_name || row.file_path || "No file metadata")}</p></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("p", { class: "font-semibold" }, toDisplayString(unref(statusLabel)(row.record_type)), 1),
                createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(row.file_name || row.file_path || "No file metadata"), 1)
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
        "cell-created_at": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span${_scopeId}>${ssrInterpolate(unref(formatDateTime)(row.created_at))}</span>`);
          } else {
            return [
              createVNode("span", null, toDisplayString(unref(formatDateTime)(row.created_at)), 1)
            ];
          }
        }),
        "cell-is_released": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_StatusBadge, {
              status: row.is_released,
              label: row.is_released ? "Released" : "Unreleased",
              tone: row.is_released ? "success" : "warning"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_StatusBadge, {
                status: row.is_released,
                label: row.is_released ? "Released" : "Unreleased",
                tone: row.is_released ? "success" : "warning"
              }, null, 8, ["status", "label", "tone"])
            ];
          }
        }),
        "cell-actions": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_BaseButton, {
              size: "sm",
              variant: "outline",
              disabled: row.is_released,
              onClick: ($event) => selectRelease(row)
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Release `);
                } else {
                  return [
                    createTextVNode(" Release ")
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex justify-end" }, [
                createVNode(_component_BaseButton, {
                  size: "sm",
                  variant: "outline",
                  disabled: row.is_released,
                  onClick: ($event) => selectRelease(row)
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Release ")
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
            _push2(`<div class="flex items-start justify-between gap-3"${_scopeId}><div${_scopeId}><p class="font-bold"${_scopeId}>${ssrInterpolate(unref(statusLabel)(row.record_type))}</p><p class="mt-1 text-xs text-muted-foreground"${_scopeId}>${ssrInterpolate(row.file_name || row.file_path || "No file metadata")}</p></div>`);
            _push2(ssrRenderComponent(_component_StatusBadge, {
              status: row.is_released,
              label: row.is_released ? "Released" : "Unreleased",
              tone: row.is_released ? "success" : "warning"
            }, null, _parent2, _scopeId));
            _push2(`</div><p class="text-sm text-muted-foreground"${_scopeId}>${ssrInterpolate(((_a2 = row.patient) == null ? void 0 : _a2.full_name) || `Patient #${row.patient_id}`)}</p>`);
          } else {
            return [
              createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                createVNode("div", null, [
                  createVNode("p", { class: "font-bold" }, toDisplayString(unref(statusLabel)(row.record_type)), 1),
                  createVNode("p", { class: "mt-1 text-xs text-muted-foreground" }, toDisplayString(row.file_name || row.file_path || "No file metadata"), 1)
                ]),
                createVNode(_component_StatusBadge, {
                  status: row.is_released,
                  label: row.is_released ? "Released" : "Unreleased",
                  tone: row.is_released ? "success" : "warning"
                }, null, 8, ["status", "label", "tone"])
              ]),
              createVNode("p", { class: "text-sm text-muted-foreground" }, toDisplayString(((_b2 = row.patient) == null ? void 0 : _b2.full_name) || `Patient #${row.patient_id}`), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><aside class="space-y-4"><form class="rounded-xl border border-border bg-card p-4 shadow-sm"><div class="mb-4 flex items-center justify-between gap-3"><div><h2 class="text-base font-bold">Create record</h2><p class="text-sm text-muted-foreground">Store document metadata for staff release workflows.</p></div>`);
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
        id: "record_patient_id",
        label: "Patient ID",
        errors: (_a = unref(validationErrors)) == null ? void 0 : _a.patient_id
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b2;
          if (_push2) {
            _push2(ssrRenderComponent(_component_BaseInput, {
              id: "record_patient_id",
              modelValue: form.patient_id,
              "onUpdate:modelValue": ($event) => form.patient_id = $event,
              "has-error": Boolean((_a2 = unref(validationErrors)) == null ? void 0 : _a2.patient_id)
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_BaseInput, {
                id: "record_patient_id",
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
        id: "record_reference_id",
        label: "Reference ID"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_BaseInput, {
              id: "record_reference_id",
              modelValue: form.reference_id,
              "onUpdate:modelValue": ($event) => form.reference_id = $event
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_BaseInput, {
                id: "record_reference_id",
                modelValue: form.reference_id,
                "onUpdate:modelValue": ($event) => form.reference_id = $event
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_FormField, {
        id: "record_type",
        label: "Record type",
        errors: (_b = unref(validationErrors)) == null ? void 0 : _b.record_type
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<select id="record_type" class="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"${_scopeId}><!--[-->`);
            ssrRenderList(recordTypes, (type) => {
              _push2(`<option${ssrRenderAttr("value", type)}${ssrIncludeBooleanAttr(Array.isArray(form.record_type) ? ssrLooseContain(form.record_type, type) : ssrLooseEqual(form.record_type, type)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(unref(statusLabel)(type))}</option>`);
            });
            _push2(`<!--]--></select>`);
          } else {
            return [
              withDirectives(createVNode("select", {
                id: "record_type",
                "onUpdate:modelValue": ($event) => form.record_type = $event,
                class: "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              }, [
                (openBlock(), createBlock(Fragment, null, renderList(recordTypes, (type) => {
                  return createVNode("option", {
                    key: type,
                    value: type
                  }, toDisplayString(unref(statusLabel)(type)), 9, ["value"]);
                }), 64))
              ], 8, ["onUpdate:modelValue"]), [
                [vModelSelect, form.record_type]
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_FormField, {
        id: "file_name",
        label: "File name"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_BaseInput, {
              id: "file_name",
              modelValue: form.file_name,
              "onUpdate:modelValue": ($event) => form.file_name = $event,
              placeholder: "signed-encounter.pdf"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_BaseInput, {
                id: "file_name",
                modelValue: form.file_name,
                "onUpdate:modelValue": ($event) => form.file_name = $event,
                placeholder: "signed-encounter.pdf"
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_FormField, {
        id: "file_path",
        label: "File path"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_BaseInput, {
              id: "file_path",
              modelValue: form.file_path,
              "onUpdate:modelValue": ($event) => form.file_path = $event,
              placeholder: "records/patient/file.pdf"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_BaseInput, {
                id: "file_path",
                modelValue: form.file_path,
                "onUpdate:modelValue": ($event) => form.file_path = $event,
                placeholder: "records/patient/file.pdf"
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_FormField, {
        id: "purpose",
        label: "Purpose"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<textarea id="purpose" rows="3" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"${_scopeId}>${ssrInterpolate(form.purpose)}</textarea>`);
          } else {
            return [
              withDirectives(createVNode("textarea", {
                id: "purpose",
                "onUpdate:modelValue": ($event) => form.purpose = $event,
                rows: "3",
                class: "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              }, null, 8, ["onUpdate:modelValue"]), [
                [vModelText, form.purpose]
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_BaseButton, {
        type: "submit",
        block: "",
        loading: unref(saving)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Create record`);
          } else {
            return [
              createTextVNode("Create record")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></form>`);
      if (releaseTarget.value) {
        _push(`<form class="rounded-xl border border-primary/20 bg-primary/5 p-4 shadow-sm"><h2 class="text-base font-bold">Release ${ssrInterpolate(unref(statusLabel)(releaseTarget.value.record_type))}</h2><p class="mt-1 text-sm text-muted-foreground">${ssrInterpolate(releaseTarget.value.file_name || releaseTarget.value.file_path || `Record #${releaseTarget.value.id}`)}</p><div class="mt-4 space-y-4">`);
        _push(ssrRenderComponent(_component_FormField, {
          id: "released_to",
          label: "Released to"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_BaseInput, {
                id: "released_to",
                modelValue: releaseForm.released_to,
                "onUpdate:modelValue": ($event) => releaseForm.released_to = $event
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_BaseInput, {
                  id: "released_to",
                  modelValue: releaseForm.released_to,
                  "onUpdate:modelValue": ($event) => releaseForm.released_to = $event
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_FormField, {
          id: "release_purpose",
          label: "Purpose"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<textarea id="release_purpose" rows="3" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"${_scopeId}>${ssrInterpolate(releaseForm.purpose)}</textarea>`);
            } else {
              return [
                withDirectives(createVNode("textarea", {
                  id: "release_purpose",
                  "onUpdate:modelValue": ($event) => releaseForm.purpose = $event,
                  rows: "3",
                  class: "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, releaseForm.purpose]
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="mt-4 flex gap-2">`);
        _push(ssrRenderComponent(_component_BaseButton, {
          type: "submit",
          loading: unref(saving)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Release`);
            } else {
              return [
                createTextVNode("Release")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_BaseButton, {
          type: "button",
          variant: "ghost",
          onClick: ($event) => releaseTarget.value = null
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[tenant]/records/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };;globalThis.__timing__.logEnd('Load chunks/build/index-CVICTKKS');
//# sourceMappingURL=index-CVICTKKS.mjs.map

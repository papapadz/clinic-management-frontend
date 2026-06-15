globalThis.__timing__.logStart('Load chunks/build/index-Duo-a2NB');import { _ as _sfc_main$1, u as useApi } from './useApi-BqLSQQg_.mjs';
import { _ as _sfc_main$2 } from './BaseButton-BkIETyp0.mjs';
import { _ as _sfc_main$3 } from './SearchToolbar-CBkU1n6Q.mjs';
import { _ as _sfc_main$4 } from './DataTable-Ckf_gyhV.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-CfPMJNCN.mjs';
import { _ as _sfc_main$5 } from './StatusBadge-CKDkR-Tg.mjs';
import { _ as _sfc_main$6 } from './BaseDialog-DRATr3_o.mjs';
import { _ as _sfc_main$7 } from './FormField-BBFT5EVR.mjs';
import { _ as _sfc_main$8 } from './BaseInput-CXB4y4hS.mjs';
import { defineComponent, ref, reactive, computed, watch, mergeProps, withCtx, unref, createTextVNode, openBlock, createBlock, createCommentVNode, withDirectives, createVNode, vModelSelect, toDisplayString, vModelText, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { UserPlus } from 'lucide-vue-next';
import { useRoute } from 'vue-router';
import { _ as _export_sfc, u as useAuthStore } from './server.mjs';
import './EmptyState-n5ZY7_uF.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'reka-ui';
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

function usePatient() {
  const patients = ref([]);
  const meta = ref(null);
  const loading = ref(false);
  const creating = ref(false);
  const error = ref(null);
  const validationErrors = ref(null);
  const api = useApi();
  async function fetchPatients(params = {}) {
    var _a;
    loading.value = true;
    error.value = null;
    try {
      const res = await api.api(api.tenantPath("/patients"), { params });
      if (res.success) {
        patients.value = res.data;
        meta.value = (_a = res.meta) != null ? _a : null;
      } else {
        error.value = res.message || "Failed to fetch patients";
      }
    } catch (e) {
      error.value = e.message || "Failed to fetch patients";
    } finally {
      loading.value = false;
    }
  }
  async function createPatient(data) {
    creating.value = true;
    error.value = null;
    validationErrors.value = null;
    try {
      const res = await api.api(api.tenantPath("/patients"), {
        method: "POST",
        body: data
      });
      if (res.success) {
        return res;
      }
      validationErrors.value = res.errors;
      error.value = res.message || "Failed to create patient";
      return res;
    } catch (e) {
      error.value = e.message || "Failed to create patient";
      throw e;
    } finally {
      creating.value = false;
    }
  }
  return {
    patients,
    meta,
    loading,
    creating,
    error,
    validationErrors,
    fetchPatients,
    createPatient
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const auth = useAuthStore();
    const {
      patients,
      meta,
      loading,
      creating,
      error,
      validationErrors,
      fetchPatients,
      createPatient
    } = usePatient();
    const search = ref("");
    const page = ref(1);
    const perPage = ref(20);
    const showCreate = ref(false);
    const successMessage = ref("");
    let searchTimer = null;
    const emptyForm = () => ({
      first_name: "",
      middle_name: "",
      last_name: "",
      dob: "",
      gender: "",
      civil_status: "",
      nationality: "",
      religion: "",
      contact_number: "",
      email: "",
      addressText: "",
      emergencyContactText: "",
      philhealth_number: "",
      hmo_provider: "",
      hmo_id: "",
      blood_type: "",
      allergiesText: "",
      chronicConditionsText: ""
    });
    const form = reactive(emptyForm());
    const canCreatePatients = computed(() => {
      var _a2;
      var _a, _b;
      return (_a2 = (_b = (_a = auth.user) == null ? void 0 : _a.permissions) == null ? void 0 : _b.includes("patients.create")) != null ? _a2 : false;
    });
    const canGoPrevious = computed(() => {
      var _a2;
      var _a;
      return ((_a2 = (_a = meta.value) == null ? void 0 : _a.page) != null ? _a2 : page.value) > 1;
    });
    const canGoNext = computed(() => {
      var _a2, _b2;
      var _a, _b;
      return ((_a2 = (_a = meta.value) == null ? void 0 : _a.page) != null ? _a2 : page.value) < ((_b2 = (_b = meta.value) == null ? void 0 : _b.last_page) != null ? _b2 : 1);
    });
    const metaSummary = computed(() => {
      var _a2;
      var _a;
      const total = (_a2 = (_a = meta.value) == null ? void 0 : _a.total) != null ? _a2 : 0;
      return `${total} ${total === 1 ? "record" : "records"}`;
    });
    const patientColumns = [
      { key: "patient_code", label: "Patient code" },
      { key: "full_name", label: "Full name" },
      { key: "dob", label: "Birth date" },
      { key: "gender", label: "Gender" },
      { key: "contact_number", label: "Contact" },
      { key: "is_active", label: "Status" },
      { key: "registered_at", label: "Registered" }
    ];
    function currentParams() {
      return {
        page: page.value,
        per_page: perPage.value,
        search: search.value || void 0
      };
    }
    async function loadPatients() {
      await fetchPatients(currentParams());
    }
    function goToPage(nextPage) {
      var _a2;
      var _a;
      if (nextPage < 1 || nextPage > ((_a2 = (_a = meta.value) == null ? void 0 : _a.last_page) != null ? _a2 : 1)) {
        return;
      }
      page.value = nextPage;
      loadPatients();
    }
    function openCreateModal() {
      successMessage.value = "";
      showCreate.value = true;
    }
    function closeCreateModal() {
      showCreate.value = false;
    }
    function resetForm() {
      Object.assign(form, emptyForm());
    }
    function fieldErrors(field) {
      var _a2;
      var _a;
      return (_a2 = (_a = validationErrors.value) == null ? void 0 : _a[field]) != null ? _a2 : [];
    }
    function textToList(value) {
      const items = value.split(/[\n,]+/).map((item) => item.trim()).filter(Boolean);
      return items.length > 0 ? items : void 0;
    }
    function optional(value) {
      const trimmed = value.trim();
      return trimmed === "" ? void 0 : trimmed;
    }
    function buildPayload() {
      return {
        first_name: form.first_name,
        middle_name: optional(form.middle_name),
        last_name: form.last_name,
        dob: form.dob,
        gender: form.gender,
        civil_status: optional(form.civil_status),
        nationality: optional(form.nationality),
        religion: optional(form.religion),
        contact_number: optional(form.contact_number),
        email: optional(form.email),
        address: optional(form.addressText) ? { street: form.addressText.trim() } : void 0,
        emergency_contact: optional(form.emergencyContactText) ? { name: form.emergencyContactText.trim() } : void 0,
        philhealth_number: optional(form.philhealth_number),
        hmo_provider: optional(form.hmo_provider),
        hmo_id: optional(form.hmo_id),
        blood_type: optional(form.blood_type),
        allergies: textToList(form.allergiesText),
        chronic_conditions: textToList(form.chronicConditionsText)
      };
    }
    async function submitCreate() {
      const res = await createPatient(buildPayload());
      if (!(res == null ? void 0 : res.success)) {
        return;
      }
      resetForm();
      closeCreateModal();
      successMessage.value = res.message || "Patient created successfully.";
      page.value = 1;
      await loadPatients();
    }
    function patientName(patient) {
      return patient.full_name || [patient.first_name, patient.middle_name, patient.last_name].filter(Boolean).join(" ");
    }
    function formatDate(value) {
      if (!value) {
        return "-";
      }
      return new Intl.DateTimeFormat("en-PH", {
        year: "numeric",
        month: "short",
        day: "2-digit"
      }).format(new Date(value));
    }
    watch(search, () => {
      if (searchTimer) {
        clearTimeout(searchTimer);
      }
      searchTimer = setTimeout(() => {
        page.value = 1;
        loadPatients();
      }, 250);
    });
    watch(perPage, () => {
      page.value = 1;
      loadPatients();
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a2, _b2;
      var _a, _b;
      const _component_PageHeader = _sfc_main$1;
      const _component_BaseButton = _sfc_main$2;
      const _component_SearchToolbar = _sfc_main$3;
      const _component_DataTable = _sfc_main$4;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_StatusBadge = _sfc_main$5;
      const _component_BaseDialog = _sfc_main$6;
      const _component_FormField = _sfc_main$7;
      const _component_BaseInput = _sfc_main$8;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))} data-v-933c46be>`);
      _push(ssrRenderComponent(_component_PageHeader, {
        eyebrow: "Patient registry",
        title: "Patients",
        description: `Search, review, and register patient records. ${metaSummary.value}`
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (canCreatePatients.value) {
              _push2(ssrRenderComponent(_component_BaseButton, {
                icon: unref(UserPlus),
                onClick: openCreateModal
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Add patient `);
                  } else {
                    return [
                      createTextVNode(" Add patient ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              canCreatePatients.value ? (openBlock(), createBlock(_component_BaseButton, {
                key: 0,
                icon: unref(UserPlus),
                onClick: openCreateModal
              }, {
                default: withCtx(() => [
                  createTextVNode(" Add patient ")
                ]),
                _: 1
              }, 8, ["icon"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (successMessage.value) {
        _push(`<div class="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" data-v-933c46be>${ssrInterpolate(successMessage.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(error)) {
        _push(`<div class="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive" data-v-933c46be>${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_SearchToolbar, {
        modelValue: search.value,
        "onUpdate:modelValue": ($event) => search.value = $event,
        placeholder: "Search by name, code, email, or contact",
        label: "Search patients"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<select class="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-ring/15 sm:w-32" aria-label="Rows per page" data-v-933c46be${_scopeId}><option${ssrRenderAttr("value", 10)} data-v-933c46be${ssrIncludeBooleanAttr(Array.isArray(perPage.value) ? ssrLooseContain(perPage.value, 10) : ssrLooseEqual(perPage.value, 10)) ? " selected" : ""}${_scopeId}>10 rows</option><option${ssrRenderAttr("value", 20)} data-v-933c46be${ssrIncludeBooleanAttr(Array.isArray(perPage.value) ? ssrLooseContain(perPage.value, 20) : ssrLooseEqual(perPage.value, 20)) ? " selected" : ""}${_scopeId}>20 rows</option><option${ssrRenderAttr("value", 50)} data-v-933c46be${ssrIncludeBooleanAttr(Array.isArray(perPage.value) ? ssrLooseContain(perPage.value, 50) : ssrLooseEqual(perPage.value, 50)) ? " selected" : ""}${_scopeId}>50 rows</option></select>`);
          } else {
            return [
              withDirectives(createVNode("select", {
                "onUpdate:modelValue": ($event) => perPage.value = $event,
                class: "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-ring/15 sm:w-32",
                "aria-label": "Rows per page"
              }, [
                createVNode("option", { value: 10 }, "10 rows"),
                createVNode("option", { value: 20 }, "20 rows"),
                createVNode("option", { value: 50 }, "50 rows")
              ], 8, ["onUpdate:modelValue"]), [
                [
                  vModelSelect,
                  perPage.value,
                  void 0,
                  { number: true }
                ]
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_DataTable, {
        columns: patientColumns,
        rows: unref(patients),
        loading: unref(loading),
        "empty-title": search.value ? "No matching patients" : "No patients yet",
        "empty-description": search.value ? "Try a different search term." : "New patient records will appear here after registration."
      }, {
        "cell-patient_code": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="font-semibold" data-v-933c46be${_scopeId}>${ssrInterpolate(row.patient_code)}</span>`);
          } else {
            return [
              createVNode("span", { class: "font-semibold" }, toDisplayString(row.patient_code), 1)
            ];
          }
        }),
        "cell-full_name": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: `/${unref(route).params.tenant}/patients/${row.id}`,
              class: "font-semibold text-primary hover:underline"
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(patientName(row))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(patientName(row)), 1)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_NuxtLink, {
                to: `/${unref(route).params.tenant}/patients/${row.id}`,
                class: "font-semibold text-primary hover:underline"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(patientName(row)), 1)
                ]),
                _: 2
              }, 1032, ["to"])
            ];
          }
        }),
        "cell-dob": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-muted-foreground" data-v-933c46be${_scopeId}>${ssrInterpolate(formatDate(row.dob))}</span>`);
          } else {
            return [
              createVNode("span", { class: "text-muted-foreground" }, toDisplayString(formatDate(row.dob)), 1)
            ];
          }
        }),
        "cell-contact_number": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-muted-foreground" data-v-933c46be${_scopeId}>${ssrInterpolate(row.contact_number || "-")}</span>`);
          } else {
            return [
              createVNode("span", { class: "text-muted-foreground" }, toDisplayString(row.contact_number || "-"), 1)
            ];
          }
        }),
        "cell-is_active": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_StatusBadge, {
              status: row.is_active
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_StatusBadge, {
                status: row.is_active
              }, null, 8, ["status"])
            ];
          }
        }),
        "cell-registered_at": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-muted-foreground" data-v-933c46be${_scopeId}>${ssrInterpolate(formatDate(row.registered_at || row.created_at))}</span>`);
          } else {
            return [
              createVNode("span", { class: "text-muted-foreground" }, toDisplayString(formatDate(row.registered_at || row.created_at)), 1)
            ];
          }
        }),
        "mobile-card": withCtx(({ row }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-start justify-between gap-3" data-v-933c46be${_scopeId}><div data-v-933c46be${_scopeId}>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: `/${unref(route).params.tenant}/patients/${row.id}`,
              class: "font-bold text-primary"
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(patientName(row))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(patientName(row)), 1)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`<p class="mt-1 text-xs text-muted-foreground" data-v-933c46be${_scopeId}>${ssrInterpolate(row.patient_code)} \u2022 ${ssrInterpolate(row.gender)} \u2022 ${ssrInterpolate(formatDate(row.dob))}</p></div>`);
            _push2(ssrRenderComponent(_component_StatusBadge, {
              status: row.is_active
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="grid gap-2 text-sm text-muted-foreground" data-v-933c46be${_scopeId}><p data-v-933c46be${_scopeId}>Contact: ${ssrInterpolate(row.contact_number || "-")}</p><p data-v-933c46be${_scopeId}>Registered: ${ssrInterpolate(formatDate(row.registered_at || row.created_at))}</p></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                createVNode("div", null, [
                  createVNode(_component_NuxtLink, {
                    to: `/${unref(route).params.tenant}/patients/${row.id}`,
                    class: "font-bold text-primary"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(patientName(row)), 1)
                    ]),
                    _: 2
                  }, 1032, ["to"]),
                  createVNode("p", { class: "mt-1 text-xs text-muted-foreground" }, toDisplayString(row.patient_code) + " \u2022 " + toDisplayString(row.gender) + " \u2022 " + toDisplayString(formatDate(row.dob)), 1)
                ]),
                createVNode(_component_StatusBadge, {
                  status: row.is_active
                }, null, 8, ["status"])
              ]),
              createVNode("div", { class: "grid gap-2 text-sm text-muted-foreground" }, [
                createVNode("p", null, "Contact: " + toDisplayString(row.contact_number || "-"), 1),
                createVNode("p", null, "Registered: " + toDisplayString(formatDate(row.registered_at || row.created_at)), 1)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" data-v-933c46be><p class="text-sm text-muted-foreground" data-v-933c46be> Page ${ssrInterpolate((_a2 = (_a = unref(meta)) == null ? void 0 : _a.page) != null ? _a2 : page.value)} of ${ssrInterpolate((_b2 = (_b = unref(meta)) == null ? void 0 : _b.last_page) != null ? _b2 : 1)}</p><div class="flex gap-2" data-v-933c46be>`);
      _push(ssrRenderComponent(_component_BaseButton, {
        variant: "outline",
        disabled: !canGoPrevious.value || unref(loading),
        onClick: ($event) => goToPage(page.value - 1)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Previous `);
          } else {
            return [
              createTextVNode(" Previous ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_BaseButton, {
        variant: "outline",
        disabled: !canGoNext.value || unref(loading),
        onClick: ($event) => goToPage(page.value + 1)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Next `);
          } else {
            return [
              createTextVNode(" Next ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      _push(ssrRenderComponent(_component_BaseDialog, {
        open: showCreate.value,
        "onUpdate:open": ($event) => showCreate.value = $event,
        title: "Add patient",
        description: "Register the patient details used across appointments, records, and billing."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form class="min-h-0 overflow-y-auto" data-v-933c46be${_scopeId}><div class="space-y-6 overflow-y-auto p-5" data-v-933c46be${_scopeId}><section class="space-y-3" data-v-933c46be${_scopeId}><h3 class="text-sm font-semibold uppercase text-muted-foreground" data-v-933c46be${_scopeId}>Personal information</h3><div class="grid gap-4 md:grid-cols-3" data-v-933c46be${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormField, {
              id: "first_name",
              label: "First name",
              errors: fieldErrors("first_name")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_BaseInput, {
                    id: "first_name",
                    modelValue: form.first_name,
                    "onUpdate:modelValue": ($event) => form.first_name = $event,
                    required: "",
                    "has-error": fieldErrors("first_name").length > 0
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_BaseInput, {
                      id: "first_name",
                      modelValue: form.first_name,
                      "onUpdate:modelValue": ($event) => form.first_name = $event,
                      required: "",
                      "has-error": fieldErrors("first_name").length > 0
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "has-error"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormField, {
              id: "middle_name",
              label: "Middle name",
              errors: fieldErrors("middle_name")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_BaseInput, {
                    id: "middle_name",
                    modelValue: form.middle_name,
                    "onUpdate:modelValue": ($event) => form.middle_name = $event,
                    "has-error": fieldErrors("middle_name").length > 0
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_BaseInput, {
                      id: "middle_name",
                      modelValue: form.middle_name,
                      "onUpdate:modelValue": ($event) => form.middle_name = $event,
                      "has-error": fieldErrors("middle_name").length > 0
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "has-error"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormField, {
              id: "last_name",
              label: "Last name",
              errors: fieldErrors("last_name")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_BaseInput, {
                    id: "last_name",
                    modelValue: form.last_name,
                    "onUpdate:modelValue": ($event) => form.last_name = $event,
                    required: "",
                    "has-error": fieldErrors("last_name").length > 0
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_BaseInput, {
                      id: "last_name",
                      modelValue: form.last_name,
                      "onUpdate:modelValue": ($event) => form.last_name = $event,
                      required: "",
                      "has-error": fieldErrors("last_name").length > 0
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "has-error"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormField, {
              id: "dob",
              label: "Date of birth",
              errors: fieldErrors("dob")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_BaseInput, {
                    id: "dob",
                    modelValue: form.dob,
                    "onUpdate:modelValue": ($event) => form.dob = $event,
                    type: "date",
                    required: "",
                    "has-error": fieldErrors("dob").length > 0
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_BaseInput, {
                      id: "dob",
                      modelValue: form.dob,
                      "onUpdate:modelValue": ($event) => form.dob = $event,
                      type: "date",
                      required: "",
                      "has-error": fieldErrors("dob").length > 0
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "has-error"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormField, {
              id: "gender",
              label: "Gender",
              errors: fieldErrors("gender")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<select id="gender" required class="field-input" data-v-933c46be${_scopeId2}><option value="" data-v-933c46be${ssrIncludeBooleanAttr(Array.isArray(form.gender) ? ssrLooseContain(form.gender, "") : ssrLooseEqual(form.gender, "")) ? " selected" : ""}${_scopeId2}>Select gender</option><option value="Male" data-v-933c46be${ssrIncludeBooleanAttr(Array.isArray(form.gender) ? ssrLooseContain(form.gender, "Male") : ssrLooseEqual(form.gender, "Male")) ? " selected" : ""}${_scopeId2}>Male</option><option value="Female" data-v-933c46be${ssrIncludeBooleanAttr(Array.isArray(form.gender) ? ssrLooseContain(form.gender, "Female") : ssrLooseEqual(form.gender, "Female")) ? " selected" : ""}${_scopeId2}>Female</option><option value="Other" data-v-933c46be${ssrIncludeBooleanAttr(Array.isArray(form.gender) ? ssrLooseContain(form.gender, "Other") : ssrLooseEqual(form.gender, "Other")) ? " selected" : ""}${_scopeId2}>Other</option></select>`);
                } else {
                  return [
                    withDirectives(createVNode("select", {
                      id: "gender",
                      "onUpdate:modelValue": ($event) => form.gender = $event,
                      required: "",
                      class: "field-input"
                    }, [
                      createVNode("option", { value: "" }, "Select gender"),
                      createVNode("option", { value: "Male" }, "Male"),
                      createVNode("option", { value: "Female" }, "Female"),
                      createVNode("option", { value: "Other" }, "Other")
                    ], 8, ["onUpdate:modelValue"]), [
                      [vModelSelect, form.gender]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormField, {
              id: "civil_status",
              label: "Civil status",
              errors: fieldErrors("civil_status")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_BaseInput, {
                    id: "civil_status",
                    modelValue: form.civil_status,
                    "onUpdate:modelValue": ($event) => form.civil_status = $event,
                    "has-error": fieldErrors("civil_status").length > 0
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_BaseInput, {
                      id: "civil_status",
                      modelValue: form.civil_status,
                      "onUpdate:modelValue": ($event) => form.civil_status = $event,
                      "has-error": fieldErrors("civil_status").length > 0
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "has-error"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormField, {
              id: "nationality",
              label: "Nationality",
              errors: fieldErrors("nationality")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_BaseInput, {
                    id: "nationality",
                    modelValue: form.nationality,
                    "onUpdate:modelValue": ($event) => form.nationality = $event,
                    "has-error": fieldErrors("nationality").length > 0
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_BaseInput, {
                      id: "nationality",
                      modelValue: form.nationality,
                      "onUpdate:modelValue": ($event) => form.nationality = $event,
                      "has-error": fieldErrors("nationality").length > 0
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "has-error"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormField, {
              id: "religion",
              label: "Religion",
              errors: fieldErrors("religion")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_BaseInput, {
                    id: "religion",
                    modelValue: form.religion,
                    "onUpdate:modelValue": ($event) => form.religion = $event,
                    "has-error": fieldErrors("religion").length > 0
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_BaseInput, {
                      id: "religion",
                      modelValue: form.religion,
                      "onUpdate:modelValue": ($event) => form.religion = $event,
                      "has-error": fieldErrors("religion").length > 0
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "has-error"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></section><section class="space-y-3" data-v-933c46be${_scopeId}><h3 class="text-sm font-semibold uppercase text-muted-foreground" data-v-933c46be${_scopeId}>Contact and address</h3><div class="grid gap-4 md:grid-cols-2" data-v-933c46be${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormField, {
              id: "contact_number",
              label: "Contact number",
              errors: fieldErrors("contact_number")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_BaseInput, {
                    id: "contact_number",
                    modelValue: form.contact_number,
                    "onUpdate:modelValue": ($event) => form.contact_number = $event,
                    "has-error": fieldErrors("contact_number").length > 0
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_BaseInput, {
                      id: "contact_number",
                      modelValue: form.contact_number,
                      "onUpdate:modelValue": ($event) => form.contact_number = $event,
                      "has-error": fieldErrors("contact_number").length > 0
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "has-error"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormField, {
              id: "email",
              label: "Email",
              errors: fieldErrors("email")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_BaseInput, {
                    id: "email",
                    modelValue: form.email,
                    "onUpdate:modelValue": ($event) => form.email = $event,
                    type: "email",
                    "has-error": fieldErrors("email").length > 0
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_BaseInput, {
                      id: "email",
                      modelValue: form.email,
                      "onUpdate:modelValue": ($event) => form.email = $event,
                      type: "email",
                      "has-error": fieldErrors("email").length > 0
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "has-error"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormField, {
              id: "address",
              label: "Address",
              errors: fieldErrors("address"),
              class: "md:col-span-2"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<textarea id="address" rows="3" class="field-input" data-v-933c46be${_scopeId2}>${ssrInterpolate(form.addressText)}</textarea>`);
                } else {
                  return [
                    withDirectives(createVNode("textarea", {
                      id: "address",
                      "onUpdate:modelValue": ($event) => form.addressText = $event,
                      rows: "3",
                      class: "field-input"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, form.addressText]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></section><section class="space-y-3" data-v-933c46be${_scopeId}><h3 class="text-sm font-semibold uppercase text-muted-foreground" data-v-933c46be${_scopeId}>Emergency contact</h3>`);
            _push2(ssrRenderComponent(_component_FormField, {
              id: "emergency_contact",
              label: "Emergency contact",
              errors: fieldErrors("emergency_contact")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<textarea id="emergency_contact" rows="2" class="field-input" data-v-933c46be${_scopeId2}>${ssrInterpolate(form.emergencyContactText)}</textarea>`);
                } else {
                  return [
                    withDirectives(createVNode("textarea", {
                      id: "emergency_contact",
                      "onUpdate:modelValue": ($event) => form.emergencyContactText = $event,
                      rows: "2",
                      class: "field-input"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, form.emergencyContactText]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</section><section class="space-y-3" data-v-933c46be${_scopeId}><h3 class="text-sm font-semibold uppercase text-muted-foreground" data-v-933c46be${_scopeId}>Insurance</h3><div class="grid gap-4 md:grid-cols-3" data-v-933c46be${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormField, {
              id: "philhealth_number",
              label: "PhilHealth number",
              errors: fieldErrors("philhealth_number")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_BaseInput, {
                    id: "philhealth_number",
                    modelValue: form.philhealth_number,
                    "onUpdate:modelValue": ($event) => form.philhealth_number = $event,
                    "has-error": fieldErrors("philhealth_number").length > 0
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_BaseInput, {
                      id: "philhealth_number",
                      modelValue: form.philhealth_number,
                      "onUpdate:modelValue": ($event) => form.philhealth_number = $event,
                      "has-error": fieldErrors("philhealth_number").length > 0
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "has-error"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormField, {
              id: "hmo_provider",
              label: "HMO provider",
              errors: fieldErrors("hmo_provider")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_BaseInput, {
                    id: "hmo_provider",
                    modelValue: form.hmo_provider,
                    "onUpdate:modelValue": ($event) => form.hmo_provider = $event,
                    "has-error": fieldErrors("hmo_provider").length > 0
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_BaseInput, {
                      id: "hmo_provider",
                      modelValue: form.hmo_provider,
                      "onUpdate:modelValue": ($event) => form.hmo_provider = $event,
                      "has-error": fieldErrors("hmo_provider").length > 0
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "has-error"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormField, {
              id: "hmo_id",
              label: "HMO number",
              errors: fieldErrors("hmo_id")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_BaseInput, {
                    id: "hmo_id",
                    modelValue: form.hmo_id,
                    "onUpdate:modelValue": ($event) => form.hmo_id = $event,
                    "has-error": fieldErrors("hmo_id").length > 0
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_BaseInput, {
                      id: "hmo_id",
                      modelValue: form.hmo_id,
                      "onUpdate:modelValue": ($event) => form.hmo_id = $event,
                      "has-error": fieldErrors("hmo_id").length > 0
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "has-error"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></section><section class="space-y-3" data-v-933c46be${_scopeId}><h3 class="text-sm font-semibold uppercase text-muted-foreground" data-v-933c46be${_scopeId}>Medical notes</h3><div class="grid gap-4 md:grid-cols-3" data-v-933c46be${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormField, {
              id: "blood_type",
              label: "Blood type",
              errors: fieldErrors("blood_type")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_BaseInput, {
                    id: "blood_type",
                    modelValue: form.blood_type,
                    "onUpdate:modelValue": ($event) => form.blood_type = $event,
                    "has-error": fieldErrors("blood_type").length > 0
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_BaseInput, {
                      id: "blood_type",
                      modelValue: form.blood_type,
                      "onUpdate:modelValue": ($event) => form.blood_type = $event,
                      "has-error": fieldErrors("blood_type").length > 0
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "has-error"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormField, {
              id: "allergies",
              label: "Allergies",
              errors: fieldErrors("allergies")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<textarea id="allergies" rows="3" class="field-input" data-v-933c46be${_scopeId2}>${ssrInterpolate(form.allergiesText)}</textarea>`);
                } else {
                  return [
                    withDirectives(createVNode("textarea", {
                      id: "allergies",
                      "onUpdate:modelValue": ($event) => form.allergiesText = $event,
                      rows: "3",
                      class: "field-input"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, form.allergiesText]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormField, {
              id: "chronic_conditions",
              label: "Chronic conditions",
              errors: fieldErrors("chronic_conditions")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<textarea id="chronic_conditions" rows="3" class="field-input" data-v-933c46be${_scopeId2}>${ssrInterpolate(form.chronicConditionsText)}</textarea>`);
                } else {
                  return [
                    withDirectives(createVNode("textarea", {
                      id: "chronic_conditions",
                      "onUpdate:modelValue": ($event) => form.chronicConditionsText = $event,
                      rows: "3",
                      class: "field-input"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, form.chronicConditionsText]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></section></div><div class="sticky bottom-0 flex justify-end gap-2 border-t border-border bg-background/95 px-5 py-4 backdrop-blur" data-v-933c46be${_scopeId}>`);
            _push2(ssrRenderComponent(_component_BaseButton, {
              type: "button",
              variant: "outline",
              onClick: closeCreateModal
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Cancel `);
                } else {
                  return [
                    createTextVNode(" Cancel ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_BaseButton, {
              type: "submit",
              loading: unref(creating)
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(creating) ? "Saving..." : "Save patient")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(creating) ? "Saving..." : "Save patient"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form>`);
          } else {
            return [
              createVNode("form", {
                class: "min-h-0 overflow-y-auto",
                onSubmit: withModifiers(submitCreate, ["prevent"])
              }, [
                createVNode("div", { class: "space-y-6 overflow-y-auto p-5" }, [
                  createVNode("section", { class: "space-y-3" }, [
                    createVNode("h3", { class: "text-sm font-semibold uppercase text-muted-foreground" }, "Personal information"),
                    createVNode("div", { class: "grid gap-4 md:grid-cols-3" }, [
                      createVNode(_component_FormField, {
                        id: "first_name",
                        label: "First name",
                        errors: fieldErrors("first_name")
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_BaseInput, {
                            id: "first_name",
                            modelValue: form.first_name,
                            "onUpdate:modelValue": ($event) => form.first_name = $event,
                            required: "",
                            "has-error": fieldErrors("first_name").length > 0
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "has-error"])
                        ]),
                        _: 1
                      }, 8, ["errors"]),
                      createVNode(_component_FormField, {
                        id: "middle_name",
                        label: "Middle name",
                        errors: fieldErrors("middle_name")
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_BaseInput, {
                            id: "middle_name",
                            modelValue: form.middle_name,
                            "onUpdate:modelValue": ($event) => form.middle_name = $event,
                            "has-error": fieldErrors("middle_name").length > 0
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "has-error"])
                        ]),
                        _: 1
                      }, 8, ["errors"]),
                      createVNode(_component_FormField, {
                        id: "last_name",
                        label: "Last name",
                        errors: fieldErrors("last_name")
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_BaseInput, {
                            id: "last_name",
                            modelValue: form.last_name,
                            "onUpdate:modelValue": ($event) => form.last_name = $event,
                            required: "",
                            "has-error": fieldErrors("last_name").length > 0
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "has-error"])
                        ]),
                        _: 1
                      }, 8, ["errors"]),
                      createVNode(_component_FormField, {
                        id: "dob",
                        label: "Date of birth",
                        errors: fieldErrors("dob")
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_BaseInput, {
                            id: "dob",
                            modelValue: form.dob,
                            "onUpdate:modelValue": ($event) => form.dob = $event,
                            type: "date",
                            required: "",
                            "has-error": fieldErrors("dob").length > 0
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "has-error"])
                        ]),
                        _: 1
                      }, 8, ["errors"]),
                      createVNode(_component_FormField, {
                        id: "gender",
                        label: "Gender",
                        errors: fieldErrors("gender")
                      }, {
                        default: withCtx(() => [
                          withDirectives(createVNode("select", {
                            id: "gender",
                            "onUpdate:modelValue": ($event) => form.gender = $event,
                            required: "",
                            class: "field-input"
                          }, [
                            createVNode("option", { value: "" }, "Select gender"),
                            createVNode("option", { value: "Male" }, "Male"),
                            createVNode("option", { value: "Female" }, "Female"),
                            createVNode("option", { value: "Other" }, "Other")
                          ], 8, ["onUpdate:modelValue"]), [
                            [vModelSelect, form.gender]
                          ])
                        ]),
                        _: 1
                      }, 8, ["errors"]),
                      createVNode(_component_FormField, {
                        id: "civil_status",
                        label: "Civil status",
                        errors: fieldErrors("civil_status")
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_BaseInput, {
                            id: "civil_status",
                            modelValue: form.civil_status,
                            "onUpdate:modelValue": ($event) => form.civil_status = $event,
                            "has-error": fieldErrors("civil_status").length > 0
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "has-error"])
                        ]),
                        _: 1
                      }, 8, ["errors"]),
                      createVNode(_component_FormField, {
                        id: "nationality",
                        label: "Nationality",
                        errors: fieldErrors("nationality")
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_BaseInput, {
                            id: "nationality",
                            modelValue: form.nationality,
                            "onUpdate:modelValue": ($event) => form.nationality = $event,
                            "has-error": fieldErrors("nationality").length > 0
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "has-error"])
                        ]),
                        _: 1
                      }, 8, ["errors"]),
                      createVNode(_component_FormField, {
                        id: "religion",
                        label: "Religion",
                        errors: fieldErrors("religion")
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_BaseInput, {
                            id: "religion",
                            modelValue: form.religion,
                            "onUpdate:modelValue": ($event) => form.religion = $event,
                            "has-error": fieldErrors("religion").length > 0
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "has-error"])
                        ]),
                        _: 1
                      }, 8, ["errors"])
                    ])
                  ]),
                  createVNode("section", { class: "space-y-3" }, [
                    createVNode("h3", { class: "text-sm font-semibold uppercase text-muted-foreground" }, "Contact and address"),
                    createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                      createVNode(_component_FormField, {
                        id: "contact_number",
                        label: "Contact number",
                        errors: fieldErrors("contact_number")
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_BaseInput, {
                            id: "contact_number",
                            modelValue: form.contact_number,
                            "onUpdate:modelValue": ($event) => form.contact_number = $event,
                            "has-error": fieldErrors("contact_number").length > 0
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "has-error"])
                        ]),
                        _: 1
                      }, 8, ["errors"]),
                      createVNode(_component_FormField, {
                        id: "email",
                        label: "Email",
                        errors: fieldErrors("email")
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_BaseInput, {
                            id: "email",
                            modelValue: form.email,
                            "onUpdate:modelValue": ($event) => form.email = $event,
                            type: "email",
                            "has-error": fieldErrors("email").length > 0
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "has-error"])
                        ]),
                        _: 1
                      }, 8, ["errors"]),
                      createVNode(_component_FormField, {
                        id: "address",
                        label: "Address",
                        errors: fieldErrors("address"),
                        class: "md:col-span-2"
                      }, {
                        default: withCtx(() => [
                          withDirectives(createVNode("textarea", {
                            id: "address",
                            "onUpdate:modelValue": ($event) => form.addressText = $event,
                            rows: "3",
                            class: "field-input"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, form.addressText]
                          ])
                        ]),
                        _: 1
                      }, 8, ["errors"])
                    ])
                  ]),
                  createVNode("section", { class: "space-y-3" }, [
                    createVNode("h3", { class: "text-sm font-semibold uppercase text-muted-foreground" }, "Emergency contact"),
                    createVNode(_component_FormField, {
                      id: "emergency_contact",
                      label: "Emergency contact",
                      errors: fieldErrors("emergency_contact")
                    }, {
                      default: withCtx(() => [
                        withDirectives(createVNode("textarea", {
                          id: "emergency_contact",
                          "onUpdate:modelValue": ($event) => form.emergencyContactText = $event,
                          rows: "2",
                          class: "field-input"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, form.emergencyContactText]
                        ])
                      ]),
                      _: 1
                    }, 8, ["errors"])
                  ]),
                  createVNode("section", { class: "space-y-3" }, [
                    createVNode("h3", { class: "text-sm font-semibold uppercase text-muted-foreground" }, "Insurance"),
                    createVNode("div", { class: "grid gap-4 md:grid-cols-3" }, [
                      createVNode(_component_FormField, {
                        id: "philhealth_number",
                        label: "PhilHealth number",
                        errors: fieldErrors("philhealth_number")
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_BaseInput, {
                            id: "philhealth_number",
                            modelValue: form.philhealth_number,
                            "onUpdate:modelValue": ($event) => form.philhealth_number = $event,
                            "has-error": fieldErrors("philhealth_number").length > 0
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "has-error"])
                        ]),
                        _: 1
                      }, 8, ["errors"]),
                      createVNode(_component_FormField, {
                        id: "hmo_provider",
                        label: "HMO provider",
                        errors: fieldErrors("hmo_provider")
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_BaseInput, {
                            id: "hmo_provider",
                            modelValue: form.hmo_provider,
                            "onUpdate:modelValue": ($event) => form.hmo_provider = $event,
                            "has-error": fieldErrors("hmo_provider").length > 0
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "has-error"])
                        ]),
                        _: 1
                      }, 8, ["errors"]),
                      createVNode(_component_FormField, {
                        id: "hmo_id",
                        label: "HMO number",
                        errors: fieldErrors("hmo_id")
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_BaseInput, {
                            id: "hmo_id",
                            modelValue: form.hmo_id,
                            "onUpdate:modelValue": ($event) => form.hmo_id = $event,
                            "has-error": fieldErrors("hmo_id").length > 0
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "has-error"])
                        ]),
                        _: 1
                      }, 8, ["errors"])
                    ])
                  ]),
                  createVNode("section", { class: "space-y-3" }, [
                    createVNode("h3", { class: "text-sm font-semibold uppercase text-muted-foreground" }, "Medical notes"),
                    createVNode("div", { class: "grid gap-4 md:grid-cols-3" }, [
                      createVNode(_component_FormField, {
                        id: "blood_type",
                        label: "Blood type",
                        errors: fieldErrors("blood_type")
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_BaseInput, {
                            id: "blood_type",
                            modelValue: form.blood_type,
                            "onUpdate:modelValue": ($event) => form.blood_type = $event,
                            "has-error": fieldErrors("blood_type").length > 0
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "has-error"])
                        ]),
                        _: 1
                      }, 8, ["errors"]),
                      createVNode(_component_FormField, {
                        id: "allergies",
                        label: "Allergies",
                        errors: fieldErrors("allergies")
                      }, {
                        default: withCtx(() => [
                          withDirectives(createVNode("textarea", {
                            id: "allergies",
                            "onUpdate:modelValue": ($event) => form.allergiesText = $event,
                            rows: "3",
                            class: "field-input"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, form.allergiesText]
                          ])
                        ]),
                        _: 1
                      }, 8, ["errors"]),
                      createVNode(_component_FormField, {
                        id: "chronic_conditions",
                        label: "Chronic conditions",
                        errors: fieldErrors("chronic_conditions")
                      }, {
                        default: withCtx(() => [
                          withDirectives(createVNode("textarea", {
                            id: "chronic_conditions",
                            "onUpdate:modelValue": ($event) => form.chronicConditionsText = $event,
                            rows: "3",
                            class: "field-input"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, form.chronicConditionsText]
                          ])
                        ]),
                        _: 1
                      }, 8, ["errors"])
                    ])
                  ])
                ]),
                createVNode("div", { class: "sticky bottom-0 flex justify-end gap-2 border-t border-border bg-background/95 px-5 py-4 backdrop-blur" }, [
                  createVNode(_component_BaseButton, {
                    type: "button",
                    variant: "outline",
                    onClick: closeCreateModal
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Cancel ")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_BaseButton, {
                    type: "submit",
                    loading: unref(creating)
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(creating) ? "Saving..." : "Save patient"), 1)
                    ]),
                    _: 1
                  }, 8, ["loading"])
                ])
              ], 32)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[tenant]/patients/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-933c46be"]]);

export { index as default };;globalThis.__timing__.logEnd('Load chunks/build/index-Duo-a2NB');
//# sourceMappingURL=index-Duo-a2NB.mjs.map

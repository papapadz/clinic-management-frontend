globalThis.__timing__.logStart('Load chunks/build/index-2vPk_-cb');import { u as useApi, _ as _sfc_main$1 } from './useApi-BqLSQQg_.mjs';
import { _ as _sfc_main$2 } from './BaseButton-BkIETyp0.mjs';
import { a as _sfc_main$1$1, _ as _sfc_main$5 } from './EmptyState-n5ZY7_uF.mjs';
import { _ as _sfc_main$3 } from './StatusBadge-CKDkR-Tg.mjs';
import { _ as _sfc_main$4 } from './DataTable-Ckf_gyhV.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-CfPMJNCN.mjs';
import { _ as _sfc_main$6 } from './BaseDialog-DRATr3_o.mjs';
import { _ as _sfc_main$7 } from './FormField-BBFT5EVR.mjs';
import { _ as _sfc_main$8 } from './BaseInput-CXB4y4hS.mjs';
import { defineComponent, computed, ref, reactive, watch, mergeProps, withCtx, createTextVNode, unref, createVNode, openBlock, createBlock, createCommentVNode, toDisplayString, withDirectives, vModelSelect, vModelText, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { Plus } from 'lucide-vue-next';
import { useRoute, useRouter } from 'vue-router';
import { _ as _export_sfc, u as useAuthStore } from './server.mjs';
import { u as useEncounter } from './useEncounter-C21kBNMf.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const auth = useAuthStore();
    useApi();
    const encounter = useEncounter();
    const tenant = computed(() => String(route.params.tenant));
    const patientId = computed(() => String(route.params.id));
    const patient = ref(null);
    const loadingPatient = ref(true);
    const statusFilter = ref("");
    const showCreateEncounter = ref(false);
    const successMessage = ref("");
    const patientError = ref(null);
    const encounterForm = reactive({
      encounter_type: "OPD",
      chief_complaint: "",
      encounter_date: ""
    });
    const encounters = computed(() => encounter.encounters.value);
    const loadingEncounters = computed(() => encounter.loading.value);
    const savingEncounter = computed(() => encounter.saving.value);
    const errorMessage = computed(() => patientError.value || encounter.error.value);
    const permissions = computed(() => {
      var _a2;
      var _a;
      return (_a2 = (_a = auth.user) == null ? void 0 : _a.permissions) != null ? _a2 : [];
    });
    const canCreateEncounter = computed(() => permissions.value.includes("encounters.create"));
    const encounterColumns = [
      { key: "encounter_date", label: "Date" },
      { key: "encounter_type", label: "Type" },
      { key: "chief_complaint", label: "Chief complaint" },
      { key: "status", label: "Status" },
      { key: "actions", label: "Actions" }
    ];
    const demographics = computed(() => {
      if (!patient.value) {
        return [];
      }
      return [
        { label: "Patient code", value: patient.value.patient_code },
        { label: "Birth date", value: formatDate(patient.value.dob) },
        { label: "Contact", value: patient.value.contact_number || "-" },
        { label: "Email", value: patient.value.email || "-" },
        { label: "Civil status", value: patient.value.civil_status || "-" },
        { label: "Blood type", value: patient.value.blood_type || "-" }
      ];
    });
    async function loadEncounters() {
      await encounter.fetchPatientEncounters(patientId.value, {
        status: statusFilter.value || void 0
      });
    }
    async function submitEncounter() {
      const res = await encounter.createEncounter(patientId.value, {
        encounter_type: encounterForm.encounter_type,
        chief_complaint: optional(encounterForm.chief_complaint),
        encounter_date: optional(encounterForm.encounter_date),
        status: "DRAFT"
      });
      if (!res.success) {
        return;
      }
      showCreateEncounter.value = false;
      successMessage.value = "Encounter draft created.";
      await loadEncounters();
      await router.push(encounterPath(res.data.id));
    }
    function fieldErrors(field) {
      var _a2;
      var _a;
      return (_a2 = (_a = encounter.validationErrors.value) == null ? void 0 : _a[field]) != null ? _a2 : [];
    }
    function encounterPath(encounterId) {
      return `/${tenant.value}/patients/${patientId.value}/encounters/${encounterId}`;
    }
    function patientName(value) {
      return value.full_name || [value.first_name, value.middle_name, value.last_name].filter(Boolean).join(" ");
    }
    function optional(value) {
      const trimmed = value.trim();
      return trimmed === "" ? void 0 : trimmed;
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
    function formatDateTime(value) {
      if (!value) {
        return "-";
      }
      return new Intl.DateTimeFormat("en-PH", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date(value));
    }
    watch(statusFilter, loadEncounters);
    return (_ctx, _push, _parent, _attrs) => {
      var _a2, _b2;
      var _a, _b;
      const _component_PageHeader = _sfc_main$1;
      const _component_BaseButton = _sfc_main$2;
      const _component_LoadingState = _sfc_main$1$1;
      const _component_StatusBadge = _sfc_main$3;
      const _component_DataTable = _sfc_main$4;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_EmptyState = _sfc_main$5;
      const _component_BaseDialog = _sfc_main$6;
      const _component_FormField = _sfc_main$7;
      const _component_BaseInput = _sfc_main$8;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))} data-v-7cf33824>`);
      _push(ssrRenderComponent(_component_PageHeader, {
        eyebrow: "Patient chart",
        title: patient.value ? patientName(patient.value) : "Patient chart",
        description: patient.value ? `${patient.value.patient_code} \u2022 ${patient.value.gender} \u2022 ${formatDate(patient.value.dob)}` : "Review demographics and encounter history."
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_BaseButton, {
              variant: "outline",
              to: `/${tenant.value}/patients`
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Back`);
                } else {
                  return [
                    createTextVNode("Back")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (canCreateEncounter.value) {
              _push2(ssrRenderComponent(_component_BaseButton, {
                icon: unref(Plus),
                onClick: ($event) => showCreateEncounter.value = true
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` New encounter `);
                  } else {
                    return [
                      createTextVNode(" New encounter ")
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
              createVNode(_component_BaseButton, {
                variant: "outline",
                to: `/${tenant.value}/patients`
              }, {
                default: withCtx(() => [
                  createTextVNode("Back")
                ]),
                _: 1
              }, 8, ["to"]),
              canCreateEncounter.value ? (openBlock(), createBlock(_component_BaseButton, {
                key: 0,
                icon: unref(Plus),
                onClick: ($event) => showCreateEncounter.value = true
              }, {
                default: withCtx(() => [
                  createTextVNode(" New encounter ")
                ]),
                _: 1
              }, 8, ["icon", "onClick"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (successMessage.value) {
        _push(`<div class="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800" data-v-7cf33824>${ssrInterpolate(successMessage.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (errorMessage.value) {
        _push(`<div class="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive" data-v-7cf33824>${ssrInterpolate(errorMessage.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (loadingPatient.value) {
        _push(ssrRenderComponent(_component_LoadingState, { rows: 4 }, null, _parent));
      } else if (patient.value) {
        _push(`<!--[--><section class="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]" data-v-7cf33824><article class="rounded-xl border border-border bg-card p-5 shadow-sm" data-v-7cf33824><div class="flex items-start justify-between gap-4" data-v-7cf33824><div data-v-7cf33824><h2 class="text-base font-bold text-foreground" data-v-7cf33824>Demographics</h2><p class="mt-1 text-sm text-muted-foreground" data-v-7cf33824>Core patient identifiers used across visits and orders.</p></div>`);
        _push(ssrRenderComponent(_component_StatusBadge, {
          status: patient.value.is_active
        }, null, _parent));
        _push(`</div><dl class="mt-5 grid gap-4 sm:grid-cols-2" data-v-7cf33824><!--[-->`);
        ssrRenderList(demographics.value, (item) => {
          _push(`<div class="rounded-lg bg-muted/45 p-3" data-v-7cf33824><dt class="text-xs font-bold uppercase tracking-wide text-muted-foreground" data-v-7cf33824>${ssrInterpolate(item.label)}</dt><dd class="mt-1 text-sm font-semibold text-foreground" data-v-7cf33824>${ssrInterpolate(item.value)}</dd></div>`);
        });
        _push(`<!--]--></dl></article><article class="rounded-xl border border-border bg-card p-5 shadow-sm" data-v-7cf33824><h2 class="text-base font-bold text-foreground" data-v-7cf33824>Clinical flags</h2><div class="mt-4 space-y-4" data-v-7cf33824><div data-v-7cf33824><p class="text-xs font-bold uppercase tracking-wide text-muted-foreground" data-v-7cf33824>Allergies</p><div class="mt-2 flex flex-wrap gap-2" data-v-7cf33824><!--[-->`);
        ssrRenderList((_a2 = patient.value.allergies) != null ? _a2 : [], (item) => {
          _push(ssrRenderComponent(_component_StatusBadge, {
            key: item,
            status: item,
            tone: "warning"
          }, null, _parent));
        });
        _push(`<!--]-->`);
        if (!((_a = patient.value.allergies) == null ? void 0 : _a.length)) {
          _push(`<span class="text-sm text-muted-foreground" data-v-7cf33824>No allergies recorded</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div data-v-7cf33824><p class="text-xs font-bold uppercase tracking-wide text-muted-foreground" data-v-7cf33824>Chronic conditions</p><div class="mt-2 flex flex-wrap gap-2" data-v-7cf33824><!--[-->`);
        ssrRenderList((_b2 = patient.value.chronic_conditions) != null ? _b2 : [], (item) => {
          _push(ssrRenderComponent(_component_StatusBadge, {
            key: item,
            status: item,
            tone: "info"
          }, null, _parent));
        });
        _push(`<!--]-->`);
        if (!((_b = patient.value.chronic_conditions) == null ? void 0 : _b.length)) {
          _push(`<span class="text-sm text-muted-foreground" data-v-7cf33824>No chronic conditions recorded</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div></article></section><section class="space-y-4" data-v-7cf33824><div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" data-v-7cf33824><div data-v-7cf33824><h2 class="text-lg font-bold text-foreground" data-v-7cf33824>Encounters</h2><p class="text-sm text-muted-foreground" data-v-7cf33824>Open draft visits, review signed notes, and continue the clinical flow.</p></div><select class="field-input sm:w-44" aria-label="Filter encounter status" data-v-7cf33824><option value="" data-v-7cf33824${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "") : ssrLooseEqual(statusFilter.value, "")) ? " selected" : ""}>All statuses</option><option value="DRAFT" data-v-7cf33824${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "DRAFT") : ssrLooseEqual(statusFilter.value, "DRAFT")) ? " selected" : ""}>Draft</option><option value="SIGNED" data-v-7cf33824${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "SIGNED") : ssrLooseEqual(statusFilter.value, "SIGNED")) ? " selected" : ""}>Signed</option><option value="LOCKED" data-v-7cf33824${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "LOCKED") : ssrLooseEqual(statusFilter.value, "LOCKED")) ? " selected" : ""}>Locked</option></select></div>`);
        _push(ssrRenderComponent(_component_DataTable, {
          columns: encounterColumns,
          rows: encounters.value,
          loading: loadingEncounters.value,
          "empty-title": "No encounters yet",
          "empty-description": "Create the first encounter to begin SOAP notes and orders."
        }, {
          "cell-encounter_date": withCtx(({ row }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="font-semibold" data-v-7cf33824${_scopeId}>${ssrInterpolate(formatDateTime(row.encounter_date || row.created_at))}</span>`);
            } else {
              return [
                createVNode("span", { class: "font-semibold" }, toDisplayString(formatDateTime(row.encounter_date || row.created_at)), 1)
              ];
            }
          }),
          "cell-chief_complaint": withCtx(({ row }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="text-muted-foreground" data-v-7cf33824${_scopeId}>${ssrInterpolate(row.chief_complaint || "-")}</span>`);
            } else {
              return [
                createVNode("span", { class: "text-muted-foreground" }, toDisplayString(row.chief_complaint || "-"), 1)
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
                to: encounterPath(row.id),
                variant: "outline",
                size: "sm"
              }, {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Open`);
                  } else {
                    return [
                      createTextVNode("Open")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_BaseButton, {
                  to: encounterPath(row.id),
                  variant: "outline",
                  size: "sm"
                }, {
                  default: withCtx(() => [
                    createTextVNode("Open")
                  ]),
                  _: 1
                }, 8, ["to"])
              ];
            }
          }),
          "mobile-card": withCtx(({ row }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-start justify-between gap-3" data-v-7cf33824${_scopeId}><div data-v-7cf33824${_scopeId}>`);
              _push2(ssrRenderComponent(_component_NuxtLink, {
                to: encounterPath(row.id),
                class: "font-bold text-primary"
              }, {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(row.encounter_type)} encounter `);
                  } else {
                    return [
                      createTextVNode(toDisplayString(row.encounter_type) + " encounter ", 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`<p class="mt-1 text-xs text-muted-foreground" data-v-7cf33824${_scopeId}>${ssrInterpolate(formatDateTime(row.encounter_date || row.created_at))}</p></div>`);
              _push2(ssrRenderComponent(_component_StatusBadge, {
                status: row.status
              }, null, _parent2, _scopeId));
              _push2(`</div><p class="text-sm text-muted-foreground" data-v-7cf33824${_scopeId}>${ssrInterpolate(row.chief_complaint || "No chief complaint recorded")}</p>`);
            } else {
              return [
                createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                  createVNode("div", null, [
                    createVNode(_component_NuxtLink, {
                      to: encounterPath(row.id),
                      class: "font-bold text-primary"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(row.encounter_type) + " encounter ", 1)
                      ]),
                      _: 2
                    }, 1032, ["to"]),
                    createVNode("p", { class: "mt-1 text-xs text-muted-foreground" }, toDisplayString(formatDateTime(row.encounter_date || row.created_at)), 1)
                  ]),
                  createVNode(_component_StatusBadge, {
                    status: row.status
                  }, null, 8, ["status"])
                ]),
                createVNode("p", { class: "text-sm text-muted-foreground" }, toDisplayString(row.chief_complaint || "No chief complaint recorded"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</section><!--]-->`);
      } else {
        _push(ssrRenderComponent(_component_EmptyState, {
          title: "Patient not found",
          description: "The patient record could not be loaded for this clinic."
        }, null, _parent));
      }
      _push(ssrRenderComponent(_component_BaseDialog, {
        open: showCreateEncounter.value,
        "onUpdate:open": ($event) => showCreateEncounter.value = $event,
        title: "New encounter",
        description: "Start a draft clinical encounter for this patient."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form class="space-y-5 p-5" data-v-7cf33824${_scopeId}><div class="grid gap-4 md:grid-cols-2" data-v-7cf33824${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormField, {
              id: "encounter_type",
              label: "Encounter type",
              errors: fieldErrors("encounter_type")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<select id="encounter_type" class="field-input" required data-v-7cf33824${_scopeId2}><option value="OPD" data-v-7cf33824${ssrIncludeBooleanAttr(Array.isArray(encounterForm.encounter_type) ? ssrLooseContain(encounterForm.encounter_type, "OPD") : ssrLooseEqual(encounterForm.encounter_type, "OPD")) ? " selected" : ""}${_scopeId2}>OPD</option><option value="ER" data-v-7cf33824${ssrIncludeBooleanAttr(Array.isArray(encounterForm.encounter_type) ? ssrLooseContain(encounterForm.encounter_type, "ER") : ssrLooseEqual(encounterForm.encounter_type, "ER")) ? " selected" : ""}${_scopeId2}>ER</option><option value="WARD" data-v-7cf33824${ssrIncludeBooleanAttr(Array.isArray(encounterForm.encounter_type) ? ssrLooseContain(encounterForm.encounter_type, "WARD") : ssrLooseEqual(encounterForm.encounter_type, "WARD")) ? " selected" : ""}${_scopeId2}>Ward</option><option value="TELECONSULT" data-v-7cf33824${ssrIncludeBooleanAttr(Array.isArray(encounterForm.encounter_type) ? ssrLooseContain(encounterForm.encounter_type, "TELECONSULT") : ssrLooseEqual(encounterForm.encounter_type, "TELECONSULT")) ? " selected" : ""}${_scopeId2}>Teleconsult</option></select>`);
                } else {
                  return [
                    withDirectives(createVNode("select", {
                      id: "encounter_type",
                      "onUpdate:modelValue": ($event) => encounterForm.encounter_type = $event,
                      class: "field-input",
                      required: ""
                    }, [
                      createVNode("option", { value: "OPD" }, "OPD"),
                      createVNode("option", { value: "ER" }, "ER"),
                      createVNode("option", { value: "WARD" }, "Ward"),
                      createVNode("option", { value: "TELECONSULT" }, "Teleconsult")
                    ], 8, ["onUpdate:modelValue"]), [
                      [vModelSelect, encounterForm.encounter_type]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormField, {
              id: "encounter_date",
              label: "Encounter date",
              errors: fieldErrors("encounter_date")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_BaseInput, {
                    id: "encounter_date",
                    modelValue: encounterForm.encounter_date,
                    "onUpdate:modelValue": ($event) => encounterForm.encounter_date = $event,
                    type: "datetime-local"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_BaseInput, {
                      id: "encounter_date",
                      modelValue: encounterForm.encounter_date,
                      "onUpdate:modelValue": ($event) => encounterForm.encounter_date = $event,
                      type: "datetime-local"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_FormField, {
              id: "chief_complaint",
              label: "Chief complaint",
              errors: fieldErrors("chief_complaint")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<textarea id="chief_complaint" rows="3" class="field-input min-h-24" data-v-7cf33824${_scopeId2}>${ssrInterpolate(encounterForm.chief_complaint)}</textarea>`);
                } else {
                  return [
                    withDirectives(createVNode("textarea", {
                      id: "chief_complaint",
                      "onUpdate:modelValue": ($event) => encounterForm.chief_complaint = $event,
                      rows: "3",
                      class: "field-input min-h-24"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, encounterForm.chief_complaint]
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="flex justify-end gap-2 border-t border-border pt-4" data-v-7cf33824${_scopeId}>`);
            _push2(ssrRenderComponent(_component_BaseButton, {
              type: "button",
              variant: "outline",
              onClick: ($event) => showCreateEncounter.value = false
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Cancel`);
                } else {
                  return [
                    createTextVNode("Cancel")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_BaseButton, {
              type: "submit",
              loading: savingEncounter.value
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Create draft`);
                } else {
                  return [
                    createTextVNode("Create draft")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form>`);
          } else {
            return [
              createVNode("form", {
                class: "space-y-5 p-5",
                onSubmit: withModifiers(submitEncounter, ["prevent"])
              }, [
                createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                  createVNode(_component_FormField, {
                    id: "encounter_type",
                    label: "Encounter type",
                    errors: fieldErrors("encounter_type")
                  }, {
                    default: withCtx(() => [
                      withDirectives(createVNode("select", {
                        id: "encounter_type",
                        "onUpdate:modelValue": ($event) => encounterForm.encounter_type = $event,
                        class: "field-input",
                        required: ""
                      }, [
                        createVNode("option", { value: "OPD" }, "OPD"),
                        createVNode("option", { value: "ER" }, "ER"),
                        createVNode("option", { value: "WARD" }, "Ward"),
                        createVNode("option", { value: "TELECONSULT" }, "Teleconsult")
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, encounterForm.encounter_type]
                      ])
                    ]),
                    _: 1
                  }, 8, ["errors"]),
                  createVNode(_component_FormField, {
                    id: "encounter_date",
                    label: "Encounter date",
                    errors: fieldErrors("encounter_date")
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_BaseInput, {
                        id: "encounter_date",
                        modelValue: encounterForm.encounter_date,
                        "onUpdate:modelValue": ($event) => encounterForm.encounter_date = $event,
                        type: "datetime-local"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }, 8, ["errors"])
                ]),
                createVNode(_component_FormField, {
                  id: "chief_complaint",
                  label: "Chief complaint",
                  errors: fieldErrors("chief_complaint")
                }, {
                  default: withCtx(() => [
                    withDirectives(createVNode("textarea", {
                      id: "chief_complaint",
                      "onUpdate:modelValue": ($event) => encounterForm.chief_complaint = $event,
                      rows: "3",
                      class: "field-input min-h-24"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, encounterForm.chief_complaint]
                    ])
                  ]),
                  _: 1
                }, 8, ["errors"]),
                createVNode("div", { class: "flex justify-end gap-2 border-t border-border pt-4" }, [
                  createVNode(_component_BaseButton, {
                    type: "button",
                    variant: "outline",
                    onClick: ($event) => showCreateEncounter.value = false
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Cancel")
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  createVNode(_component_BaseButton, {
                    type: "submit",
                    loading: savingEncounter.value
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Create draft")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[tenant]/patients/[id]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7cf33824"]]);

export { index as default };;globalThis.__timing__.logEnd('Load chunks/build/index-2vPk_-cb');
//# sourceMappingURL=index-2vPk_-cb.mjs.map

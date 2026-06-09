globalThis.__timing__.logStart('Load chunks/build/_encId_-96QI_D6J');import { u as useApi, _ as _sfc_main$1 } from './useApi-BqLSQQg_.mjs';
import { _ as _sfc_main$2 } from './BaseButton-BkIETyp0.mjs';
import { a as _sfc_main$1$1, _ as _sfc_main$6 } from './EmptyState-n5ZY7_uF.mjs';
import { _ as _sfc_main$3 } from './StatusBadge-CKDkR-Tg.mjs';
import { _ as _sfc_main$4 } from './FormField-BBFT5EVR.mjs';
import { _ as _sfc_main$5 } from './BaseInput-CXB4y4hS.mjs';
import { _ as _sfc_main$7 } from './BaseDialog-DRATr3_o.mjs';
import { defineComponent, h, computed, ref, reactive, watch, mergeProps, withCtx, createTextVNode, unref, createVNode, openBlock, createBlock, createCommentVNode, withDirectives, vModelText, toDisplayString, vModelSelect, Fragment, renderList, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr } from 'vue/server-renderer';
import { CheckCircle2, Save, TestTube2, Image, Pill, CreditCard, FileText } from 'lucide-vue-next';
import { useRoute } from 'vue-router';
import { _ as _export_sfc, u as useAuthStore } from './server.mjs';
import { u as useEncounter } from './useEncounter-C21kBNMf.mjs';
import './nuxt-link-CfPMJNCN.mjs';
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
  __name: "[encId]",
  __ssrInlineRender: true,
  setup(__props) {
    const LinkedPanel = defineComponent({
      props: {
        title: { type: String, required: true },
        items: { type: Array, required: true },
        empty: { type: String, required: true }
      },
      setup(props, { slots }) {
        return () => h("article", { class: "rounded-xl border border-border bg-card p-5 shadow-sm" }, [
          h("h3", { class: "text-base font-bold text-foreground" }, props.title),
          props.items.length === 0 ? h("p", { class: "mt-3 text-sm text-muted-foreground" }, props.empty) : h("div", { class: "mt-4 divide-y divide-border" }, props.items.map((item, index) => {
            var _a;
            return h("div", { class: "py-3 first:pt-0 last:pb-0", key: index }, (_a = slots.default) == null ? void 0 : _a.call(slots, { item }));
          }))
        ]);
      }
    });
    const route = useRoute();
    useApi();
    const auth = useAuthStore();
    const encounterService = useEncounter();
    const tenant = computed(() => String(route.params.tenant));
    const patientId = computed(() => String(route.params.id));
    const encounterId = computed(() => String(route.params.encId));
    const successMessage = ref("");
    const localOrderError = ref("");
    const showOrderDialog = ref(false);
    const activeOrder = ref("lab");
    const inventory = ref([]);
    const summaryData = computed(() => encounterService.summary.value);
    const loading = computed(() => encounterService.loading.value);
    const saving = computed(() => encounterService.saving.value);
    const visibleError = computed(() => localOrderError.value || encounterService.error.value);
    const permissions = computed(() => {
      var _a2;
      var _a;
      return (_a2 = (_a = auth.user) == null ? void 0 : _a.permissions) != null ? _a2 : [];
    });
    const isReadOnly = computed(() => {
      var _a;
      return ((_a = summaryData.value) == null ? void 0 : _a.encounter.status) !== "DRAFT";
    });
    const canUpdate = computed(() => !isReadOnly.value && permissions.value.includes("encounters.update"));
    const canSign = computed(() => !isReadOnly.value && permissions.value.includes("encounters.sign"));
    const canCreateLab = computed(() => !isReadOnly.value && permissions.value.includes("lab.requests.create"));
    const canCreateImaging = computed(() => !isReadOnly.value && permissions.value.includes("imaging.requests.create"));
    const canCreatePharmacy = computed(() => !isReadOnly.value && permissions.value.includes("pharmacy.transactions.create"));
    const canCreateBilling = computed(() => !isReadOnly.value && permissions.value.includes("billing.transactions.create"));
    const canCreateRecord = computed(() => !isReadOnly.value && permissions.value.includes("records.create"));
    const soapForm = reactive({
      chief_complaint: "",
      history_of_present_illness: "",
      bp: "",
      hr: "",
      rr: "",
      temp: "",
      o2sat: "",
      weight: "",
      physical_examination: "",
      review_of_systems: "",
      diagnosis: "",
      medications: ""
    });
    const labForm = reactive({ testName: "", priority: "ROUTINE", specimen_type: "" });
    const imagingForm = reactive({ modality: "XRAY", body_part: "", clinical_indication: "" });
    const pharmacyForm = reactive({ item_id: "", quantity: 1, unit_price: 0, notes: "" });
    const billingForm = reactive({ description: "Consultation", quantity: 1, unit_price: 500, payment_mode: "CASH" });
    const recordForm = reactive({ record_type: "ENCOUNTER", file_name: "encounter-note.pdf", purpose: "" });
    const orderMetrics = computed(() => {
      var _a, _b, _c, _d;
      const data = summaryData.value;
      return [
        { label: "Lab", value: (_a = data == null ? void 0 : data.lab_requests.length) != null ? _a : 0 },
        { label: "Imaging", value: (_b = data == null ? void 0 : data.imaging_requests.length) != null ? _b : 0 },
        { label: "Rx", value: (_c = data == null ? void 0 : data.pharmacy_transactions.length) != null ? _c : 0 },
        { label: "Bills", value: (_d = data == null ? void 0 : data.billing_transactions.length) != null ? _d : 0 }
      ];
    });
    const orderTitle = computed(() => ({
      lab: "Create lab request",
      imaging: "Create imaging request",
      pharmacy: "Dispense medication",
      billing: "Create billing transaction",
      record: "Create medical record"
    })[activeOrder.value]);
    const orderDescription = computed(() => "This order will be linked to the current encounter.");
    async function loadSummary() {
      await encounterService.fetchSummary(encounterId.value);
      fillSoapForm();
    }
    async function signCurrentEncounter() {
      const res = await encounterService.signEncounter(encounterId.value);
      if (res.success) {
        successMessage.value = "Encounter signed.";
        await loadSummary();
      }
    }
    function openOrder(order) {
      activeOrder.value = order;
      localOrderError.value = "";
      showOrderDialog.value = true;
    }
    async function submitQuickOrder() {
      var _a, _b;
      if (!summaryData.value) {
        return;
      }
      localOrderError.value = "";
      const patient_id = summaryData.value.patient.id;
      const encounter_id = summaryData.value.encounter.id;
      let res = null;
      if (activeOrder.value === "lab") {
        if (!labForm.testName.trim()) {
          localOrderError.value = "Test name is required.";
          return;
        }
        res = await encounterService.createLabOrder({
          patient_id,
          encounter_id,
          requesting_clinician_id: (_a = auth.user) == null ? void 0 : _a.id,
          test_panels: [{ name: labForm.testName.trim() }],
          priority: labForm.priority,
          specimen_type: optional(labForm.specimen_type)
        });
      } else if (activeOrder.value === "imaging") {
        if (!imagingForm.body_part.trim()) {
          localOrderError.value = "Body part is required.";
          return;
        }
        res = await encounterService.createImagingOrder({
          patient_id,
          encounter_id,
          requesting_clinician_id: (_b = auth.user) == null ? void 0 : _b.id,
          modality: imagingForm.modality,
          body_part: imagingForm.body_part.trim(),
          clinical_indication: optional(imagingForm.clinical_indication),
          priority: "ROUTINE"
        });
      } else if (activeOrder.value === "pharmacy") {
        if (!pharmacyForm.item_id) {
          localOrderError.value = "Medication is required.";
          return;
        }
        const item = inventory.value.find((inventoryItem) => String(inventoryItem.id) === String(pharmacyForm.item_id));
        const unitPrice = Number(pharmacyForm.unit_price || (item == null ? void 0 : item.selling_price) || 0);
        const quantity = Number(pharmacyForm.quantity || 1);
        res = await encounterService.createPharmacyDispense({
          patient_id,
          encounter_id,
          items: [{ item_id: pharmacyForm.item_id, quantity, unit_price: unitPrice }],
          total_amount: quantity * unitPrice,
          notes: optional(pharmacyForm.notes)
        });
      } else if (activeOrder.value === "billing") {
        const quantity = Number(billingForm.quantity || 1);
        const unitPrice = Number(billingForm.unit_price || 0);
        const total = quantity * unitPrice;
        if (!billingForm.description.trim() || total <= 0) {
          localOrderError.value = "Description and amount are required.";
          return;
        }
        res = await encounterService.createBillingTransaction({
          patient_id,
          encounter_id,
          line_items: [{ description: billingForm.description.trim(), quantity, unit_price: unitPrice, discount: 0, total }],
          subtotal: total,
          discount_total: 0,
          vat_amount: 0,
          grand_total: total,
          payment_mode: billingForm.payment_mode,
          amount_paid: 0,
          balance: total,
          status: "PENDING"
        });
      } else {
        res = await encounterService.createMedicalRecord({
          patient_id,
          record_type: recordForm.record_type,
          reference_id: encounter_id,
          file_name: optional(recordForm.file_name),
          purpose: optional(recordForm.purpose)
        });
      }
      if (res == null ? void 0 : res.success) {
        showOrderDialog.value = false;
        successMessage.value = res.message || "Linked order created.";
        await loadSummary();
      }
    }
    function fillSoapForm() {
      var _a2, _b2, _c2, _d2, _e2, _f2;
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
      const encounter = (_a = summaryData.value) == null ? void 0 : _a.encounter;
      if (!encounter) {
        return;
      }
      soapForm.chief_complaint = (_a2 = encounter.chief_complaint) != null ? _a2 : "";
      soapForm.history_of_present_illness = (_b2 = encounter.history_of_present_illness) != null ? _b2 : "";
      soapForm.bp = (_c2 = (_b = encounter.vital_signs) == null ? void 0 : _b.bp) != null ? _c2 : "";
      soapForm.hr = stringifyNumber((_c = encounter.vital_signs) == null ? void 0 : _c.hr);
      soapForm.rr = stringifyNumber((_d = encounter.vital_signs) == null ? void 0 : _d.rr);
      soapForm.temp = stringifyNumber((_e = encounter.vital_signs) == null ? void 0 : _e.temp);
      soapForm.o2sat = stringifyNumber((_f = encounter.vital_signs) == null ? void 0 : _f.o2sat);
      soapForm.weight = stringifyNumber((_g = encounter.vital_signs) == null ? void 0 : _g.weight);
      soapForm.physical_examination = String((_d2 = (_h = encounter.physical_examination) == null ? void 0 : _h.notes) != null ? _d2 : "");
      soapForm.review_of_systems = String((_e2 = (_i = encounter.review_of_systems) == null ? void 0 : _i.notes) != null ? _e2 : "");
      soapForm.diagnosis = (_f2 = (_k = (_j = encounter.assessment) == null ? void 0 : _j.diagnoses) == null ? void 0 : _k.map((diagnosis) => diagnosis.description).join("\n")) != null ? _f2 : "";
      const medications = Array.isArray((_l = encounter.plan) == null ? void 0 : _l.medications) ? encounter.plan.medications : [];
      soapForm.medications = medications.map((item) => {
        var _a3;
        return (_a3 = item == null ? void 0 : item.name) != null ? _a3 : String(item);
      }).join("\n");
    }
    function fieldErrors(field) {
      var _a2;
      var _a;
      return (_a2 = (_a = encounterService.validationErrors.value) == null ? void 0 : _a[field]) != null ? _a2 : [];
    }
    function panelNames(panels = []) {
      return panels.map((panel) => panel.name).filter(Boolean).join(", ") || "-";
    }
    function itemSummary(items = []) {
      return items.map((item) => {
        var _a;
        return `${((_a = item.item) == null ? void 0 : _a.generic_name) || item.item_id} x ${item.quantity}`;
      }).join(", ") || "-";
    }
    function patientName(patient) {
      return patient.full_name || [patient.first_name, patient.middle_name, patient.last_name].filter(Boolean).join(" ");
    }
    function optional(value) {
      const trimmed = value.trim();
      return trimmed === "" ? void 0 : trimmed;
    }
    function stringifyNumber(value) {
      return value === void 0 || value === null ? "" : String(value);
    }
    function formatDate(value) {
      if (!value) {
        return "-";
      }
      return new Intl.DateTimeFormat("en-PH", { year: "numeric", month: "short", day: "2-digit" }).format(new Date(value));
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
    function formatMoney(value) {
      return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(Number(value != null ? value : 0));
    }
    watch(() => pharmacyForm.item_id, (itemId) => {
      const item = inventory.value.find((inventoryItem) => String(inventoryItem.id) === String(itemId));
      if (item) {
        pharmacyForm.unit_price = Number(item.selling_price);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c;
      const _component_PageHeader = _sfc_main$1;
      const _component_BaseButton = _sfc_main$2;
      const _component_LoadingState = _sfc_main$1$1;
      const _component_StatusBadge = _sfc_main$3;
      const _component_FormField = _sfc_main$4;
      const _component_BaseInput = _sfc_main$5;
      const _component_EmptyState = _sfc_main$6;
      const _component_BaseDialog = _sfc_main$7;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))} data-v-8acd56f2>`);
      _push(ssrRenderComponent(_component_PageHeader, {
        eyebrow: "Encounter",
        title: summaryData.value ? `${summaryData.value.encounter.encounter_type} visit` : "Encounter",
        description: summaryData.value ? `${patientName(summaryData.value.patient)} \u2022 ${formatDateTime(summaryData.value.encounter.encounter_date || summaryData.value.encounter.created_at)}` : "Clinical notes and linked orders."
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_BaseButton, {
              variant: "outline",
              to: `/${tenant.value}/patients/${patientId.value}`
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Patient chart`);
                } else {
                  return [
                    createTextVNode("Patient chart")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (canSign.value) {
              _push2(ssrRenderComponent(_component_BaseButton, {
                icon: unref(CheckCircle2),
                loading: saving.value,
                onClick: signCurrentEncounter
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Sign encounter `);
                  } else {
                    return [
                      createTextVNode(" Sign encounter ")
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
                to: `/${tenant.value}/patients/${patientId.value}`
              }, {
                default: withCtx(() => [
                  createTextVNode("Patient chart")
                ]),
                _: 1
              }, 8, ["to"]),
              canSign.value ? (openBlock(), createBlock(_component_BaseButton, {
                key: 0,
                icon: unref(CheckCircle2),
                loading: saving.value,
                onClick: signCurrentEncounter
              }, {
                default: withCtx(() => [
                  createTextVNode(" Sign encounter ")
                ]),
                _: 1
              }, 8, ["icon", "loading"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (successMessage.value) {
        _push(`<div class="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800" data-v-8acd56f2>${ssrInterpolate(successMessage.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (visibleError.value) {
        _push(`<div class="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive" data-v-8acd56f2>${ssrInterpolate(visibleError.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (loading.value) {
        _push(ssrRenderComponent(_component_LoadingState, { rows: 6 }, null, _parent));
      } else if (summaryData.value) {
        _push(`<!--[--><section class="grid gap-4 lg:grid-cols-[1fr_20rem]" data-v-8acd56f2><article class="rounded-xl border border-border bg-card p-5 shadow-sm" data-v-8acd56f2><div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between" data-v-8acd56f2><div data-v-8acd56f2><div class="flex flex-wrap items-center gap-2" data-v-8acd56f2><h2 class="text-lg font-bold text-foreground" data-v-8acd56f2>${ssrInterpolate(patientName(summaryData.value.patient))}</h2>`);
        _push(ssrRenderComponent(_component_StatusBadge, {
          status: summaryData.value.encounter.status
        }, null, _parent));
        _push(`</div><p class="mt-1 text-sm text-muted-foreground" data-v-8acd56f2>${ssrInterpolate(summaryData.value.patient.patient_code)} \u2022 ${ssrInterpolate(summaryData.value.patient.gender)} \u2022 ${ssrInterpolate(formatDate(summaryData.value.patient.dob))}</p></div><div class="text-sm text-muted-foreground" data-v-8acd56f2><p data-v-8acd56f2>Clinician: ${ssrInterpolate(((_a = summaryData.value.clinician) == null ? void 0 : _a.name) || "-")}</p><p data-v-8acd56f2>Signed: ${ssrInterpolate(formatDateTime(summaryData.value.encounter.signed_at))}</p></div></div></article><article class="rounded-xl border border-border bg-card p-5 shadow-sm" data-v-8acd56f2><p class="text-sm font-bold text-foreground" data-v-8acd56f2>Orders linked</p><dl class="mt-4 grid grid-cols-2 gap-3 text-sm" data-v-8acd56f2><!--[-->`);
        ssrRenderList(orderMetrics.value, (metric) => {
          _push(`<div class="rounded-lg bg-muted/50 p-3" data-v-8acd56f2><dt class="text-xs font-bold uppercase tracking-wide text-muted-foreground" data-v-8acd56f2>${ssrInterpolate(metric.label)}</dt><dd class="mt-1 text-lg font-bold text-foreground" data-v-8acd56f2>${ssrInterpolate(metric.value)}</dd></div>`);
        });
        _push(`<!--]--></dl></article></section><section class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]" data-v-8acd56f2><form class="space-y-5 rounded-xl border border-border bg-card p-5 shadow-sm" data-v-8acd56f2><div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" data-v-8acd56f2><div data-v-8acd56f2><h2 class="text-lg font-bold text-foreground" data-v-8acd56f2>SOAP note</h2><p class="text-sm text-muted-foreground" data-v-8acd56f2>${ssrInterpolate(isReadOnly.value ? "Signed encounters are read-only." : "Capture the clinical note before signing.")}</p></div>`);
        if (canUpdate.value) {
          _push(ssrRenderComponent(_component_BaseButton, {
            type: "submit",
            loading: saving.value,
            icon: unref(Save)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Save note`);
              } else {
                return [
                  createTextVNode("Save note")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div><fieldset${ssrIncludeBooleanAttr(isReadOnly.value) ? " disabled" : ""} class="space-y-5 disabled:opacity-70" data-v-8acd56f2>`);
        _push(ssrRenderComponent(_component_FormField, {
          id: "chief_complaint",
          label: "Chief complaint",
          errors: fieldErrors("chief_complaint")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<textarea id="chief_complaint" rows="3" class="field-input min-h-24" data-v-8acd56f2${_scopeId}>${ssrInterpolate(soapForm.chief_complaint)}</textarea>`);
            } else {
              return [
                withDirectives(createVNode("textarea", {
                  id: "chief_complaint",
                  "onUpdate:modelValue": ($event) => soapForm.chief_complaint = $event,
                  rows: "3",
                  class: "field-input min-h-24"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, soapForm.chief_complaint]
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_FormField, {
          id: "history_of_present_illness",
          label: "History of present illness",
          errors: fieldErrors("history_of_present_illness")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<textarea id="history_of_present_illness" rows="4" class="field-input min-h-28" data-v-8acd56f2${_scopeId}>${ssrInterpolate(soapForm.history_of_present_illness)}</textarea>`);
            } else {
              return [
                withDirectives(createVNode("textarea", {
                  id: "history_of_present_illness",
                  "onUpdate:modelValue": ($event) => soapForm.history_of_present_illness = $event,
                  rows: "4",
                  class: "field-input min-h-28"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, soapForm.history_of_present_illness]
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="grid gap-4 md:grid-cols-3" data-v-8acd56f2>`);
        _push(ssrRenderComponent(_component_FormField, {
          id: "bp",
          label: "BP"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_BaseInput, {
                id: "bp",
                modelValue: soapForm.bp,
                "onUpdate:modelValue": ($event) => soapForm.bp = $event,
                placeholder: "120/80"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_BaseInput, {
                  id: "bp",
                  modelValue: soapForm.bp,
                  "onUpdate:modelValue": ($event) => soapForm.bp = $event,
                  placeholder: "120/80"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_FormField, {
          id: "hr",
          label: "HR"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_BaseInput, {
                id: "hr",
                modelValue: soapForm.hr,
                "onUpdate:modelValue": ($event) => soapForm.hr = $event,
                type: "number"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_BaseInput, {
                  id: "hr",
                  modelValue: soapForm.hr,
                  "onUpdate:modelValue": ($event) => soapForm.hr = $event,
                  type: "number"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_FormField, {
          id: "rr",
          label: "RR"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_BaseInput, {
                id: "rr",
                modelValue: soapForm.rr,
                "onUpdate:modelValue": ($event) => soapForm.rr = $event,
                type: "number"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_BaseInput, {
                  id: "rr",
                  modelValue: soapForm.rr,
                  "onUpdate:modelValue": ($event) => soapForm.rr = $event,
                  type: "number"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_FormField, {
          id: "temp",
          label: "Temp"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_BaseInput, {
                id: "temp",
                modelValue: soapForm.temp,
                "onUpdate:modelValue": ($event) => soapForm.temp = $event,
                type: "number",
                step: "0.1"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_BaseInput, {
                  id: "temp",
                  modelValue: soapForm.temp,
                  "onUpdate:modelValue": ($event) => soapForm.temp = $event,
                  type: "number",
                  step: "0.1"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_FormField, {
          id: "o2sat",
          label: "O2 sat"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_BaseInput, {
                id: "o2sat",
                modelValue: soapForm.o2sat,
                "onUpdate:modelValue": ($event) => soapForm.o2sat = $event,
                type: "number"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_BaseInput, {
                  id: "o2sat",
                  modelValue: soapForm.o2sat,
                  "onUpdate:modelValue": ($event) => soapForm.o2sat = $event,
                  type: "number"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_FormField, {
          id: "weight",
          label: "Weight"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_BaseInput, {
                id: "weight",
                modelValue: soapForm.weight,
                "onUpdate:modelValue": ($event) => soapForm.weight = $event,
                type: "number",
                step: "0.1"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_BaseInput, {
                  id: "weight",
                  modelValue: soapForm.weight,
                  "onUpdate:modelValue": ($event) => soapForm.weight = $event,
                  type: "number",
                  step: "0.1"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        _push(ssrRenderComponent(_component_FormField, {
          id: "physical_examination",
          label: "Objective / physical examination",
          errors: fieldErrors("physical_examination")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<textarea id="physical_examination" rows="4" class="field-input min-h-28" data-v-8acd56f2${_scopeId}>${ssrInterpolate(soapForm.physical_examination)}</textarea>`);
            } else {
              return [
                withDirectives(createVNode("textarea", {
                  id: "physical_examination",
                  "onUpdate:modelValue": ($event) => soapForm.physical_examination = $event,
                  rows: "4",
                  class: "field-input min-h-28"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, soapForm.physical_examination]
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_FormField, {
          id: "review_of_systems",
          label: "Review of systems",
          errors: fieldErrors("review_of_systems")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<textarea id="review_of_systems" rows="3" class="field-input min-h-24" data-v-8acd56f2${_scopeId}>${ssrInterpolate(soapForm.review_of_systems)}</textarea>`);
            } else {
              return [
                withDirectives(createVNode("textarea", {
                  id: "review_of_systems",
                  "onUpdate:modelValue": ($event) => soapForm.review_of_systems = $event,
                  rows: "3",
                  class: "field-input min-h-24"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, soapForm.review_of_systems]
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_FormField, {
          id: "diagnosis",
          label: "Assessment / diagnosis",
          errors: fieldErrors("assessment")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<textarea id="diagnosis" rows="3" class="field-input min-h-24" data-v-8acd56f2${_scopeId}>${ssrInterpolate(soapForm.diagnosis)}</textarea>`);
            } else {
              return [
                withDirectives(createVNode("textarea", {
                  id: "diagnosis",
                  "onUpdate:modelValue": ($event) => soapForm.diagnosis = $event,
                  rows: "3",
                  class: "field-input min-h-24"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, soapForm.diagnosis]
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_FormField, {
          id: "medications",
          label: "Plan / medications",
          helper: "One medication or instruction per line.",
          errors: fieldErrors("plan")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<textarea id="medications" rows="4" class="field-input min-h-28" data-v-8acd56f2${_scopeId}>${ssrInterpolate(soapForm.medications)}</textarea>`);
            } else {
              return [
                withDirectives(createVNode("textarea", {
                  id: "medications",
                  "onUpdate:modelValue": ($event) => soapForm.medications = $event,
                  rows: "4",
                  class: "field-input min-h-28"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [vModelText, soapForm.medications]
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</fieldset></form><aside class="space-y-4" data-v-8acd56f2><article class="rounded-xl border border-border bg-card p-5 shadow-sm" data-v-8acd56f2><h2 class="text-base font-bold text-foreground" data-v-8acd56f2>Quick orders</h2><p class="mt-1 text-sm text-muted-foreground" data-v-8acd56f2>${ssrInterpolate(isReadOnly.value ? "Orders are locked after signing from this screen." : "Create linked orders without leaving the encounter.")}</p><div class="mt-4 grid gap-2" data-v-8acd56f2>`);
        if (canCreateLab.value) {
          _push(ssrRenderComponent(_component_BaseButton, {
            variant: "outline",
            block: "",
            icon: unref(TestTube2),
            onClick: ($event) => openOrder("lab")
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Lab request`);
              } else {
                return [
                  createTextVNode("Lab request")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (canCreateImaging.value) {
          _push(ssrRenderComponent(_component_BaseButton, {
            variant: "outline",
            block: "",
            icon: unref(Image),
            onClick: ($event) => openOrder("imaging")
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Imaging request`);
              } else {
                return [
                  createTextVNode("Imaging request")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (canCreatePharmacy.value) {
          _push(ssrRenderComponent(_component_BaseButton, {
            variant: "outline",
            block: "",
            icon: unref(Pill),
            onClick: ($event) => openOrder("pharmacy")
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Dispense medication`);
              } else {
                return [
                  createTextVNode("Dispense medication")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (canCreateBilling.value) {
          _push(ssrRenderComponent(_component_BaseButton, {
            variant: "outline",
            block: "",
            icon: unref(CreditCard),
            onClick: ($event) => openOrder("billing")
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Billing transaction`);
              } else {
                return [
                  createTextVNode("Billing transaction")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (canCreateRecord.value) {
          _push(ssrRenderComponent(_component_BaseButton, {
            variant: "outline",
            block: "",
            icon: unref(FileText),
            onClick: ($event) => openOrder("record")
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Medical record`);
              } else {
                return [
                  createTextVNode("Medical record")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (isReadOnly.value) {
          _push(`<p class="text-sm text-muted-foreground" data-v-8acd56f2>Signed encounter controls are read-only.</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></article><article class="rounded-xl border border-border bg-card p-5 shadow-sm" data-v-8acd56f2><h2 class="text-base font-bold text-foreground" data-v-8acd56f2>Patient flags</h2><div class="mt-3 space-y-3 text-sm" data-v-8acd56f2><p data-v-8acd56f2><span class="font-semibold" data-v-8acd56f2>Allergies:</span> ${ssrInterpolate(((_b = summaryData.value.patient.allergies) == null ? void 0 : _b.join(", ")) || "-")}</p><p data-v-8acd56f2><span class="font-semibold" data-v-8acd56f2>Conditions:</span> ${ssrInterpolate(((_c = summaryData.value.patient.chronic_conditions) == null ? void 0 : _c.join(", ")) || "-")}</p><p data-v-8acd56f2><span class="font-semibold" data-v-8acd56f2>Contact:</span> ${ssrInterpolate(summaryData.value.patient.contact_number || "-")}</p></div></article></aside></section><section class="space-y-4" data-v-8acd56f2><div data-v-8acd56f2><h2 class="text-lg font-bold text-foreground" data-v-8acd56f2>Linked activity</h2><p class="text-sm text-muted-foreground" data-v-8acd56f2>Orders and documents tied to this encounter.</p></div><div class="grid gap-4 xl:grid-cols-2" data-v-8acd56f2>`);
        _push(ssrRenderComponent(unref(LinkedPanel), {
          title: "Lab",
          items: summaryData.value.lab_requests,
          empty: "No lab requests"
        }, {
          default: withCtx(({ item }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<p class="font-semibold" data-v-8acd56f2${_scopeId}>${ssrInterpolate(panelNames(item.test_panels))}</p><p class="text-sm text-muted-foreground" data-v-8acd56f2${_scopeId}>${ssrInterpolate(item.priority)} \u2022 ${ssrInterpolate(item.status)}</p>`);
            } else {
              return [
                createVNode("p", { class: "font-semibold" }, toDisplayString(panelNames(item.test_panels)), 1),
                createVNode("p", { class: "text-sm text-muted-foreground" }, toDisplayString(item.priority) + " \u2022 " + toDisplayString(item.status), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(LinkedPanel), {
          title: "Imaging",
          items: summaryData.value.imaging_requests,
          empty: "No imaging requests"
        }, {
          default: withCtx(({ item }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<p class="font-semibold" data-v-8acd56f2${_scopeId}>${ssrInterpolate(item.modality)} ${ssrInterpolate(item.body_part || "")}</p><p class="text-sm text-muted-foreground" data-v-8acd56f2${_scopeId}>${ssrInterpolate(item.priority)} \u2022 ${ssrInterpolate(item.status)}</p>`);
            } else {
              return [
                createVNode("p", { class: "font-semibold" }, toDisplayString(item.modality) + " " + toDisplayString(item.body_part || ""), 1),
                createVNode("p", { class: "text-sm text-muted-foreground" }, toDisplayString(item.priority) + " \u2022 " + toDisplayString(item.status), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(LinkedPanel), {
          title: "Pharmacy",
          items: summaryData.value.pharmacy_transactions,
          empty: "No pharmacy transactions"
        }, {
          default: withCtx(({ item }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<p class="font-semibold" data-v-8acd56f2${_scopeId}>${ssrInterpolate(itemSummary(item.items))}</p><p class="text-sm text-muted-foreground" data-v-8acd56f2${_scopeId}>${ssrInterpolate(item.transaction_type)} \u2022 ${ssrInterpolate(formatMoney(item.total_amount))}</p>`);
            } else {
              return [
                createVNode("p", { class: "font-semibold" }, toDisplayString(itemSummary(item.items)), 1),
                createVNode("p", { class: "text-sm text-muted-foreground" }, toDisplayString(item.transaction_type) + " \u2022 " + toDisplayString(formatMoney(item.total_amount)), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(LinkedPanel), {
          title: "Billing",
          items: summaryData.value.billing_transactions,
          empty: "No billing transactions"
        }, {
          default: withCtx(({ item }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<p class="font-semibold" data-v-8acd56f2${_scopeId}>${ssrInterpolate(item.transaction_number)}</p><p class="text-sm text-muted-foreground" data-v-8acd56f2${_scopeId}>${ssrInterpolate(item.status)} \u2022 ${ssrInterpolate(formatMoney(item.grand_total))}</p>`);
            } else {
              return [
                createVNode("p", { class: "font-semibold" }, toDisplayString(item.transaction_number), 1),
                createVNode("p", { class: "text-sm text-muted-foreground" }, toDisplayString(item.status) + " \u2022 " + toDisplayString(formatMoney(item.grand_total)), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(LinkedPanel), {
          title: "Records",
          items: summaryData.value.medical_records,
          empty: "No medical records"
        }, {
          default: withCtx(({ item }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<p class="font-semibold" data-v-8acd56f2${_scopeId}>${ssrInterpolate(item.file_name || item.record_type)}</p><p class="text-sm text-muted-foreground" data-v-8acd56f2${_scopeId}>${ssrInterpolate(item.record_type)} \u2022 ${ssrInterpolate(item.is_released ? "Released" : "Unreleased")}</p>`);
            } else {
              return [
                createVNode("p", { class: "font-semibold" }, toDisplayString(item.file_name || item.record_type), 1),
                createVNode("p", { class: "text-sm text-muted-foreground" }, toDisplayString(item.record_type) + " \u2022 " + toDisplayString(item.is_released ? "Released" : "Unreleased"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></section><!--]-->`);
      } else {
        _push(ssrRenderComponent(_component_EmptyState, {
          title: "Encounter not found",
          description: "The encounter could not be loaded for this clinic."
        }, null, _parent));
      }
      _push(ssrRenderComponent(_component_BaseDialog, {
        open: showOrderDialog.value,
        "onUpdate:open": ($event) => showOrderDialog.value = $event,
        title: orderTitle.value,
        description: orderDescription.value
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form class="space-y-4 p-5" data-v-8acd56f2${_scopeId}>`);
            if (localOrderError.value) {
              _push2(`<div class="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive" data-v-8acd56f2${_scopeId}>${ssrInterpolate(localOrderError.value)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (activeOrder.value === "lab") {
              _push2(`<!--[-->`);
              _push2(ssrRenderComponent(_component_FormField, {
                id: "lab_test",
                label: "Test name"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_BaseInput, {
                      id: "lab_test",
                      modelValue: labForm.testName,
                      "onUpdate:modelValue": ($event) => labForm.testName = $event,
                      required: ""
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_BaseInput, {
                        id: "lab_test",
                        modelValue: labForm.testName,
                        "onUpdate:modelValue": ($event) => labForm.testName = $event,
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_FormField, {
                id: "lab_priority",
                label: "Priority"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<select id="lab_priority" class="field-input" data-v-8acd56f2${_scopeId2}><option value="ROUTINE" data-v-8acd56f2${ssrIncludeBooleanAttr(Array.isArray(labForm.priority) ? ssrLooseContain(labForm.priority, "ROUTINE") : ssrLooseEqual(labForm.priority, "ROUTINE")) ? " selected" : ""}${_scopeId2}>Routine</option><option value="URGENT" data-v-8acd56f2${ssrIncludeBooleanAttr(Array.isArray(labForm.priority) ? ssrLooseContain(labForm.priority, "URGENT") : ssrLooseEqual(labForm.priority, "URGENT")) ? " selected" : ""}${_scopeId2}>Urgent</option><option value="STAT" data-v-8acd56f2${ssrIncludeBooleanAttr(Array.isArray(labForm.priority) ? ssrLooseContain(labForm.priority, "STAT") : ssrLooseEqual(labForm.priority, "STAT")) ? " selected" : ""}${_scopeId2}>STAT</option></select>`);
                  } else {
                    return [
                      withDirectives(createVNode("select", {
                        id: "lab_priority",
                        "onUpdate:modelValue": ($event) => labForm.priority = $event,
                        class: "field-input"
                      }, [
                        createVNode("option", { value: "ROUTINE" }, "Routine"),
                        createVNode("option", { value: "URGENT" }, "Urgent"),
                        createVNode("option", { value: "STAT" }, "STAT")
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, labForm.priority]
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_FormField, {
                id: "specimen_type",
                label: "Specimen"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_BaseInput, {
                      id: "specimen_type",
                      modelValue: labForm.specimen_type,
                      "onUpdate:modelValue": ($event) => labForm.specimen_type = $event
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_BaseInput, {
                        id: "specimen_type",
                        modelValue: labForm.specimen_type,
                        "onUpdate:modelValue": ($event) => labForm.specimen_type = $event
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<!--]-->`);
            } else if (activeOrder.value === "imaging") {
              _push2(`<!--[-->`);
              _push2(ssrRenderComponent(_component_FormField, {
                id: "modality",
                label: "Modality"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<select id="modality" class="field-input" data-v-8acd56f2${_scopeId2}><option value="XRAY" data-v-8acd56f2${ssrIncludeBooleanAttr(Array.isArray(imagingForm.modality) ? ssrLooseContain(imagingForm.modality, "XRAY") : ssrLooseEqual(imagingForm.modality, "XRAY")) ? " selected" : ""}${_scopeId2}>X-ray</option><option value="ULTRASOUND" data-v-8acd56f2${ssrIncludeBooleanAttr(Array.isArray(imagingForm.modality) ? ssrLooseContain(imagingForm.modality, "ULTRASOUND") : ssrLooseEqual(imagingForm.modality, "ULTRASOUND")) ? " selected" : ""}${_scopeId2}>Ultrasound</option><option value="CT" data-v-8acd56f2${ssrIncludeBooleanAttr(Array.isArray(imagingForm.modality) ? ssrLooseContain(imagingForm.modality, "CT") : ssrLooseEqual(imagingForm.modality, "CT")) ? " selected" : ""}${_scopeId2}>CT</option><option value="MRI" data-v-8acd56f2${ssrIncludeBooleanAttr(Array.isArray(imagingForm.modality) ? ssrLooseContain(imagingForm.modality, "MRI") : ssrLooseEqual(imagingForm.modality, "MRI")) ? " selected" : ""}${_scopeId2}>MRI</option><option value="ECG" data-v-8acd56f2${ssrIncludeBooleanAttr(Array.isArray(imagingForm.modality) ? ssrLooseContain(imagingForm.modality, "ECG") : ssrLooseEqual(imagingForm.modality, "ECG")) ? " selected" : ""}${_scopeId2}>ECG</option><option value="ECHO" data-v-8acd56f2${ssrIncludeBooleanAttr(Array.isArray(imagingForm.modality) ? ssrLooseContain(imagingForm.modality, "ECHO") : ssrLooseEqual(imagingForm.modality, "ECHO")) ? " selected" : ""}${_scopeId2}>Echo</option></select>`);
                  } else {
                    return [
                      withDirectives(createVNode("select", {
                        id: "modality",
                        "onUpdate:modelValue": ($event) => imagingForm.modality = $event,
                        class: "field-input"
                      }, [
                        createVNode("option", { value: "XRAY" }, "X-ray"),
                        createVNode("option", { value: "ULTRASOUND" }, "Ultrasound"),
                        createVNode("option", { value: "CT" }, "CT"),
                        createVNode("option", { value: "MRI" }, "MRI"),
                        createVNode("option", { value: "ECG" }, "ECG"),
                        createVNode("option", { value: "ECHO" }, "Echo")
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, imagingForm.modality]
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_FormField, {
                id: "body_part",
                label: "Body part"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_BaseInput, {
                      id: "body_part",
                      modelValue: imagingForm.body_part,
                      "onUpdate:modelValue": ($event) => imagingForm.body_part = $event,
                      required: ""
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_BaseInput, {
                        id: "body_part",
                        modelValue: imagingForm.body_part,
                        "onUpdate:modelValue": ($event) => imagingForm.body_part = $event,
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_FormField, {
                id: "clinical_indication",
                label: "Clinical indication"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<textarea id="clinical_indication" rows="3" class="field-input min-h-24" data-v-8acd56f2${_scopeId2}>${ssrInterpolate(imagingForm.clinical_indication)}</textarea>`);
                  } else {
                    return [
                      withDirectives(createVNode("textarea", {
                        id: "clinical_indication",
                        "onUpdate:modelValue": ($event) => imagingForm.clinical_indication = $event,
                        rows: "3",
                        class: "field-input min-h-24"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, imagingForm.clinical_indication]
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<!--]-->`);
            } else if (activeOrder.value === "pharmacy") {
              _push2(`<!--[-->`);
              _push2(ssrRenderComponent(_component_FormField, {
                id: "item_id",
                label: "Medication"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<select id="item_id" class="field-input" required data-v-8acd56f2${_scopeId2}><option value="" data-v-8acd56f2${ssrIncludeBooleanAttr(Array.isArray(pharmacyForm.item_id) ? ssrLooseContain(pharmacyForm.item_id, "") : ssrLooseEqual(pharmacyForm.item_id, "")) ? " selected" : ""}${_scopeId2}>Select item</option><!--[-->`);
                    ssrRenderList(inventory.value, (item) => {
                      _push3(`<option${ssrRenderAttr("value", item.id)} data-v-8acd56f2${ssrIncludeBooleanAttr(Array.isArray(pharmacyForm.item_id) ? ssrLooseContain(pharmacyForm.item_id, item.id) : ssrLooseEqual(pharmacyForm.item_id, item.id)) ? " selected" : ""}${_scopeId2}>${ssrInterpolate(item.generic_name)} ${ssrInterpolate(item.strength)} (${ssrInterpolate(item.current_stock)} left) </option>`);
                    });
                    _push3(`<!--]--></select>`);
                  } else {
                    return [
                      withDirectives(createVNode("select", {
                        id: "item_id",
                        "onUpdate:modelValue": ($event) => pharmacyForm.item_id = $event,
                        class: "field-input",
                        required: ""
                      }, [
                        createVNode("option", { value: "" }, "Select item"),
                        (openBlock(true), createBlock(Fragment, null, renderList(inventory.value, (item) => {
                          return openBlock(), createBlock("option", {
                            key: item.id,
                            value: item.id
                          }, toDisplayString(item.generic_name) + " " + toDisplayString(item.strength) + " (" + toDisplayString(item.current_stock) + " left) ", 9, ["value"]);
                        }), 128))
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, pharmacyForm.item_id]
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<div class="grid gap-4 md:grid-cols-2" data-v-8acd56f2${_scopeId}>`);
              _push2(ssrRenderComponent(_component_FormField, {
                id: "quantity",
                label: "Quantity"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_BaseInput, {
                      id: "quantity",
                      modelValue: pharmacyForm.quantity,
                      "onUpdate:modelValue": ($event) => pharmacyForm.quantity = $event,
                      type: "number",
                      min: "1",
                      required: ""
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_BaseInput, {
                        id: "quantity",
                        modelValue: pharmacyForm.quantity,
                        "onUpdate:modelValue": ($event) => pharmacyForm.quantity = $event,
                        type: "number",
                        min: "1",
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_FormField, {
                id: "unit_price",
                label: "Unit price"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_BaseInput, {
                      id: "unit_price",
                      modelValue: pharmacyForm.unit_price,
                      "onUpdate:modelValue": ($event) => pharmacyForm.unit_price = $event,
                      type: "number",
                      min: "0",
                      step: "0.01",
                      required: ""
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_BaseInput, {
                        id: "unit_price",
                        modelValue: pharmacyForm.unit_price,
                        "onUpdate:modelValue": ($event) => pharmacyForm.unit_price = $event,
                        type: "number",
                        min: "0",
                        step: "0.01",
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
              _push2(ssrRenderComponent(_component_FormField, {
                id: "pharmacy_notes",
                label: "Notes"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<textarea id="pharmacy_notes" rows="3" class="field-input min-h-24" data-v-8acd56f2${_scopeId2}>${ssrInterpolate(pharmacyForm.notes)}</textarea>`);
                  } else {
                    return [
                      withDirectives(createVNode("textarea", {
                        id: "pharmacy_notes",
                        "onUpdate:modelValue": ($event) => pharmacyForm.notes = $event,
                        rows: "3",
                        class: "field-input min-h-24"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, pharmacyForm.notes]
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<!--]-->`);
            } else if (activeOrder.value === "billing") {
              _push2(`<!--[-->`);
              _push2(ssrRenderComponent(_component_FormField, {
                id: "description",
                label: "Description"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_BaseInput, {
                      id: "description",
                      modelValue: billingForm.description,
                      "onUpdate:modelValue": ($event) => billingForm.description = $event,
                      required: ""
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_BaseInput, {
                        id: "description",
                        modelValue: billingForm.description,
                        "onUpdate:modelValue": ($event) => billingForm.description = $event,
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<div class="grid gap-4 md:grid-cols-2" data-v-8acd56f2${_scopeId}>`);
              _push2(ssrRenderComponent(_component_FormField, {
                id: "billing_quantity",
                label: "Quantity"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_BaseInput, {
                      id: "billing_quantity",
                      modelValue: billingForm.quantity,
                      "onUpdate:modelValue": ($event) => billingForm.quantity = $event,
                      type: "number",
                      min: "1",
                      required: ""
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_BaseInput, {
                        id: "billing_quantity",
                        modelValue: billingForm.quantity,
                        "onUpdate:modelValue": ($event) => billingForm.quantity = $event,
                        type: "number",
                        min: "1",
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_FormField, {
                id: "billing_unit_price",
                label: "Unit price"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_BaseInput, {
                      id: "billing_unit_price",
                      modelValue: billingForm.unit_price,
                      "onUpdate:modelValue": ($event) => billingForm.unit_price = $event,
                      type: "number",
                      min: "0",
                      step: "0.01",
                      required: ""
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_BaseInput, {
                        id: "billing_unit_price",
                        modelValue: billingForm.unit_price,
                        "onUpdate:modelValue": ($event) => billingForm.unit_price = $event,
                        type: "number",
                        min: "0",
                        step: "0.01",
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
              _push2(ssrRenderComponent(_component_FormField, {
                id: "payment_mode",
                label: "Payment mode"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<select id="payment_mode" class="field-input" data-v-8acd56f2${_scopeId2}><option value="CASH" data-v-8acd56f2${ssrIncludeBooleanAttr(Array.isArray(billingForm.payment_mode) ? ssrLooseContain(billingForm.payment_mode, "CASH") : ssrLooseEqual(billingForm.payment_mode, "CASH")) ? " selected" : ""}${_scopeId2}>Cash</option><option value="CARD" data-v-8acd56f2${ssrIncludeBooleanAttr(Array.isArray(billingForm.payment_mode) ? ssrLooseContain(billingForm.payment_mode, "CARD") : ssrLooseEqual(billingForm.payment_mode, "CARD")) ? " selected" : ""}${_scopeId2}>Card</option><option value="GCASH" data-v-8acd56f2${ssrIncludeBooleanAttr(Array.isArray(billingForm.payment_mode) ? ssrLooseContain(billingForm.payment_mode, "GCASH") : ssrLooseEqual(billingForm.payment_mode, "GCASH")) ? " selected" : ""}${_scopeId2}>GCash</option><option value="MAYA" data-v-8acd56f2${ssrIncludeBooleanAttr(Array.isArray(billingForm.payment_mode) ? ssrLooseContain(billingForm.payment_mode, "MAYA") : ssrLooseEqual(billingForm.payment_mode, "MAYA")) ? " selected" : ""}${_scopeId2}>Maya</option><option value="PHILHEALTH" data-v-8acd56f2${ssrIncludeBooleanAttr(Array.isArray(billingForm.payment_mode) ? ssrLooseContain(billingForm.payment_mode, "PHILHEALTH") : ssrLooseEqual(billingForm.payment_mode, "PHILHEALTH")) ? " selected" : ""}${_scopeId2}>PhilHealth</option><option value="HMO" data-v-8acd56f2${ssrIncludeBooleanAttr(Array.isArray(billingForm.payment_mode) ? ssrLooseContain(billingForm.payment_mode, "HMO") : ssrLooseEqual(billingForm.payment_mode, "HMO")) ? " selected" : ""}${_scopeId2}>HMO</option></select>`);
                  } else {
                    return [
                      withDirectives(createVNode("select", {
                        id: "payment_mode",
                        "onUpdate:modelValue": ($event) => billingForm.payment_mode = $event,
                        class: "field-input"
                      }, [
                        createVNode("option", { value: "CASH" }, "Cash"),
                        createVNode("option", { value: "CARD" }, "Card"),
                        createVNode("option", { value: "GCASH" }, "GCash"),
                        createVNode("option", { value: "MAYA" }, "Maya"),
                        createVNode("option", { value: "PHILHEALTH" }, "PhilHealth"),
                        createVNode("option", { value: "HMO" }, "HMO")
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, billingForm.payment_mode]
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<!--]-->`);
            } else if (activeOrder.value === "record") {
              _push2(`<!--[-->`);
              _push2(ssrRenderComponent(_component_FormField, {
                id: "record_type",
                label: "Record type"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<select id="record_type" class="field-input" data-v-8acd56f2${_scopeId2}><option value="ENCOUNTER" data-v-8acd56f2${ssrIncludeBooleanAttr(Array.isArray(recordForm.record_type) ? ssrLooseContain(recordForm.record_type, "ENCOUNTER") : ssrLooseEqual(recordForm.record_type, "ENCOUNTER")) ? " selected" : ""}${_scopeId2}>Encounter</option><option value="LAB" data-v-8acd56f2${ssrIncludeBooleanAttr(Array.isArray(recordForm.record_type) ? ssrLooseContain(recordForm.record_type, "LAB") : ssrLooseEqual(recordForm.record_type, "LAB")) ? " selected" : ""}${_scopeId2}>Lab</option><option value="IMAGING" data-v-8acd56f2${ssrIncludeBooleanAttr(Array.isArray(recordForm.record_type) ? ssrLooseContain(recordForm.record_type, "IMAGING") : ssrLooseEqual(recordForm.record_type, "IMAGING")) ? " selected" : ""}${_scopeId2}>Imaging</option><option value="PRESCRIPTION" data-v-8acd56f2${ssrIncludeBooleanAttr(Array.isArray(recordForm.record_type) ? ssrLooseContain(recordForm.record_type, "PRESCRIPTION") : ssrLooseEqual(recordForm.record_type, "PRESCRIPTION")) ? " selected" : ""}${_scopeId2}>Prescription</option><option value="CERT" data-v-8acd56f2${ssrIncludeBooleanAttr(Array.isArray(recordForm.record_type) ? ssrLooseContain(recordForm.record_type, "CERT") : ssrLooseEqual(recordForm.record_type, "CERT")) ? " selected" : ""}${_scopeId2}>Certificate</option><option value="REFERRAL" data-v-8acd56f2${ssrIncludeBooleanAttr(Array.isArray(recordForm.record_type) ? ssrLooseContain(recordForm.record_type, "REFERRAL") : ssrLooseEqual(recordForm.record_type, "REFERRAL")) ? " selected" : ""}${_scopeId2}>Referral</option></select>`);
                  } else {
                    return [
                      withDirectives(createVNode("select", {
                        id: "record_type",
                        "onUpdate:modelValue": ($event) => recordForm.record_type = $event,
                        class: "field-input"
                      }, [
                        createVNode("option", { value: "ENCOUNTER" }, "Encounter"),
                        createVNode("option", { value: "LAB" }, "Lab"),
                        createVNode("option", { value: "IMAGING" }, "Imaging"),
                        createVNode("option", { value: "PRESCRIPTION" }, "Prescription"),
                        createVNode("option", { value: "CERT" }, "Certificate"),
                        createVNode("option", { value: "REFERRAL" }, "Referral")
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, recordForm.record_type]
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_FormField, {
                id: "file_name",
                label: "File name"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_BaseInput, {
                      id: "file_name",
                      modelValue: recordForm.file_name,
                      "onUpdate:modelValue": ($event) => recordForm.file_name = $event
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_BaseInput, {
                        id: "file_name",
                        modelValue: recordForm.file_name,
                        "onUpdate:modelValue": ($event) => recordForm.file_name = $event
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_FormField, {
                id: "purpose",
                label: "Purpose"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<textarea id="purpose" rows="3" class="field-input min-h-24" data-v-8acd56f2${_scopeId2}>${ssrInterpolate(recordForm.purpose)}</textarea>`);
                  } else {
                    return [
                      withDirectives(createVNode("textarea", {
                        id: "purpose",
                        "onUpdate:modelValue": ($event) => recordForm.purpose = $event,
                        rows: "3",
                        class: "field-input min-h-24"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, recordForm.purpose]
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex justify-end gap-2 border-t border-border pt-4" data-v-8acd56f2${_scopeId}>`);
            _push2(ssrRenderComponent(_component_BaseButton, {
              type: "button",
              variant: "outline",
              onClick: ($event) => showOrderDialog.value = false
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
              loading: saving.value
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Create`);
                } else {
                  return [
                    createTextVNode("Create")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form>`);
          } else {
            return [
              createVNode("form", {
                class: "space-y-4 p-5",
                onSubmit: withModifiers(submitQuickOrder, ["prevent"])
              }, [
                localOrderError.value ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
                }, toDisplayString(localOrderError.value), 1)) : createCommentVNode("", true),
                activeOrder.value === "lab" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                  createVNode(_component_FormField, {
                    id: "lab_test",
                    label: "Test name"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_BaseInput, {
                        id: "lab_test",
                        modelValue: labForm.testName,
                        "onUpdate:modelValue": ($event) => labForm.testName = $event,
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_FormField, {
                    id: "lab_priority",
                    label: "Priority"
                  }, {
                    default: withCtx(() => [
                      withDirectives(createVNode("select", {
                        id: "lab_priority",
                        "onUpdate:modelValue": ($event) => labForm.priority = $event,
                        class: "field-input"
                      }, [
                        createVNode("option", { value: "ROUTINE" }, "Routine"),
                        createVNode("option", { value: "URGENT" }, "Urgent"),
                        createVNode("option", { value: "STAT" }, "STAT")
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, labForm.priority]
                      ])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_FormField, {
                    id: "specimen_type",
                    label: "Specimen"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_BaseInput, {
                        id: "specimen_type",
                        modelValue: labForm.specimen_type,
                        "onUpdate:modelValue": ($event) => labForm.specimen_type = $event
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  })
                ], 64)) : activeOrder.value === "imaging" ? (openBlock(), createBlock(Fragment, { key: 2 }, [
                  createVNode(_component_FormField, {
                    id: "modality",
                    label: "Modality"
                  }, {
                    default: withCtx(() => [
                      withDirectives(createVNode("select", {
                        id: "modality",
                        "onUpdate:modelValue": ($event) => imagingForm.modality = $event,
                        class: "field-input"
                      }, [
                        createVNode("option", { value: "XRAY" }, "X-ray"),
                        createVNode("option", { value: "ULTRASOUND" }, "Ultrasound"),
                        createVNode("option", { value: "CT" }, "CT"),
                        createVNode("option", { value: "MRI" }, "MRI"),
                        createVNode("option", { value: "ECG" }, "ECG"),
                        createVNode("option", { value: "ECHO" }, "Echo")
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, imagingForm.modality]
                      ])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_FormField, {
                    id: "body_part",
                    label: "Body part"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_BaseInput, {
                        id: "body_part",
                        modelValue: imagingForm.body_part,
                        "onUpdate:modelValue": ($event) => imagingForm.body_part = $event,
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_FormField, {
                    id: "clinical_indication",
                    label: "Clinical indication"
                  }, {
                    default: withCtx(() => [
                      withDirectives(createVNode("textarea", {
                        id: "clinical_indication",
                        "onUpdate:modelValue": ($event) => imagingForm.clinical_indication = $event,
                        rows: "3",
                        class: "field-input min-h-24"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, imagingForm.clinical_indication]
                      ])
                    ]),
                    _: 1
                  })
                ], 64)) : activeOrder.value === "pharmacy" ? (openBlock(), createBlock(Fragment, { key: 3 }, [
                  createVNode(_component_FormField, {
                    id: "item_id",
                    label: "Medication"
                  }, {
                    default: withCtx(() => [
                      withDirectives(createVNode("select", {
                        id: "item_id",
                        "onUpdate:modelValue": ($event) => pharmacyForm.item_id = $event,
                        class: "field-input",
                        required: ""
                      }, [
                        createVNode("option", { value: "" }, "Select item"),
                        (openBlock(true), createBlock(Fragment, null, renderList(inventory.value, (item) => {
                          return openBlock(), createBlock("option", {
                            key: item.id,
                            value: item.id
                          }, toDisplayString(item.generic_name) + " " + toDisplayString(item.strength) + " (" + toDisplayString(item.current_stock) + " left) ", 9, ["value"]);
                        }), 128))
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, pharmacyForm.item_id]
                      ])
                    ]),
                    _: 1
                  }),
                  createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                    createVNode(_component_FormField, {
                      id: "quantity",
                      label: "Quantity"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_BaseInput, {
                          id: "quantity",
                          modelValue: pharmacyForm.quantity,
                          "onUpdate:modelValue": ($event) => pharmacyForm.quantity = $event,
                          type: "number",
                          min: "1",
                          required: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_FormField, {
                      id: "unit_price",
                      label: "Unit price"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_BaseInput, {
                          id: "unit_price",
                          modelValue: pharmacyForm.unit_price,
                          "onUpdate:modelValue": ($event) => pharmacyForm.unit_price = $event,
                          type: "number",
                          min: "0",
                          step: "0.01",
                          required: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })
                  ]),
                  createVNode(_component_FormField, {
                    id: "pharmacy_notes",
                    label: "Notes"
                  }, {
                    default: withCtx(() => [
                      withDirectives(createVNode("textarea", {
                        id: "pharmacy_notes",
                        "onUpdate:modelValue": ($event) => pharmacyForm.notes = $event,
                        rows: "3",
                        class: "field-input min-h-24"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, pharmacyForm.notes]
                      ])
                    ]),
                    _: 1
                  })
                ], 64)) : activeOrder.value === "billing" ? (openBlock(), createBlock(Fragment, { key: 4 }, [
                  createVNode(_component_FormField, {
                    id: "description",
                    label: "Description"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_BaseInput, {
                        id: "description",
                        modelValue: billingForm.description,
                        "onUpdate:modelValue": ($event) => billingForm.description = $event,
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                    createVNode(_component_FormField, {
                      id: "billing_quantity",
                      label: "Quantity"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_BaseInput, {
                          id: "billing_quantity",
                          modelValue: billingForm.quantity,
                          "onUpdate:modelValue": ($event) => billingForm.quantity = $event,
                          type: "number",
                          min: "1",
                          required: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_FormField, {
                      id: "billing_unit_price",
                      label: "Unit price"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_BaseInput, {
                          id: "billing_unit_price",
                          modelValue: billingForm.unit_price,
                          "onUpdate:modelValue": ($event) => billingForm.unit_price = $event,
                          type: "number",
                          min: "0",
                          step: "0.01",
                          required: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })
                  ]),
                  createVNode(_component_FormField, {
                    id: "payment_mode",
                    label: "Payment mode"
                  }, {
                    default: withCtx(() => [
                      withDirectives(createVNode("select", {
                        id: "payment_mode",
                        "onUpdate:modelValue": ($event) => billingForm.payment_mode = $event,
                        class: "field-input"
                      }, [
                        createVNode("option", { value: "CASH" }, "Cash"),
                        createVNode("option", { value: "CARD" }, "Card"),
                        createVNode("option", { value: "GCASH" }, "GCash"),
                        createVNode("option", { value: "MAYA" }, "Maya"),
                        createVNode("option", { value: "PHILHEALTH" }, "PhilHealth"),
                        createVNode("option", { value: "HMO" }, "HMO")
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, billingForm.payment_mode]
                      ])
                    ]),
                    _: 1
                  })
                ], 64)) : activeOrder.value === "record" ? (openBlock(), createBlock(Fragment, { key: 5 }, [
                  createVNode(_component_FormField, {
                    id: "record_type",
                    label: "Record type"
                  }, {
                    default: withCtx(() => [
                      withDirectives(createVNode("select", {
                        id: "record_type",
                        "onUpdate:modelValue": ($event) => recordForm.record_type = $event,
                        class: "field-input"
                      }, [
                        createVNode("option", { value: "ENCOUNTER" }, "Encounter"),
                        createVNode("option", { value: "LAB" }, "Lab"),
                        createVNode("option", { value: "IMAGING" }, "Imaging"),
                        createVNode("option", { value: "PRESCRIPTION" }, "Prescription"),
                        createVNode("option", { value: "CERT" }, "Certificate"),
                        createVNode("option", { value: "REFERRAL" }, "Referral")
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, recordForm.record_type]
                      ])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_FormField, {
                    id: "file_name",
                    label: "File name"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_BaseInput, {
                        id: "file_name",
                        modelValue: recordForm.file_name,
                        "onUpdate:modelValue": ($event) => recordForm.file_name = $event
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_FormField, {
                    id: "purpose",
                    label: "Purpose"
                  }, {
                    default: withCtx(() => [
                      withDirectives(createVNode("textarea", {
                        id: "purpose",
                        "onUpdate:modelValue": ($event) => recordForm.purpose = $event,
                        rows: "3",
                        class: "field-input min-h-24"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, recordForm.purpose]
                      ])
                    ]),
                    _: 1
                  })
                ], 64)) : createCommentVNode("", true),
                createVNode("div", { class: "flex justify-end gap-2 border-t border-border pt-4" }, [
                  createVNode(_component_BaseButton, {
                    type: "button",
                    variant: "outline",
                    onClick: ($event) => showOrderDialog.value = false
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Cancel")
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  createVNode(_component_BaseButton, {
                    type: "submit",
                    loading: saving.value
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Create")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[tenant]/patients/[id]/encounters/[encId].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _encId_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8acd56f2"]]);

export { _encId_ as default };;globalThis.__timing__.logEnd('Load chunks/build/_encId_-96QI_D6J');
//# sourceMappingURL=_encId_-96QI_D6J.mjs.map

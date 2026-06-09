globalThis.__timing__.logStart('Load chunks/build/StatusBadge-CKDkR-Tg');import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';

const successStatuses = /* @__PURE__ */ new Set([
  "ACTIVE",
  "PAID",
  "COMPLETED",
  "RESULTED",
  "VALIDATED",
  "RELEASED",
  "CONFIRMED",
  "RESTOCK"
]);
const warningStatuses = /* @__PURE__ */ new Set([
  "PENDING",
  "PARTIAL",
  "REQUESTED",
  "COLLECTED",
  "IN_PROGRESS",
  "SCHEDULED",
  "URGENT",
  "DISPENSING",
  "ADJUSTMENT"
]);
const dangerStatuses = /* @__PURE__ */ new Set([
  "INACTIVE",
  "VOIDED",
  "REFUNDED",
  "CANCELLED",
  "NO_SHOW",
  "STAT",
  "WASTE"
]);
const infoStatuses = /* @__PURE__ */ new Set([
  "CHECKED_IN",
  "ROUTINE",
  "RETURN"
]);
function normalizeStatus(value) {
  if (typeof value === "boolean") {
    return value ? "Active" : "Inactive";
  }
  if (!value) {
    return "Unknown";
  }
  return String(value).replace(/[_-]+/g, " ").trim().replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}
function getStatusTone(value) {
  const key = typeof value === "boolean" ? value ? "ACTIVE" : "INACTIVE" : String(value != null ? value : "").trim().toUpperCase();
  if (successStatuses.has(key)) {
    return "success";
  }
  if (warningStatuses.has(key)) {
    return "warning";
  }
  if (dangerStatuses.has(key)) {
    return "danger";
  }
  if (infoStatuses.has(key)) {
    return "info";
  }
  return "neutral";
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "StatusBadge",
  __ssrInlineRender: true,
  props: {
    status: { type: [String, Boolean, null] },
    label: {},
    tone: {}
  },
  setup(__props) {
    const props = __props;
    const toneClass = {
      success: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
      warning: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
      danger: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-300",
      info: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/60 dark:text-sky-300",
      neutral: "border-border bg-muted text-muted-foreground"
    };
    const badgeClass = computed(() => {
      var _a;
      return [
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold leading-none",
        toneClass[(_a = props.tone) != null ? _a : getStatusTone(props.status)]
      ];
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<span${ssrRenderAttrs(mergeProps({ class: badgeClass.value }, _attrs))}><span class="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true"></span> ${ssrInterpolate((_a = __props.label) != null ? _a : unref(normalizeStatus)(__props.status))}</span>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/StatusBadge.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };;globalThis.__timing__.logEnd('Load chunks/build/StatusBadge-CKDkR-Tg');
//# sourceMappingURL=StatusBadge-CKDkR-Tg.mjs.map

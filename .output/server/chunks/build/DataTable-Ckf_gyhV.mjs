globalThis.__timing__.logStart('Load chunks/build/DataTable-Ckf_gyhV');import { a as _sfc_main$1, _ as _sfc_main$2 } from './EmptyState-n5ZY7_uF.mjs';
import { defineComponent, resolveDirective, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrGetDirectiveProps, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DataTable",
  __ssrInlineRender: true,
  props: {
    columns: {},
    rows: {},
    rowKey: { type: [String, Function], default: "id" },
    loading: { type: Boolean },
    emptyTitle: { default: "No records found" },
    emptyDescription: { default: "Records will appear here when they are available." }
  },
  setup(__props) {
    const props = __props;
    function resolveRowKey(row, index) {
      var _a;
      if (typeof props.rowKey === "function") {
        return props.rowKey(row, index);
      }
      return (_a = row[props.rowKey]) != null ? _a : index;
    }
    function formatCell(value) {
      if (value === null || value === void 0 || value === "") {
        return "-";
      }
      if (Array.isArray(value)) {
        return value.length.toString();
      }
      return String(value);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LoadingState = _sfc_main$1;
      const _component_EmptyState = _sfc_main$2;
      const _directive_motion = resolveDirective("motion");
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "overflow-hidden rounded-xl border border-border bg-card shadow-sm" }, _attrs))}>`);
      if (__props.loading) {
        _push(ssrRenderComponent(_component_LoadingState, {
          rows: 5,
          class: "border-0 shadow-none"
        }, null, _parent));
      } else if (__props.rows.length === 0) {
        _push(ssrRenderComponent(_component_EmptyState, {
          title: __props.emptyTitle,
          description: __props.emptyDescription
        }, null, _parent));
      } else {
        _push(`<!--[--><div class="hidden overflow-x-auto md:block"><table class="min-w-full divide-y divide-border text-sm"><thead class="bg-muted/60"><tr><!--[-->`);
        ssrRenderList(__props.columns, (column) => {
          _push(`<th scope="col" class="${ssrRenderClass([
            "px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted-foreground",
            column.align === "right" ? "text-right" : ""
          ])}">${ssrInterpolate(column.label)}</th>`);
        });
        _push(`<!--]--></tr></thead><tbody class="divide-y divide-border"><!--[-->`);
        ssrRenderList(__props.rows, (row, index) => {
          _push(`<tr${ssrRenderAttrs(mergeProps({
            key: resolveRowKey(row, index),
            initial: { opacity: 0, y: 8 },
            enter: { opacity: 1, y: 0, transition: { delay: index * 25, duration: 180 } },
            class: "transition hover:bg-muted/40 motion-reduce:transition-none"
          }, ssrGetDirectiveProps(_ctx, _directive_motion)))}><!--[-->`);
          ssrRenderList(__props.columns, (column) => {
            _push(`<td class="${ssrRenderClass([
              "px-4 py-3 align-middle",
              column.align === "right" ? "text-right" : ""
            ])}">`);
            ssrRenderSlot(_ctx.$slots, `cell-${column.key}`, {
              row,
              value: row[column.key]
            }, () => {
              _push(`${ssrInterpolate(formatCell(row[column.key]))}`);
            }, _push, _parent);
            _push(`</td>`);
          });
          _push(`<!--]--></tr>`);
        });
        _push(`<!--]--></tbody></table></div><div class="divide-y divide-border md:hidden"><!--[-->`);
        ssrRenderList(__props.rows, (row, index) => {
          _push(`<article class="space-y-3 p-4">`);
          ssrRenderSlot(_ctx.$slots, "mobile-card", { row }, () => {
            _push(`<!--[-->`);
            ssrRenderList(__props.columns, (column) => {
              _push(`<div class="flex items-start justify-between gap-3"><span class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">${ssrInterpolate(column.label)}</span><span class="text-right text-sm text-foreground">${ssrInterpolate(formatCell(row[column.key]))}</span></div>`);
            });
            _push(`<!--]-->`);
          }, _push, _parent);
          _push(`</article>`);
        });
        _push(`<!--]--></div><!--]-->`);
      }
      _push(`</section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/DataTable.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };;globalThis.__timing__.logEnd('Load chunks/build/DataTable-Ckf_gyhV');
//# sourceMappingURL=DataTable-Ckf_gyhV.mjs.map

globalThis.__timing__.logStart('Load chunks/build/FormField-BBFT5EVR');import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "FormField",
  __ssrInlineRender: true,
  props: {
    id: {},
    label: {},
    helper: { default: void 0 },
    errors: { default: () => [] }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-1.5" }, _attrs))}><label${ssrRenderAttr("for", __props.id)} class="block text-sm font-semibold text-foreground">${ssrInterpolate(__props.label)}</label>`);
      ssrRenderSlot(_ctx.$slots, "default", {
        hasError: __props.errors.length > 0
      }, null, _push, _parent);
      if (__props.helper && __props.errors.length === 0) {
        _push(`<p class="text-xs text-muted-foreground">${ssrInterpolate(__props.helper)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.errors.length > 0) {
        _push(`<p class="text-xs font-medium text-destructive">${ssrInterpolate(__props.errors[0])}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/FormField.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };;globalThis.__timing__.logEnd('Load chunks/build/FormField-BBFT5EVR');
//# sourceMappingURL=FormField-BBFT5EVR.mjs.map

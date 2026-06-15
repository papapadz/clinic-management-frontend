globalThis.__timing__.logStart('Load chunks/build/BaseInput-CXB4y4hS');import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BaseInput",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    hasError: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<input${ssrRenderAttrs(mergeProps({
        value: __props.modelValue,
        class: [
          "h-10 w-full rounded-lg border border-input bg-background/90 px-3 text-sm text-foreground shadow-sm outline-none transition duration-150 placeholder:text-muted-foreground focus:border-primary/50 focus:ring-4 focus:ring-ring/15 disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none",
          __props.hasError ? "border-destructive/60 focus:border-destructive focus:ring-destructive/10" : ""
        ]
      }, _ctx.$attrs, _attrs))}>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/BaseInput.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };;globalThis.__timing__.logEnd('Load chunks/build/BaseInput-CXB4y4hS');
//# sourceMappingURL=BaseInput-CXB4y4hS.mjs.map

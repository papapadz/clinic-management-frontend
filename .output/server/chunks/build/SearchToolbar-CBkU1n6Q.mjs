globalThis.__timing__.logStart('Load chunks/build/SearchToolbar-CBkU1n6Q');import { _ as _sfc_main$1 } from './BaseInput-CXB4y4hS.mjs';
import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { Search } from 'lucide-vue-next';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SearchToolbar",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    placeholder: { default: "Search" },
    label: { default: "Search records" }
  },
  emits: ["update:modelValue"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BaseInput = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col gap-3 rounded-xl border border-border/80 bg-card/80 p-3 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between" }, _attrs))}><label class="relative min-w-0 flex-1 sm:max-w-md">`);
      _push(ssrRenderComponent(unref(Search), {
        class: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`<span class="sr-only">${ssrInterpolate(__props.label)}</span>`);
      _push(ssrRenderComponent(_component_BaseInput, {
        "model-value": __props.modelValue,
        type: "search",
        class: "pl-9",
        placeholder: __props.placeholder,
        "onUpdate:modelValue": ($event) => _ctx.$emit("update:modelValue", $event)
      }, null, _parent));
      _push(`</label><div class="flex shrink-0 flex-wrap items-center gap-2">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/SearchToolbar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };;globalThis.__timing__.logEnd('Load chunks/build/SearchToolbar-CBkU1n6Q');
//# sourceMappingURL=SearchToolbar-CBkU1n6Q.mjs.map

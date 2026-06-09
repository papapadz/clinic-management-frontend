globalThis.__timing__.logStart('Load chunks/build/EmptyState-n5ZY7_uF');import { defineComponent, mergeProps, createVNode, resolveDynamicComponent, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderVNode, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { Inbox } from 'lucide-vue-next';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "LoadingState",
  __ssrInlineRender: true,
  props: {
    rows: { default: 5 }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded-xl border border-border bg-card p-4" }, _attrs))}><div class="space-y-3"><!--[-->`);
      ssrRenderList(__props.rows, (item) => {
        _push(`<div class="flex items-center gap-3"><div class="h-10 w-10 animate-pulse rounded-full bg-muted"></div><div class="min-w-0 flex-1 space-y-2"><div class="h-3 w-2/3 animate-pulse rounded-full bg-muted"></div><div class="h-3 w-1/3 animate-pulse rounded-full bg-muted"></div></div></div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/LoadingState.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "EmptyState",
  __ssrInlineRender: true,
  props: {
    title: {},
    description: {},
    icon: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/70 px-6 py-10 text-center" }, _attrs))}><div class="mb-4 rounded-2xl bg-primary/10 p-4 text-primary">`);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent((_a = __props.icon) != null ? _a : unref(Inbox)), {
        class: "h-7 w-7",
        "aria-hidden": "true"
      }, null), _parent);
      _push(`</div><h2 class="text-base font-bold text-foreground">${ssrInterpolate(__props.title)}</h2>`);
      if (__props.description) {
        _push(`<p class="mt-2 max-w-md text-sm leading-6 text-muted-foreground">${ssrInterpolate(__props.description)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (_ctx.$slots.actions) {
        _push(`<div class="mt-5 flex flex-wrap justify-center gap-2">`);
        ssrRenderSlot(_ctx.$slots, "actions", {}, null, _push, _parent);
        _push(`</div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/EmptyState.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _, _sfc_main$1 as a };;globalThis.__timing__.logEnd('Load chunks/build/EmptyState-n5ZY7_uF');
//# sourceMappingURL=EmptyState-n5ZY7_uF.mjs.map

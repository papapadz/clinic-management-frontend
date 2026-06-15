globalThis.__timing__.logStart('Load chunks/build/MetricCard-D2TSdre9');import { defineComponent, computed, resolveDirective, mergeProps, createVNode, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrGetDirectiveProps, ssrInterpolate, ssrRenderClass, ssrRenderVNode } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "MetricCard",
  __ssrInlineRender: true,
  props: {
    label: {},
    value: {},
    helper: { default: void 0 },
    icon: {},
    tone: { default: "primary" },
    loading: { type: Boolean },
    delay: { default: 0 }
  },
  setup(__props) {
    const props = __props;
    const iconClass = computed(() => {
      const tones = {
        primary: "bg-primary/10 text-primary",
        success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
        warning: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
        danger: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
      };
      return ["rounded-xl p-3 transition duration-200 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100", tones[props.tone]];
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _directive_motion = resolveDirective("motion");
      _push(`<section${ssrRenderAttrs(mergeProps({
        initial: { opacity: 0, y: 14 },
        enter: { opacity: 1, y: 0, transition: { delay: __props.delay, duration: 260 } },
        class: "group overflow-hidden rounded-xl border border-border/80 bg-card p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none"
      }, _attrs, ssrGetDirectiveProps(_ctx, _directive_motion)))}><div class="flex items-start justify-between gap-3"><div><p class="text-sm font-medium text-muted-foreground">${ssrInterpolate(__props.label)}</p><div class="mt-2 flex items-end gap-2">`);
      if (__props.loading) {
        _push(`<span class="h-8 w-20 animate-pulse rounded-md bg-muted"></span>`);
      } else {
        _push(`<p class="text-3xl font-bold tracking-normal text-foreground">${ssrInterpolate(__props.value)}</p>`);
      }
      _push(`</div></div><div class="${ssrRenderClass(iconClass.value)}">`);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(__props.icon), {
        class: "h-5 w-5",
        "aria-hidden": "true"
      }, null), _parent);
      _push(`</div></div>`);
      if (__props.helper) {
        _push(`<p class="mt-3 text-sm text-muted-foreground">${ssrInterpolate(__props.helper)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/MetricCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };;globalThis.__timing__.logEnd('Load chunks/build/MetricCard-D2TSdre9');
//# sourceMappingURL=MetricCard-D2TSdre9.mjs.map

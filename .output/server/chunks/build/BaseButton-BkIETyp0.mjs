globalThis.__timing__.logStart('Load chunks/build/BaseButton-BkIETyp0');import { defineComponent, computed, createVNode, resolveDynamicComponent, unref, mergeProps, withCtx, openBlock, createBlock, createCommentVNode, renderSlot, useSSRContext } from 'vue';
import { ssrRenderVNode, ssrRenderSlot } from 'vue/server-renderer';
import { _ as __nuxt_component_0 } from './nuxt-link-CfPMJNCN.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BaseButton",
  __ssrInlineRender: true,
  props: {
    type: { default: "button" },
    variant: { default: "primary" },
    size: { default: "md" },
    block: { type: Boolean },
    disabled: { type: Boolean },
    loading: { type: Boolean },
    icon: { default: null },
    to: { default: void 0 },
    href: { default: void 0 }
  },
  setup(__props) {
    const props = __props;
    const variantClass = computed(() => {
      switch (props.variant) {
        case "secondary":
          return "border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80";
        case "outline":
          return "border border-border bg-background/80 text-foreground hover:border-primary/40 hover:bg-primary/5";
        case "ghost":
          return "text-muted-foreground hover:bg-accent hover:text-accent-foreground";
        case "danger":
          return "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90";
        default:
          return "bg-primary text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90";
      }
    });
    const sizeClass = computed(() => {
      switch (props.size) {
        case "sm":
          return "h-8 rounded-md px-3 text-xs";
        case "lg":
          return "h-11 rounded-lg px-5 text-base";
        case "icon":
          return "h-10 w-10 rounded-lg p-0";
        default:
          return "h-10 rounded-lg px-4 text-sm";
      }
    });
    const buttonClass = computed(() => [
      "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:active:scale-100",
      variantClass.value,
      sizeClass.value,
      props.block ? "w-full" : ""
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(__props.href || __props.to ? unref(__nuxt_component_0) : "button"), mergeProps({
        to: __props.to,
        href: __props.href,
        type: !__props.href && !__props.to ? __props.type : void 0,
        disabled: __props.disabled || __props.loading,
        class: buttonClass.value
      }, _ctx.$attrs, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.icon && !__props.loading) {
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(__props.icon), {
                class: "h-4 w-4 shrink-0",
                "aria-hidden": "true"
              }, null), _parent2, _scopeId);
            } else {
              _push2(`<!---->`);
            }
            if (__props.loading) {
              _push2(`<span class="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true"${_scopeId}></span>`);
            } else {
              _push2(`<!---->`);
            }
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              __props.icon && !__props.loading ? (openBlock(), createBlock(resolveDynamicComponent(__props.icon), {
                key: 0,
                class: "h-4 w-4 shrink-0",
                "aria-hidden": "true"
              })) : createCommentVNode("", true),
              __props.loading ? (openBlock(), createBlock("span", {
                key: 1,
                class: "h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent",
                "aria-hidden": "true"
              })) : createCommentVNode("", true),
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }), _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/BaseButton.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };;globalThis.__timing__.logEnd('Load chunks/build/BaseButton-BkIETyp0');
//# sourceMappingURL=BaseButton-BkIETyp0.mjs.map

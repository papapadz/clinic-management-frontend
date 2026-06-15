globalThis.__timing__.logStart('Load chunks/build/useApi-BqLSQQg_');import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { c as useNuxtApp } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PageHeader",
  __ssrInlineRender: true,
  props: {
    title: {},
    description: {},
    eyebrow: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" }, _attrs))}><div class="min-w-0">`);
      if (__props.eyebrow) {
        _push(`<p class="text-xs font-bold uppercase tracking-[0.18em] text-primary">${ssrInterpolate(__props.eyebrow)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<h1 class="mt-1 text-2xl font-bold tracking-normal text-foreground sm:text-3xl">${ssrInterpolate(__props.title)}</h1>`);
      if (__props.description) {
        _push(`<p class="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">${ssrInterpolate(__props.description)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (_ctx.$slots.actions) {
        _push(`<div class="flex shrink-0 flex-wrap items-center gap-2">`);
        ssrRenderSlot(_ctx.$slots, "actions", {}, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</header>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/PageHeader.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
function useApi() {
  const nuxtApp = useNuxtApp();
  return {
    api: nuxtApp.$api,
    tenantPath: nuxtApp.$tenantPath
  };
}

export { _sfc_main as _, useApi as u };;globalThis.__timing__.logEnd('Load chunks/build/useApi-BqLSQQg_');
//# sourceMappingURL=useApi-BqLSQQg_.mjs.map

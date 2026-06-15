globalThis.__timing__.logStart('Load chunks/build/login-CxaWUKYp');import { _ as _sfc_main$1 } from './FormField-BBFT5EVR.mjs';
import { _ as _sfc_main$2 } from './BaseInput-CXB4y4hS.mjs';
import { _ as _sfc_main$3 } from './BaseButton-BkIETyp0.mjs';
import { defineComponent, ref, mergeProps, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { u as useAuthStore, g as useTenantStore } from './server.mjs';
import { useRouter } from 'vue-router';
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
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const email = ref("");
    const password = ref("");
    const loading = ref(false);
    const error = ref(null);
    useAuthStore();
    useTenantStore();
    useRouter();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormField = _sfc_main$1;
      const _component_BaseInput = _sfc_main$2;
      const _component_BaseButton = _sfc_main$3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div><p class="text-sm font-bold uppercase tracking-[0.18em] text-primary">Welcome back</p><h1 class="mt-2 text-3xl font-bold tracking-normal">Sign in to ClinicMS</h1><p class="mt-2 text-sm leading-6 text-muted-foreground">Open your clinic workspace and continue today\u2019s patient flow.</p></div><form class="space-y-4">`);
      _push(ssrRenderComponent(_component_FormField, {
        id: "email",
        label: "Email address"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_BaseInput, {
              id: "email",
              modelValue: email.value,
              "onUpdate:modelValue": ($event) => email.value = $event,
              type: "email",
              required: "",
              autocomplete: "email",
              placeholder: "you@clinic.test"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_BaseInput, {
                id: "email",
                modelValue: email.value,
                "onUpdate:modelValue": ($event) => email.value = $event,
                type: "email",
                required: "",
                autocomplete: "email",
                placeholder: "you@clinic.test"
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_FormField, {
        id: "password",
        label: "Password"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_BaseInput, {
              id: "password",
              modelValue: password.value,
              "onUpdate:modelValue": ($event) => password.value = $event,
              type: "password",
              required: "",
              autocomplete: "current-password",
              placeholder: "Enter your password"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_BaseInput, {
                id: "password",
                modelValue: password.value,
                "onUpdate:modelValue": ($event) => password.value = $event,
                type: "password",
                required: "",
                autocomplete: "current-password",
                placeholder: "Enter your password"
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (error.value) {
        _push(`<div class="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">${ssrInterpolate(error.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_BaseButton, {
        type: "submit",
        block: "",
        loading: loading.value
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(loading.value ? "Signing in..." : "Sign in")}`);
          } else {
            return [
              createTextVNode(toDisplayString(loading.value ? "Signing in..." : "Sign in"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</form></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };;globalThis.__timing__.logEnd('Load chunks/build/login-CxaWUKYp');
//# sourceMappingURL=login-CxaWUKYp.mjs.map

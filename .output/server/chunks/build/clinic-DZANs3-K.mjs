globalThis.__timing__.logStart('Load chunks/build/clinic-DZANs3-K');import { ssrRenderAttrs } from 'vue/server-renderer';
import { useSSRContext } from 'vue';
import { _ as _export_sfc } from './server.mjs';
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
import 'vue-router';
import 'framesync';
import 'popmotion';
import 'style-value-types';

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 class="text-2xl font-bold mb-4">Clinic Settings</h1><div class="text-muted-foreground">Coming soon: clinic info, logo, and configuration.</div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[tenant]/settings/clinic.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const clinic = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { clinic as default };;globalThis.__timing__.logEnd('Load chunks/build/clinic-DZANs3-K');
//# sourceMappingURL=clinic-DZANs3-K.mjs.map

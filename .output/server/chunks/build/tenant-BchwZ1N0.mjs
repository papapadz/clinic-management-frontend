globalThis.__timing__.logStart('Load chunks/build/tenant-BchwZ1N0');import { d as defineNuxtRouteMiddleware, n as navigateTo } from './server.mjs';
import 'vue';
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
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';
import 'vue-router';
import 'framesync';
import 'popmotion';
import 'style-value-types';

const tenant = defineNuxtRouteMiddleware((to) => {
  const tenantSlug = to.params.tenant;
  if (!tenantSlug) {
    return navigateTo("/login");
  }
});

export { tenant as default };;globalThis.__timing__.logEnd('Load chunks/build/tenant-BchwZ1N0');
//# sourceMappingURL=tenant-BchwZ1N0.mjs.map

globalThis.__timing__.logStart('Load chunks/build/role-BQGfBqME');import { d as defineNuxtRouteMiddleware, u as useAuthStore, n as navigateTo } from './server.mjs';
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

const role = defineNuxtRouteMiddleware((to) => {
  var _a, _b, _c;
  const auth = useAuthStore();
  const requiredRole = (_a = to.meta) == null ? void 0 : _a.role;
  if (requiredRole && !((_c = (_b = auth.user) == null ? void 0 : _b.roles) == null ? void 0 : _c.includes(requiredRole))) {
    return navigateTo("/unauthorized");
  }
});

export { role as default };;globalThis.__timing__.logEnd('Load chunks/build/role-BQGfBqME');
//# sourceMappingURL=role-BQGfBqME.mjs.map

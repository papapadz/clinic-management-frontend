globalThis.__timing__.logStart('Load chunks/build/auth-CggV4mI4');import { d as defineNuxtRouteMiddleware, u as useAuthStore, n as navigateTo } from './server.mjs';
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

const auth = defineNuxtRouteMiddleware(() => {
  const auth2 = useAuthStore();
  if (!auth2.token) {
    return navigateTo("/login");
  }
});

export { auth as default };;globalThis.__timing__.logEnd('Load chunks/build/auth-CggV4mI4');
//# sourceMappingURL=auth-CggV4mI4.mjs.map

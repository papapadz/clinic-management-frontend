globalThis.__timing__.logStart('Load chunks/build/BaseDialog-DRATr3_o');import { defineComponent, unref, mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, renderSlot, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { DialogRoot, DialogPortal, DialogOverlay, DialogContent, DialogTitle, DialogDescription, DialogClose } from 'reka-ui';
import { X } from 'lucide-vue-next';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BaseDialog",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    title: {},
    description: {}
  },
  emits: ["update:open"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogRoot), mergeProps({
        open: __props.open,
        "onUpdate:open": ($event) => _ctx.$emit("update:open", $event)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(DialogPortal), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(DialogOverlay), { class: "fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(DialogContent), { class: "fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[calc(100vw-2rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 motion-reduce:transition-none" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="flex items-start justify-between gap-4 border-b border-border bg-card/80 px-5 py-4"${_scopeId3}><div${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(DialogTitle), { class: "text-lg font-bold text-foreground" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${ssrInterpolate(__props.title)}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(__props.title), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        if (__props.description) {
                          _push4(ssrRenderComponent(unref(DialogDescription), { class: "mt-1 text-sm text-muted-foreground" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(__props.description)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(__props.description), 1)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div>`);
                        _push4(ssrRenderComponent(unref(DialogClose), { class: "rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(X), {
                                class: "h-4 w-4",
                                "aria-hidden": "true"
                              }, null, _parent5, _scopeId4));
                              _push5(`<span class="sr-only"${_scopeId4}>Close</span>`);
                            } else {
                              return [
                                createVNode(unref(X), {
                                  class: "h-4 w-4",
                                  "aria-hidden": "true"
                                }),
                                createVNode("span", { class: "sr-only" }, "Close")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div>`);
                        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push4, _parent4, _scopeId3);
                      } else {
                        return [
                          createVNode("div", { class: "flex items-start justify-between gap-4 border-b border-border bg-card/80 px-5 py-4" }, [
                            createVNode("div", null, [
                              createVNode(unref(DialogTitle), { class: "text-lg font-bold text-foreground" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(__props.title), 1)
                                ]),
                                _: 1
                              }),
                              __props.description ? (openBlock(), createBlock(unref(DialogDescription), {
                                key: 0,
                                class: "mt-1 text-sm text-muted-foreground"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(__props.description), 1)
                                ]),
                                _: 1
                              })) : createCommentVNode("", true)
                            ]),
                            createVNode(unref(DialogClose), { class: "rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" }, {
                              default: withCtx(() => [
                                createVNode(unref(X), {
                                  class: "h-4 w-4",
                                  "aria-hidden": "true"
                                }),
                                createVNode("span", { class: "sr-only" }, "Close")
                              ]),
                              _: 1
                            })
                          ]),
                          renderSlot(_ctx.$slots, "default")
                        ];
                      }
                    }),
                    _: 3
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(DialogOverlay), { class: "fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" }),
                    createVNode(unref(DialogContent), { class: "fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[calc(100vw-2rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 motion-reduce:transition-none" }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "flex items-start justify-between gap-4 border-b border-border bg-card/80 px-5 py-4" }, [
                          createVNode("div", null, [
                            createVNode(unref(DialogTitle), { class: "text-lg font-bold text-foreground" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(__props.title), 1)
                              ]),
                              _: 1
                            }),
                            __props.description ? (openBlock(), createBlock(unref(DialogDescription), {
                              key: 0,
                              class: "mt-1 text-sm text-muted-foreground"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(__props.description), 1)
                              ]),
                              _: 1
                            })) : createCommentVNode("", true)
                          ]),
                          createVNode(unref(DialogClose), { class: "rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" }, {
                            default: withCtx(() => [
                              createVNode(unref(X), {
                                class: "h-4 w-4",
                                "aria-hidden": "true"
                              }),
                              createVNode("span", { class: "sr-only" }, "Close")
                            ]),
                            _: 1
                          })
                        ]),
                        renderSlot(_ctx.$slots, "default")
                      ]),
                      _: 3
                    })
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(DialogPortal), null, {
                default: withCtx(() => [
                  createVNode(unref(DialogOverlay), { class: "fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" }),
                  createVNode(unref(DialogContent), { class: "fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[calc(100vw-2rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 motion-reduce:transition-none" }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "flex items-start justify-between gap-4 border-b border-border bg-card/80 px-5 py-4" }, [
                        createVNode("div", null, [
                          createVNode(unref(DialogTitle), { class: "text-lg font-bold text-foreground" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(__props.title), 1)
                            ]),
                            _: 1
                          }),
                          __props.description ? (openBlock(), createBlock(unref(DialogDescription), {
                            key: 0,
                            class: "mt-1 text-sm text-muted-foreground"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(__props.description), 1)
                            ]),
                            _: 1
                          })) : createCommentVNode("", true)
                        ]),
                        createVNode(unref(DialogClose), { class: "rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" }, {
                          default: withCtx(() => [
                            createVNode(unref(X), {
                              class: "h-4 w-4",
                              "aria-hidden": "true"
                            }),
                            createVNode("span", { class: "sr-only" }, "Close")
                          ]),
                          _: 1
                        })
                      ]),
                      renderSlot(_ctx.$slots, "default")
                    ]),
                    _: 3
                  })
                ]),
                _: 3
              })
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/BaseDialog.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };;globalThis.__timing__.logEnd('Load chunks/build/BaseDialog-DRATr3_o');
//# sourceMappingURL=BaseDialog-DRATr3_o.mjs.map

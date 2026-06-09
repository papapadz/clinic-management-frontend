export const PRINT_READY_MESSAGE = {
  type: 'clinic-print-ready',
  source: 'clinic-print-document',
} as const

export type PrintReadyMessage = typeof PRINT_READY_MESSAGE & {
  url: string
}

export function signalPrintReady() {
  window.parent.postMessage({
    ...PRINT_READY_MESSAGE,
    url: window.location.href,
  } satisfies PrintReadyMessage, window.location.origin)
}

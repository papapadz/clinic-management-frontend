export function buildEmbeddedPrintUrl(printUrl: string): string {
  return appendPrintQuery(printUrl, 'embedded')
}

export function buildAutoPrintUrl(printUrl: string): string {
  return appendPrintQuery(printUrl, 'autoprint')
}

function appendPrintQuery(printUrl: string, name: string): string {
  const separator = printUrl.includes('?') ? '&' : '?'
  return `${printUrl}${separator}${name}=1`
}

export function usePrintLauncher() {
  const router = useRouter()

  function launchPrint(printUrl: string): void {
    router.push(buildAutoPrintUrl(printUrl))
  }

  return { launchPrint }
}

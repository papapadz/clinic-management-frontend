import type { ClinicTheme } from '~/types'

const FULL_HEX = /^#[0-9A-Fa-f]{6}$/
const THEME_VARIABLES = [
  '--primary',
  '--ring',
  '--sidebar-primary',
  '--secondary',
  '--accent',
  '--sidebar-accent',
]

export function isFullHexColor(value: unknown): value is string {
  return typeof value === 'string' && FULL_HEX.test(value)
}

export function hexToHslToken(hex: string): string {
  if (!isFullHexColor(hex)) {
    throw new Error('Expected a full #RRGGBB hex color.')
  }

  const red = Number.parseInt(hex.slice(1, 3), 16) / 255
  const green = Number.parseInt(hex.slice(3, 5), 16) / 255
  const blue = Number.parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const lightness = (max + min) / 2
  const delta = max - min

  let hue = 0
  let saturation = 0

  if (delta !== 0) {
    saturation = delta / (1 - Math.abs(2 * lightness - 1))

    if (max === red) {
      hue = 60 * (((green - blue) / delta) % 6)
    } else if (max === green) {
      hue = 60 * ((blue - red) / delta + 2)
    } else {
      hue = 60 * ((red - green) / delta + 4)
    }
  }

  if (hue < 0) {
    hue += 360
  }

  return `${Math.round(hue)} ${Math.round(saturation * 100)}% ${Math.round(lightness * 100)}%`
}

export function clinicThemeVariables(theme?: ClinicTheme | null): Record<string, string> {
  const variables: Record<string, string> = {}

  if (isFullHexColor(theme?.primary)) {
    const primary = hexToHslToken(theme.primary)
    variables['--primary'] = primary
    variables['--ring'] = primary
    variables['--sidebar-primary'] = primary
  }

  if (isFullHexColor(theme?.secondary)) {
    variables['--secondary'] = hexToHslToken(theme.secondary)
  }

  if (isFullHexColor(theme?.accent)) {
    const accent = hexToHslToken(theme.accent)
    variables['--accent'] = accent
    variables['--sidebar-accent'] = accent
  }

  return variables
}

export function applyClinicTheme(theme?: ClinicTheme | null, target: HTMLElement | null = globalThis.document?.documentElement ?? null) {
  if (!target) {
    return
  }

  for (const name of THEME_VARIABLES) {
    target.style.removeProperty(name)
  }

  for (const [name, value] of Object.entries(clinicThemeVariables(theme))) {
    target.style.setProperty(name, value)
  }
}

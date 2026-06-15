import { describe, expect, it } from 'vitest'
import { clinicThemeVariables, hexToHslToken } from './clinicTheme'

describe('clinic theme utilities', () => {
  it('converts full hex colors to HSL CSS variable values', () => {
    expect(hexToHslToken('#0F766E')).toBe('175 77% 26%')
    expect(hexToHslToken('#F8FAFC')).toBe('210 40% 98%')
  })

  it('builds app shell CSS variables from default clinic theme colors', () => {
    expect(clinicThemeVariables({
      primary: '#0F766E',
      secondary: '#F8FAFC',
      accent: '#F59E0B',
    })).toEqual({
      '--primary': '175 77% 26%',
      '--ring': '175 77% 26%',
      '--sidebar-primary': '175 77% 26%',
      '--secondary': '210 40% 98%',
      '--accent': '38 92% 50%',
      '--sidebar-accent': '38 92% 50%',
    })
  })

  it('ignores missing or invalid theme colors', () => {
    expect(clinicThemeVariables({ primary: '#123', accent: null })).toEqual({})
  })
})

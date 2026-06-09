// Minimal ESLint 9 config for Nuxt
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

Object.groupBy ??= function groupBy(items, callback) {
  return Array.from(items).reduce((groups, item, index) => {
    const key = callback(item, index)
    groups[key] ??= []
    groups[key].push(item)
    return groups
  }, {})
}

export default createConfigForNuxt({
  features: {
    stylistic: false,
  },
}, {
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
  },
})

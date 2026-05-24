import { describe, expect, it } from 'vitest'
import { formatDate } from './date'

describe('formatDate', () => {
  it('formats date-only strings differently for Chinese and English locales', () => {
    expect(formatDate('2026-01-15', 'zh')).toBe('2026年1月15日')
    expect(formatDate('2026-01-15', 'en')).toBe('January 15, 2026')
  })
})

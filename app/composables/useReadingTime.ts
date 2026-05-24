export function useReadingTime() {
  function formatReadingTime(minutes: number, locale = 'zh'): string {
    if (locale === 'zh') {
      return `${minutes} 分钟阅读`
    }
    return `${minutes} min read`
  }

  function formatWordCount(count: number, locale = 'zh'): string {
    if (locale === 'zh') {
      return `${count} 字`
    }
    return `${count} words`
  }

  return { formatReadingTime, formatWordCount }
}

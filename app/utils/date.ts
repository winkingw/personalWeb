function parseDate(date: string | Date): Date {
  if (date instanceof Date) {
    return date
  }

  const dateOnly = /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})$/.exec(date)
  if (dateOnly?.groups) {
    const { year, month, day } = dateOnly.groups
    return new Date(Number(year), Number(month) - 1, Number(day))
  }

  return new Date(date)
}

export function formatDate(date: string | Date, locale: string): string {
  const d = parseDate(date)
  if (locale.startsWith('zh')) {
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

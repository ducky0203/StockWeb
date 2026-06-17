export const formatCurrency = (value: number, currency = 'VND'): string =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency }).format(value)

export const formatNumber = (value: number): string =>
  new Intl.NumberFormat('vi-VN').format(value)

export const formatPercent = (value: number): string =>
  `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`

export const cn = (...classes: (string | undefined | null | false)[]): string =>
  classes.filter(Boolean).join(' ')

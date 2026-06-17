import { formatDate, formatNumber } from './tableFormat'

export interface ColDescriptor {
  title: string
  field: string
  minWidth: number
  excelType: 'text' | 'number' | 'date'
  align?: 'right'
  format?: (value: unknown) => string
  type?: 'color' | 'number'
}

export function textCol(title: string, field: string, opts: Partial<ColDescriptor> = {}): ColDescriptor {
  return { title, field, minWidth: 100, excelType: 'text', ...opts }
}

export function numCol(title: string, field: string, opts: Partial<ColDescriptor> = {}): ColDescriptor {
  return {
    title,
    field,
    align: 'right',
    minWidth: 90,
    excelType: 'number',
    format: (value) => formatNumber(value),
    ...opts,
  }
}

export function dateCol(title: string, field: string, opts: Partial<ColDescriptor> = {}): ColDescriptor {
  return {
    title,
    field,
    minWidth: 110,
    excelType: 'date',
    format: (value) => formatDate(value),
    ...opts,
  }
}

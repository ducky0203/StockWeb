export function formatDate(value: unknown): string {
  if (value == null || value === '') return ''
  const raw = String(value).trim()
  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (iso) {
    const [, year, month, day] = iso
    return `${day}/${month}/${year}`
  }
  const slash = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/)
  if (slash) {
    const day = slash[1].padStart(2, '0')
    const month = slash[2].padStart(2, '0')
    const year = slash[3].length === 2 ? `20${slash[3]}` : slash[3]
    return `${day}/${month}/${year}`
  }
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return raw
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

export function formatNumber(value: unknown): string {
  if (value == null || value === '') return ''
  const n = Number(value)
  if (Number.isNaN(n)) return String(value)
  return n.toLocaleString('vi-VN')
}

export function parseHexColor(value: unknown): string | null {
  if (value == null || value === '') return null
  const raw = String(value).trim()
  if (raw.startsWith('#')) {
    const hex = raw.slice(1)
    if (/^[0-9A-Fa-f]{6}$/.test(hex)) return `#${hex}`
    if (/^[0-9A-Fa-f]{3}$/.test(hex)) {
      return `#${hex.split('').map((c) => c + c).join('')}`
    }
    return null
  }
  if (/^[0-9A-Fa-f]{6}$/.test(raw)) return `#${raw}`
  if (/^[0-9A-Fa-f]{3}$/.test(raw)) {
    return `#${raw.split('').map((c) => c + c).join('')}`
  }
  return null
}

export function parsePhanTram(value: unknown): number | null {
  if (value == null || value === '') return null
  if (typeof value === 'number') return Number.isNaN(value) ? null : value
  const n = parseFloat(String(value).replace('%', '').trim())
  return Number.isNaN(n) ? null : n
}

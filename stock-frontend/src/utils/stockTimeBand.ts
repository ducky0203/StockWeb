// Bộ lọc theo thời gian lưu kho (tính từ ngày nhập tới hiện tại) — dùng chung cho
// các màn nguyên liệu / phụ liệu / thành phẩm.
export type StockTimeBand = 'all' | 'lt6' | '6to12' | 'gt12'

export const stockTimeBands: { key: StockTimeBand; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'lt6', label: '< 6 tháng' },
  { key: '6to12', label: '6 đến 12 tháng' },
  { key: 'gt12', label: '> 12 tháng' },
]

function parseStockDate(value: unknown): Date | null {
  if (value == null || value === '') return null
  const raw = String(value).trim()
  const slash = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/)
  if (slash) {
    const day = Number(slash[1])
    const month = Number(slash[2])
    const year = slash[3].length === 2 ? 2000 + Number(slash[3]) : Number(slash[3])
    const d = new Date(year, month - 1, day)
    return Number.isNaN(d.getTime()) ? null : d
  }
  const d = new Date(raw)
  return Number.isNaN(d.getTime()) ? null : d
}

/** Số tháng đã lưu kho tính từ ngày nhập đến hôm nay; null nếu không có ngày hợp lệ. */
function monthsInStock(value: unknown): number | null {
  const d = parseStockDate(value)
  if (!d) return null
  const now = new Date()
  let months = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth())
  if (now.getDate() < d.getDate()) months -= 1
  return months < 0 ? 0 : months
}

/**
 * Lọc danh sách tồn kho theo mốc thời gian lưu kho.
 * `dateField` là tên cột ngày nhập (mặc định 'ngay_NhapKho' cho nguyên liệu).
 * Hàng thiếu ngày nhập chỉ hiện ở "Tất cả".
 */
export function filterStockByTime<T extends Record<string, unknown>>(
  rows: T[],
  band: StockTimeBand,
  dateField = 'ngay_NhapKho',
): T[] {
  if (band === 'all') return rows
  return rows.filter((row) => {
    const m = monthsInStock(row[dateField])
    if (m == null) return false
    if (band === 'lt6') return m < 6
    if (band === '6to12') return m >= 6 && m <= 12
    return m > 12
  })
}

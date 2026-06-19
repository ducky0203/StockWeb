import { dateCol, numCol, textCol } from '@/utils/tableColumns'
import type { ColDescriptor } from '@/utils/tableColumns'

export const nlStockColumns: ColDescriptor[] = [
  numCol('STT', 'stt', { minWidth: 56 }),
  textCol('Chi nhánh', 'tenChiNhanh', { minWidth: 100 }),
  dateCol('Ngày nhập', 'ngay_NhapKho'),
  textCol('Mã hàng', 'maHang', { minWidth: 120 }),
  textCol('Mùa SP', 'muaSP', { minWidth: 100 }),
  textCol('NCC', 'nhaCungCap', { minWidth: 140 }),
  textCol('PO', 'po_No', { minWidth: 120 }),
  textCol('Item', 'item_No', { minWidth: 140 }),
  textCol('Chủng loại', 'tenChungLoaiVatTu', { minWidth: 110 }),
  textCol('Mô tả VT', 'moTaVatTu', { minWidth: 220 }),
  numCol('TG lưu kho', 'thoiGian_LuuKho', { minWidth: 110 }),
  textCol('Màu LK', 'mauLuuKho', { minWidth: 150 }),
  numCol('Tổng nhập', 'tongNhap', { minWidth: 120 }),
  numCol('Tổng xuất', 'tongXuat', { minWidth: 120 }),
  numCol('Tồn', 'soLuongTon'),
  textCol('Vị trí', 'ten_ViTri', { minWidth: 80 }),
]

// Bộ lọc theo thời gian lưu kho (tính từ ngày nhập tới hiện tại)
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

/** Lọc danh sách tồn kho theo mốc thời gian lưu kho. Hàng thiếu ngày nhập chỉ hiện ở "Tất cả". */
export function filterStockByTime<T extends Record<string, unknown>>(
  rows: T[],
  band: StockTimeBand,
): T[] {
  if (band === 'all') return rows
  return rows.filter((row) => {
    const m = monthsInStock(row.ngay_NhapKho)
    if (m == null) return false
    if (band === 'lt6') return m < 6
    if (band === '6to12') return m >= 6 && m <= 12
    return m > 12
  })
}

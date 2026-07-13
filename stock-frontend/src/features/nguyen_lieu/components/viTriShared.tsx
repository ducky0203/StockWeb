import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { formatDate, formatNumber, parsePhanTram } from '@/utils/tableFormat'
import { fillLevel } from '@/features/nguyen_lieu/components/viTriFill'

export function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  if (value == null || value === '') return null
  return (
    <div className="flex items-baseline justify-between gap-1.5">
      <span className="shrink-0 text-gray-400">{label}</span>
      <span className="truncate text-right font-medium text-gray-700" title={String(value)}>
        {value}
      </span>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-2 last:border-0">
      <span className="shrink-0 text-sm text-gray-500">{label}</span>
      <span className="text-right text-sm font-medium text-gray-800">
        {value == null || value === '' ? <span className="text-gray-300">—</span> : value}
      </span>
    </div>
  )
}

/** Tooltip chi tiết một vị trí kho — hiển thị khi hover trên node lúc khoá. */
export function ViTriTooltip({ row }: { row: Record<string, unknown> }) {
  const phanTram = parsePhanTram(row.phanTram) ?? 0
  const level = fillLevel(phanTram)
  const soLuongMax = row.soLuong_Max

  return (
    <div className="w-56 overflow-hidden rounded-lg border border-gray-200 bg-white text-left shadow-xl">
      <div
        className="px-3 py-2"
        style={{ backgroundColor: level.bg, borderBottom: `1px solid ${level.border}` }}
      >
        <p className="text-[10px] text-gray-500">
          Dãy {String(row.day ?? '—')}
          {row.ngan != null && row.ngan !== '' ? ` · Ngăn ${String(row.ngan)}` : ''}
        </p>
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-gray-900">
            Vị trí {String(row.ma_ViTriKho ?? '—')}
          </h3>
          <span className="text-xs font-semibold" style={{ color: level.bar }}>
            {phanTram > 0 ? `${phanTram}%` : 'Trống'}
          </span>
        </div>
      </div>
      <div className="space-y-1 px-3 py-2 text-[11px]">
        <InfoRow label="Khách hàng" value={row.tenKhachHang as ReactNode} />
        <InfoRow label="Mã hàng" value={row.maHang as ReactNode} />
        <InfoRow label="Chủng loại" value={row.tenChungLoaiVatTu as ReactNode} />
        <InfoRow label="Màu vật tư" value={row.tenMau_VatTu as ReactNode} />
        <InfoRow label="Item" value={row.item_No as ReactNode} />
        <InfoRow
          label="Số lượng"
          value={
            soLuongMax
              ? `${formatNumber(row.soLuong)} / ${formatNumber(soLuongMax)}`
              : formatNumber(row.soLuong)
          }
        />
        <InfoRow label="Số cuộn" value={row.soCuon != null ? formatNumber(row.soCuon) : ''} />
        <InfoRow label="Số kiện" value={row.soKien as ReactNode} />
        <InfoRow
          label="Ngày nhập kho"
          value={row.ngay_NhapKho ? formatDate(row.ngay_NhapKho) : ''}
        />
      </div>
    </div>
  )
}

/** Modal chi tiết một vị trí kho — dùng chung cho cả Trực quan và Sơ đồ kho. */
export function ViTriDetailModal({
  row,
  onClose,
}: {
  row: Record<string, unknown>
  onClose: () => void
}) {
  const phanTram = parsePhanTram(row.phanTram) ?? 0
  const level = fillLevel(phanTram)
  const soLuongMax = row.soLuong_Max

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between gap-2 px-5 py-4"
          style={{ backgroundColor: level.bg, borderBottom: `1px solid ${level.border}` }}
        >
          <div>
            <p className="text-xs text-gray-500">
              Dãy {String(row.day ?? '—')}
              {row.ngan != null && row.ngan !== '' ? ` · Ngăn ${String(row.ngan)}` : ''}
            </p>
            <h3 className="text-lg font-semibold text-gray-900">
              Vị trí {String(row.ma_ViTriKho ?? '—')}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-500 hover:bg-white/60 hover:text-gray-700"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mức lấp đầy */}
        <div className="px-5 pt-4">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-gray-500">Mức lấp đầy</span>
            <span className="font-semibold" style={{ color: level.bar }}>
              {phanTram > 0 ? `${phanTram}%` : 'Trống'}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${Math.min(phanTram, 100)}%`, backgroundColor: level.bar }}
            />
          </div>
        </div>

        {/* Thông tin chi tiết */}
        <div className="flex-1 overflow-auto px-5 py-3">
          <DetailRow label="Khách hàng" value={row.tenKhachHang as ReactNode} />
          <DetailRow label="Mã hàng" value={row.maHang as ReactNode} />
          <DetailRow label="Chủng loại" value={row.tenChungLoaiVatTu as ReactNode} />
          <DetailRow label="Màu vật tư" value={row.tenMau_VatTu as ReactNode} />
          <DetailRow label="Item" value={row.item_No as ReactNode} />
          <DetailRow
            label="Số lượng"
            value={
              soLuongMax
                ? `${formatNumber(row.soLuong)} / ${formatNumber(soLuongMax)}`
                : formatNumber(row.soLuong)
            }
          />
          <DetailRow label="Số cuộn" value={row.soCuon != null ? formatNumber(row.soCuon) : ''} />
          <DetailRow label="Số kiện" value={row.soKien as ReactNode} />
          <DetailRow
            label="Ngày nhập kho"
            value={row.ngay_NhapKho ? formatDate(row.ngay_NhapKho) : ''}
          />
        </div>
      </div>
    </div>
  )
}

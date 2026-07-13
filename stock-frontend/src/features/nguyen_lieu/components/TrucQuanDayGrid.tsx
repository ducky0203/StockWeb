import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { groupTrucQuanByDay } from '@/utils/groupTrucQuanByDay'
import { formatDate, formatNumber, parsePhanTram } from '@/utils/tableFormat'
import { fetchNLTrucQuan } from '@/features/nguyen_lieu/reducer'
import { useAppDispatch, useAppSelector } from '@/store'
import { InfoRow, ViTriDetailModal } from '@/features/nguyen_lieu/components/viTriShared'
import { LEGEND, fillLevel } from '@/features/nguyen_lieu/components/viTriFill'

interface TrucQuanDayGridProps {
  kho: any
}

function ViTriCell({
  row,
  onClick,
}: {
  row: Record<string, unknown>
  onClick: (row: Record<string, unknown>) => void
}) {
  const phanTram = parsePhanTram(row.phanTram) ?? 0
  const maViTri = String(row.ma_ViTriKho ?? '—')
  const level = fillLevel(phanTram)
  const hasStock = phanTram > 0
  const soLuongMax = row.soLuong_Max

  const tooltip = [
    `Vị trí: ${maViTri}`,
    row.tenKhachHang ? `KH: ${row.tenKhachHang}` : null,
    row.maHang ? `Mã hàng: ${row.maHang}` : null,
    row.tenChungLoaiVatTu ? `Chủng loại: ${row.tenChungLoaiVatTu}` : null,
    row.tenMau_VatTu ? `Màu: ${row.tenMau_VatTu}` : null,
    row.item_No ? `Item: ${row.item_No}` : null,
    `SL: ${formatNumber(row.soLuong)}${soLuongMax ? ` / ${formatNumber(soLuongMax)}` : ''}`,
    row.soCuon != null ? `Cuộn: ${formatNumber(row.soCuon)}` : null,
    row.soKien != null ? `Kiện: ${row.soKien}` : null,
    row.ngay_NhapKho ? `Ngày nhập: ${formatDate(row.ngay_NhapKho)}` : null,
    `Lấp đầy: ${phanTram}%`,
  ]
    .filter(Boolean)
    .join('\n')

  return (
    <button
      type="button"
      onClick={() => onClick(row)}
      className="flex flex-col gap-1.5 rounded-md border p-2 text-left text-[11px] leading-tight transition-shadow hover:z-10 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      style={{ backgroundColor: level.bg, borderColor: level.border }}
      title={tooltip}
    >
      {/* Header: mã vị trí + ngăn + % */}
      <div className="flex items-center justify-between gap-1">
        <span className="flex items-center gap-1 font-semibold text-gray-800">
          {maViTri}
        </span>
        <span
          className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold text-white"
          style={{ backgroundColor: level.bar }}
        >
          {hasStock ? `${phanTram}%` : 'Trống'}
        </span>
      </div>

      {/* Thanh lấp đầy */}
      <div className="h-1.5 overflow-hidden rounded-full bg-white/70">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.min(phanTram, 100)}%`, backgroundColor: level.bar }}
        />
      </div>

      {hasStock ? (
        <div className="flex flex-col gap-0.5">
          <InfoRow label="KH" value={row.tenKhachHang as ReactNode} />
          <InfoRow label="Mã hàng" value={row.maHang as ReactNode} />
          <InfoRow label="Chủng loại" value={row.tenChungLoaiVatTu as ReactNode} />
          <InfoRow label="Màu" value={row.tenMau_VatTu as ReactNode} />
          <InfoRow label="Item" value={row.item_No as ReactNode} />
          <InfoRow
            label="SL"
            value={
              soLuongMax
                ? `${formatNumber(row.soLuong)} / ${formatNumber(soLuongMax)}`
                : formatNumber(row.soLuong)
            }
          />
          <InfoRow label="Cuộn" value={row.soCuon != null ? formatNumber(row.soCuon) : ''} />
          <InfoRow label="Kiện" value={row.soKien as ReactNode} />
          <InfoRow
            label="Ngày nhập"
            value={row.ngay_NhapKho ? formatDate(row.ngay_NhapKho) : ''}
          />
        </div>
      ) : (
        <p className="py-1 text-center text-[10px] text-gray-400">Vị trí trống</p>
      )}
    </button>
  )
}

export default function TrucQuanDayGrid({ kho }: TrucQuanDayGridProps) {
  const dispatch = useAppDispatch()
  const { loading, listTrucQuan } = useAppSelector((state) => state.NguyenLieuReducer)
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null)

  useEffect(() => {
    if (kho?.id_Kho < 0) return
    dispatch(fetchNLTrucQuan({ ...kho, search: '' }))
  }, [dispatch, kho])

  const rows = listTrucQuan as Record<string, unknown>[]
  const groups = useMemo(() => groupTrucQuanByDay(rows), [rows])

  const summary = useMemo(() => {
    let occupied = 0
    for (const r of rows) {
      if ((parsePhanTram(r.phanTram) ?? 0) > 0) occupied++
    }
    return { total: rows.length, occupied, empty: rows.length - occupied }
  }, [rows])

  if (loading) {
    return <p className="px-4 py-8 text-center text-sm text-gray-400">Đang tải…</p>
  }

  if (!groups.length) {
    return <p className="px-4 py-8 text-center text-sm text-gray-400">Không có dữ liệu trực quan</p>
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {/* Thanh chú thích + tổng quan */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2">
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
          <span className="font-medium text-gray-500">Mức lấp đầy:</span>
          {LEGEND.map((l) => (
            <span key={l.label} className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <span>
            Tổng <b className="text-gray-800">{summary.total}</b> vị trí
          </span>
          <span className="text-green-600">
            Có hàng <b>{summary.occupied}</b>
          </span>
          <span className="text-gray-400">
            Trống <b>{summary.empty}</b>
          </span>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-auto pr-1">
        {groups.map((group) => {
          const occupied = group.items.filter(
            (i) => (parsePhanTram(i.phanTram) ?? 0) > 0,
          ).length
          return (
            <section key={group.day} className="rounded-lg border border-gray-200 bg-white">
              <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-2">
                <h3 className="text-sm font-semibold text-gray-800">
                  Dãy <span className="text-blue-600">{group.day}</span>
                </h3>
                <span className="text-xs text-gray-500">
                  {occupied}/{group.items.length} vị trí có hàng
                </span>
              </header>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2 p-3">
                {group.items.map((item) => (
                  <ViTriCell
                    key={String(item.id_ViTriKho ?? item.ma_ViTriKho)}
                    row={item}
                    onClick={setSelected}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>

      {selected && <ViTriDetailModal row={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

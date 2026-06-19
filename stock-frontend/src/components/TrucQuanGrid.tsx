import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { groupTrucQuanByDay } from '@/utils/groupTrucQuanByDay'
import { parsePhanTram } from '@/utils/tableFormat'

/** Một dòng thông tin hiển thị trong ô vị trí và modal chi tiết. */
export interface TrucQuanField {
  label: string
  key: string
  format?: (value: unknown) => ReactNode
}

interface TrucQuanGridProps {
  rows: Record<string, unknown>[]
  loading?: boolean
  /** Các trường hiển thị khi vị trí có hàng. */
  fields: TrucQuanField[]
  /**
   * Cột chứa % lấp đầy (0–100). Nếu có, ô tô màu theo mức lấp đầy.
   * Nếu không có, dùng `quantityKey` để xác định có hàng / trống.
   */
  phanTramKey?: string
  /** Cột số lượng để suy ra trạng thái có hàng khi không có `phanTramKey`. */
  quantityKey?: string
  emptyText?: string
}

interface FillLevel {
  label: string
  bg: string
  bar: string
  border: string
}

function fillLevel(phanTram: number): FillLevel {
  if (phanTram <= 0) return { label: 'Trống', bg: '#f9fafb', bar: '#e5e7eb', border: '#e5e7eb' }
  if (phanTram < 40) return { label: '< 40%', bg: '#f0fdf4', bar: '#22c55e', border: '#86efac' }
  if (phanTram < 70) return { label: '40–70%', bg: '#fefce8', bar: '#eab308', border: '#fde047' }
  if (phanTram < 90) return { label: '70–90%', bg: '#fff7ed', bar: '#f97316', border: '#fdba74' }
  return { label: '≥ 90%', bg: '#fef2f2', bar: '#ef4444', border: '#fca5a5' }
}

const LEGEND: { label: string; color: string }[] = [
  { label: 'Trống', color: '#e5e7eb' },
  { label: '< 40%', color: '#22c55e' },
  { label: '40–70%', color: '#eab308' },
  { label: '70–90%', color: '#f97316' },
  { label: '≥ 90%', color: '#ef4444' },
]

/** Trạng thái lấp đầy của một vị trí: theo % nếu có, ngược lại theo có/không có hàng. */
function rowFill(
  row: Record<string, unknown>,
  phanTramKey?: string,
  quantityKey?: string,
): { phanTram: number | null; hasStock: boolean; level: FillLevel } {
  if (phanTramKey) {
    const phanTram = parsePhanTram(row[phanTramKey]) ?? 0
    return { phanTram, hasStock: phanTram > 0, level: fillLevel(phanTram) }
  }
  const qty = Number(row[quantityKey ?? ''] ?? 0)
  const hasStock = !Number.isNaN(qty) && qty > 0
  return {
    phanTram: null,
    hasStock,
    level: hasStock ? fillLevel(50) : fillLevel(0),
  }
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
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

function fieldValue(row: Record<string, unknown>, field: TrucQuanField): ReactNode {
  const raw = row[field.key]
  return field.format ? field.format(raw) : (raw as ReactNode)
}

function ViTriDetailModal({
  row,
  fields,
  phanTramKey,
  quantityKey,
  onClose,
}: {
  row: Record<string, unknown>
  fields: TrucQuanField[]
  phanTramKey?: string
  quantityKey?: string
  onClose: () => void
}) {
  const { phanTram, hasStock, level } = rowFill(row, phanTramKey, quantityKey)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between gap-2 px-5 py-4"
          style={{ backgroundColor: level.bg, borderBottom: `1px solid ${level.border}` }}
        >
          <div>
            <p className="text-xs text-gray-500">
              Dãy {String(row.day ?? '—')}
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

        <div className="px-5 pt-4">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-gray-500">Mức lấp đầy</span>
            <span className="font-semibold" style={{ color: level.bar }}>
              {phanTram != null ? (phanTram > 0 ? `${phanTram}%` : 'Trống') : hasStock ? 'Có hàng' : 'Trống'}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${phanTram != null ? Math.min(phanTram, 100) : hasStock ? 100 : 0}%`,
                backgroundColor: level.bar,
              }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto px-5 py-3">
          {fields.map((f) => (
            <DetailRow key={f.key} label={f.label} value={fieldValue(row, f)} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ViTriCell({
  row,
  fields,
  phanTramKey,
  quantityKey,
  onClick,
}: {
  row: Record<string, unknown>
  fields: TrucQuanField[]
  phanTramKey?: string
  quantityKey?: string
  onClick: (row: Record<string, unknown>) => void
}) {
  const { phanTram, hasStock, level } = rowFill(row, phanTramKey, quantityKey)
  const maViTri = String(row.ma_ViTriKho ?? '—')

  const badge = phanTram != null ? (hasStock ? `${phanTram}%` : 'Trống') : hasStock ? 'Có hàng' : 'Trống'
  const barWidth = phanTram != null ? Math.min(phanTram, 100) : hasStock ? 100 : 0

  const tooltip = [
    `Vị trí: ${maViTri}`,
    row.ngan ? `Ngăn: ${row.ngan}` : null,
    ...fields.map((f) => {
      const v = fieldValue(row, f)
      return v == null || v === '' ? null : `${f.label}: ${String(v)}`
    }),
    phanTram != null ? `Lấp đầy: ${phanTram}%` : null,
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
      <div className="flex items-center justify-between gap-1">
        <span className="flex items-center gap-1 font-semibold text-gray-800">
          {maViTri}
        </span>
        <span
          className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold text-white"
          style={{ backgroundColor: level.bar }}
        >
          {badge}
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-white/70">
        <div className="h-full rounded-full" style={{ width: `${barWidth}%`, backgroundColor: level.bar }} />
      </div>

      {hasStock ? (
        <div className="flex flex-col gap-0.5">
          {fields.map((f) => (
            <InfoRow key={f.key} label={f.label} value={fieldValue(row, f)} />
          ))}
        </div>
      ) : (
        <p className="py-1 text-center text-[10px] text-gray-400">Vị trí trống</p>
      )}
    </button>
  )
}

/**
 * Lưới trực quan vị trí kho, gom theo dãy — dùng chung cho nguyên liệu / phụ liệu / thành phẩm.
 * Truyền `phanTramKey` nếu SP trả về % lấp đầy, ngược lại truyền `quantityKey` để suy ra có/không có hàng.
 */
export default function TrucQuanGrid({
  rows,
  loading = false,
  fields,
  phanTramKey,
  quantityKey,
  emptyText = 'Không có dữ liệu trực quan',
}: TrucQuanGridProps) {
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null)

  const groups = useMemo(() => groupTrucQuanByDay(rows), [rows])

  const summary = useMemo(() => {
    let occupied = 0
    for (const r of rows) {
      if (rowFill(r, phanTramKey, quantityKey).hasStock) occupied++
    }
    return { total: rows.length, occupied, empty: rows.length - occupied }
  }, [rows, phanTramKey, quantityKey])

  if (loading) {
    return <p className="px-4 py-8 text-center text-sm text-gray-400">Đang tải…</p>
  }

  if (!groups.length) {
    return <p className="px-4 py-8 text-center text-sm text-gray-400">{emptyText}</p>
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2">
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
          <span className="font-medium text-gray-500">{phanTramKey ? 'Mức lấp đầy:' : 'Trạng thái:'}</span>
          {(phanTramKey ? LEGEND : [LEGEND[0], LEGEND[1]]).map((l) => (
            <span key={l.label} className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: l.color }} />
              {phanTramKey ? l.label : l.color === '#e5e7eb' ? 'Trống' : 'Có hàng'}
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
          const occupied = group.items.filter((i) => rowFill(i, phanTramKey, quantityKey).hasStock).length
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
                    fields={fields}
                    phanTramKey={phanTramKey}
                    quantityKey={quantityKey}
                    onClick={setSelected}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>

      {selected && (
        <ViTriDetailModal
          row={selected}
          fields={fields}
          phanTramKey={phanTramKey}
          quantityKey={quantityKey}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}

import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatNumber } from '@/utils/tableFormat'

export interface DuBaoBar {
  key: string
  name: string
  color: string
}

interface DuBaoViewProps {
  rows: Record<string, unknown>[]
  loading?: boolean
  /** Các cột số liệu vẽ cột chồng (kệ dùng / giải phóng / thêm…). */
  bars: DuBaoBar[]
  title?: string
  /** Chỉ vẽ biểu đồ % sức chứa theo tuần. */
  simplified?: boolean
}

function pctColor(pct: number) {
  if (pct >= 90) return '#ef4444'
  if (pct >= 70) return '#f59e0b'
  return '#3b82f6'
}

/**
 * Dự báo kho theo tuần — dùng chung cho nguyên liệu (kệ) / thành phẩm (khối).
 * `bars` cấu hình các cột số liệu; cột `sucChua` là % sức chứa, `tuan` là trục hoành.
 */
export default function DuBaoView({ rows, loading = false, bars, title, simplified = false }: DuBaoViewProps) {
  const data = useMemo<(Record<string, unknown> & { _pct: number })[]>(() => {
    return ((rows ?? []) as Record<string, unknown>[]).map((row) => ({
      ...row,
      _pct: parseFloat(String(row.sucChua ?? '0')) || 0,
    }))
  }, [rows])

  if (loading) {
    return <p className="px-4 py-8 text-center text-sm text-gray-400">Đang tải…</p>
  }

  if (!data.length) {
    return <p className="px-4 py-8 text-center text-sm text-gray-400">Không có dữ liệu dự báo</p>
  }

  const heading = title ?? (simplified ? '% Sức chứa theo tuần' : 'Dự báo kho theo tuần')

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <section className="flex shrink-0 flex-col rounded-lg border border-gray-200 bg-white p-3" style={{ height: 280 }}>
        <h3 className="mb-2 text-sm font-semibold text-gray-800">{heading}</h3>
        <div className="min-h-0 flex-1">
          <ResponsiveContainer width="100%" height="100%">
            {simplified ? (
              <BarChart data={data} margin={{ top: 8, right: 36, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="tuan" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} domain={[0, 100]} width={44} />
                <Tooltip
                  formatter={(value) => [`${value}%`, '% Sức chứa']}
                  labelFormatter={(label) => `Tuần: ${label}`}
                />
                <ReferenceLine
                  y={70}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  label={{ value: '70%', position: 'right', fontSize: 10, fill: '#f59e0b' }}
                />
                <ReferenceLine
                  y={90}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  label={{ value: '90%', position: 'right', fontSize: 10, fill: '#ef4444' }}
                />
                <Bar dataKey="_pct" name="% Sức chứa" radius={[4, 4, 0, 0]}>
                  {data.map((entry, i) => (
                    <Cell key={(entry.tuan as string) ?? i} fill={pctColor(entry._pct)} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="tuan" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatNumber(v)} width={56} />
                <Tooltip
                  formatter={(value, name) => [formatNumber(value), name]}
                  labelFormatter={(label) => `Tuần: ${label}`}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {bars.map((b) => (
                  <Bar key={b.key} dataKey={b.key} name={b.name} fill={b.color} radius={[4, 4, 0, 0]} />
                ))}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </section>

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-gray-300 bg-white">
        <div className="min-h-0 flex-1 overflow-auto">
          <table className="min-w-full border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-gray-100 text-[11px] font-semibold text-gray-600">
              <tr>
                <th className="border-b border-r border-gray-300 px-3 py-1.5 text-left">Tuần</th>
                {bars.map((b) => (
                  <th key={b.key} className="border-b border-r border-gray-300 px-3 py-1.5 text-right">
                    {b.name}
                  </th>
                ))}
                <th className="border-b border-gray-300 px-3 py-1.5 text-right">% Sức chứa</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={(row.tuan as string) ?? i} className="odd:bg-slate-50 hover:bg-blue-50">
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 font-medium text-gray-800">
                    {row.tuan as string}
                  </td>
                  {bars.map((b) => (
                    <td key={b.key} className="border-b border-r border-gray-200 px-3 py-1.5 text-right tabular-nums">
                      {formatNumber(row[b.key])}
                    </td>
                  ))}
                  <td className="border-b border-gray-200 px-3 py-1.5 text-right tabular-nums">
                    <span
                      className="inline-block rounded-full px-2 py-0.5 text-[11px] font-medium"
                      style={{ backgroundColor: `${pctColor(row._pct)}20`, color: pctColor(row._pct) }}
                    >
                      {row._pct}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

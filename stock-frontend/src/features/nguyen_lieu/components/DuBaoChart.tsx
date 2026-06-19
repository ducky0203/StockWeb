import { useEffect, useMemo } from 'react'
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
import { fetchNLDuBao } from '@/features/nguyen_lieu/reducer'
import { useAppDispatch, useAppSelector } from '@/store'

interface DuBaoRow {
  id_DuBaoKho?: number
  tuan?: string
  soKeDung?: number
  soKeGiaiPhong?: number
  soKeThem?: number
  sucChua?: string
  chiNhanh?: string
}

interface DuBaoChartProps {
  kho: any
  simplified?: boolean
}

function pctColor(pct: number) {
  if (pct >= 90) return '#ef4444'
  if (pct >= 70) return '#f59e0b'
  return '#3b82f6'
}

export default function DuBaoChart({ kho, simplified = false }: DuBaoChartProps) {
  const dispatch = useAppDispatch()
  const { loading, listDuBao } = useAppSelector((state) => state.NguyenLieuReducer)

  useEffect(() => {
    if (kho?.id_Kho < 0) return
    dispatch(fetchNLDuBao(kho))
  }, [dispatch, kho])

  const rows = listDuBao as DuBaoRow[]
  const data = useMemo(() => {
    return (rows ?? []).map((row) => ({
      ...row,
      _pct: parseFloat(row.sucChua ?? '0') || 0,
    }))
  }, [rows])

  if (loading) {
    return <p className="px-4 py-8 text-center text-sm text-gray-400">Đang tải…</p>
  }

  if (!data.length) {
    return <p className="px-4 py-8 text-center text-sm text-gray-400">Không có dữ liệu dự báo</p>
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <section className="flex shrink-0 flex-col rounded-lg border border-gray-200 bg-white p-3" style={{ height: 280 }}>
        <h3 className="mb-2 text-sm font-semibold text-gray-800">
          {simplified ? '% Sức chứa theo tuần' : 'Dự báo kệ theo tuần'}
        </h3>
        <div className="min-h-0 flex-1">
          <ResponsiveContainer width="100%" height="100%">
            {simplified ? (
              <BarChart data={data} margin={{ top: 8, right: 36, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="tuan" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 100]}
                  width={44}
                />
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
                  {data.map((entry) => (
                    <Cell key={entry.id_DuBaoKho ?? entry.tuan} fill={pctColor(entry._pct)} />
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
                <Bar dataKey="soKeDung" name="Kệ đang dùng" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="soKeGiaiPhong" name="Kệ giải phóng" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="soKeThem" name="Kệ thêm" fill="#f59e0b" radius={[4, 4, 0, 0]} />
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
                <th className="border-b border-r border-gray-300 px-3 py-1.5 text-right">Kệ dùng</th>
                <th className="border-b border-r border-gray-300 px-3 py-1.5 text-right">Giải phóng</th>
                <th className="border-b border-r border-gray-300 px-3 py-1.5 text-right">Thêm</th>
                <th className="border-b border-gray-300 px-3 py-1.5 text-right">% Sức chứa</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id_DuBaoKho ?? row.tuan} className="odd:bg-slate-50 hover:bg-blue-50">
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 font-medium text-gray-800">
                    {row.tuan}
                  </td>
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 text-right tabular-nums">
                    {formatNumber(row.soKeDung)}
                  </td>
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 text-right tabular-nums">
                    {formatNumber(row.soKeGiaiPhong)}
                  </td>
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 text-right tabular-nums">
                    {formatNumber(row.soKeThem)}
                  </td>
                  <td className="border-b border-gray-200 px-3 py-1.5 text-right tabular-nums">
                    <span
                      className="inline-block rounded-full px-2 py-0.5 text-[11px] font-medium"
                      style={{
                        backgroundColor: `${pctColor(row._pct)}20`,
                        color: pctColor(row._pct),
                      }}
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

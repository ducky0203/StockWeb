import { useEffect, useMemo } from 'react'
import { Cell, Label, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { formatNumber, parseHexColor } from '@/utils/tableFormat'
import { fetchNLStockTime } from '@/features/nguyen_lieu/reducer'
import { useAppDispatch, useAppSelector } from '@/store'

interface StockTimeRow {
  id_StockTime?: number
  ten_StockTime?: string
  mau?: string
  soLuong?: number
  giaTri?: number
  soLuong_SanPham?: number
  khoiLuong?: number
}

interface StockTimeChartProps {
  kho: any
}

type ChartRow = StockTimeRow & { color: string; label: string }

const RADIAN = Math.PI / 180

/**
 * Percentage drawn OUTSIDE each slice with a leader line — the thin donut ring clipped inner
 * labels, so push them out where they have room.
 * recharts v3 no longer feeds `percent` into the Pie `label` render fn, so compute it ourselves
 * from the slice value and the known total.
 */
function makeRenderPct(valueKey: 'soLuong' | 'giaTri', total: number) {
  // recharts' PieLabelRenderProps are all loosely typed/optional, so coerce here.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function renderPct(props: any) {
    const value: number = Number(props?.payload?.[valueKey] ?? props.value ?? 0)
    const percent = total > 0 ? value / total : 0
    // show every slice's %, including small ones — only skip true zeros
    if (percent <= 0) return null
    const cx = Number(props.cx)
    const cy = Number(props.cy)
    const outerRadius = Number(props.outerRadius)
    const midAngle = Number(props.midAngle)
    const cos = Math.cos(-midAngle * RADIAN)
    const sin = Math.sin(-midAngle * RADIAN)
    // start on the slice edge, elbow just outside, then a short horizontal run to the text
    const sx = cx + outerRadius * cos
    const sy = cy + outerRadius * sin
    const ex = cx + (outerRadius + 12) * cos
    const ey = cy + (outerRadius + 12) * sin
    const onRight = cos >= 0
    const tx = ex + (onRight ? 10 : -10)
    const color = props?.fill ?? '#6b7280'
    return (
      <g>
        <path d={`M${sx},${sy}L${ex},${ey}L${tx},${ey}`} stroke={color} fill="none" strokeWidth={1} />
        <text
          x={tx + (onRight ? 2 : -2)}
          y={ey}
          textAnchor={onRight ? 'start' : 'end'}
          dominantBaseline="central"
          fill="#374151"
          fontSize={11}
          fontWeight={700}
        >
          {Math.round(percent * 100)}%
        </text>
      </g>
    )
  }
}

function CenterLabel({
  viewBox,
  total,
  caption,
}: {
  viewBox?: { cx?: number; cy?: number }
  total: number
  caption: string
}) {
  const cx = viewBox?.cx ?? 0
  const cy = viewBox?.cy ?? 0
  return (
    <g>
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize={14} fontWeight={700} fill="#111827">
        {formatNumber(total)}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize={10} fill="#6b7280">
        {caption}
      </text>
    </g>
  )
}

function PieTooltip({
  active,
  payload,
  valueKey,
  total,
}: {
  active?: boolean
  payload?: Array<{ payload: ChartRow }>
  valueKey: 'soLuong' | 'giaTri'
  total: number
}) {
  if (!active || !payload?.length) return null
  const row = payload[0].payload
  const value = (row[valueKey] as number) ?? 0
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-gray-800">{row.ten_StockTime}</p>
      <p className="text-gray-600">
        {valueKey === 'soLuong' ? 'Số lượng' : 'Giá trị'}: {formatNumber(value)} ({pct}%)
      </p>
    </div>
  )
}

function Donut({
  data,
  valueKey,
  total,
  caption,
}: {
  data: ChartRow[]
  valueKey: 'soLuong' | 'giaTri'
  total: number
  caption: string
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey={valueKey}
          nameKey="label"
          cx="50%"
          cy="50%"
          innerRadius="42%"
          outerRadius="62%"
          paddingAngle={2}
          labelLine={false}
          label={makeRenderPct(valueKey, total)}
          isAnimationActive={false}
        >
          {data.map((entry) => (
            <Cell key={entry.id_StockTime ?? entry.label} fill={entry.color} stroke="#fff" strokeWidth={1} />
          ))}
          <Label position="center" content={<CenterLabel total={total} caption={caption} />} />
        </Pie>
        <Tooltip content={<PieTooltip valueKey={valueKey} total={total} />} />
        <Legend iconSize={9} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default function StockTimeChart({ kho }: StockTimeChartProps) {
  const dispatch = useAppDispatch()
  const { loading, listStockTime } = useAppSelector((state) => state.NguyenLieuReducer)

  useEffect(() => {
    if (kho?.id_Kho < 0) return
    dispatch(fetchNLStockTime(kho))
  }, [dispatch, kho])

  const rows = listStockTime as StockTimeRow[]
  const data = useMemo<ChartRow[]>(
    () =>
      (rows ?? []).map((row) => ({
        ...row,
        label: row.ten_StockTime ?? '',
        color: parseHexColor(row.mau) ?? '#6366f1',
      })),
    [rows],
  )

  const totals = useMemo(
    () => ({
      soLuong: data.reduce((sum, r) => sum + (r.soLuong ?? 0), 0),
      giaTri: data.reduce((sum, r) => sum + (r.giaTri ?? 0), 0),
    }),
    [data],
  )

  if (loading) {
    return <p className="px-4 py-8 text-center text-sm text-gray-400">Đang tải…</p>
  }

  if (!data.length) {
    return <p className="px-4 py-8 text-center text-sm text-gray-400">Không có dữ liệu stock time</p>
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="grid shrink-0 grid-cols-2 gap-3" style={{ height: 280 }}>
        <section className="flex min-h-0 flex-col rounded-lg border border-gray-200 bg-white p-3">
          <h3 className="mb-1 text-sm font-semibold text-gray-800">Phân bổ số lượng</h3>
          <div className="min-h-0 flex-1">
            <Donut data={data} valueKey="soLuong" total={totals.soLuong} caption="Tổng SL" />
          </div>
        </section>

        <section className="flex min-h-0 flex-col rounded-lg border border-gray-200 bg-white p-3">
          <h3 className="mb-1 text-sm font-semibold text-gray-800">Phân bổ giá trị</h3>
          <div className="min-h-0 flex-1">
            <Donut data={data} valueKey="giaTri" total={totals.giaTri} caption="Tổng GT" />
          </div>
        </section>
      </div>

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-gray-300 bg-white">
        <div className="min-h-0 flex-1 overflow-auto">
          <table className="min-w-full border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-gray-100 text-[11px] font-semibold text-gray-600">
              <tr>
                <th className="border-b border-r border-gray-300 px-3 py-1.5 text-left">Mốc thời gian</th>
                <th className="border-b border-r border-gray-300 px-3 py-1.5 text-right">Số lượng</th>
                <th className="border-b border-gray-300 px-3 py-1.5 text-right">Giá trị</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id_StockTime ?? row.label} className="odd:bg-slate-50 hover:bg-blue-50">
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 font-medium text-gray-800">
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: row.color }}
                      />
                      {row.label}
                    </span>
                  </td>
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 text-right tabular-nums">
                    {formatNumber(row.soLuong)}
                  </td>
                  <td className="border-b border-gray-200 px-3 py-1.5 text-right tabular-nums">
                    {formatNumber(row.giaTri)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="sticky bottom-0 bg-gray-50 text-xs font-semibold text-gray-700">
              <tr>
                {/* border-collapse drops borders on sticky cells, so draw top+bottom edges via box-shadow */}
                <td
                  className="border-r border-gray-300 px-3 py-1.5"
                  style={{ boxShadow: 'inset 0 1px 0 #d1d5db, inset 0 -1px 0 #d1d5db' }}
                >
                  Tổng
                </td>
                <td
                  className="border-r border-gray-300 px-3 py-1.5 text-right tabular-nums"
                  style={{ boxShadow: 'inset 0 1px 0 #d1d5db, inset 0 -1px 0 #d1d5db' }}
                >
                  {formatNumber(totals.soLuong)}
                </td>
                <td
                  className="px-3 py-1.5 text-right tabular-nums"
                  style={{ boxShadow: 'inset 0 1px 0 #d1d5db, inset 0 -1px 0 #d1d5db' }}
                >
                  {formatNumber(totals.giaTri)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>
  )
}

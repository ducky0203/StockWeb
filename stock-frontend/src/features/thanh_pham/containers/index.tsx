import { useMemo, useState } from 'react'
import type { JSX } from 'react'
import { Download, RefreshCw } from 'lucide-react'
import TPStockTable from '@/features/thanh_pham/components/TPStockTable'
import TPTrucQuanGrid from '@/features/thanh_pham/components/TPTrucQuanGrid'
import TPStockTimeChart from '@/features/thanh_pham/components/TPStockTimeChart'
import TPDuBaoChart from '@/features/thanh_pham/components/TPDuBaoChart'
import { tpStockColumns } from '@/features/thanh_pham/columns'
import { useAppDispatch, useAppSelector } from '@/store'
import { thanhPhamUpdateData } from '@/features/thanh_pham/reducer'
import { exportTableToExcel } from '@/utils/exportExcel'

type TabKey = 'stock' | 'trucQuan' | 'stockTime'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'stock', label: 'Tồn kho' },
  { key: 'trucQuan', label: 'Trực quan' },
  { key: 'stockTime', label: 'Stock Time' },
]

export default function ThanhPhamPage(): JSX.Element {
  const dispatch = useAppDispatch()
  const [tab, setTab] = useState<TabKey>('stock')
  const { listChiNhanh } = useAppSelector((state) => state.ConfigReducer)
  const { listStock, chiNhanhSelected } = useAppSelector((state) => state.ThanhPhamReducer)

  const listChiNhanhConvert = useMemo(
    () => [{ maChiNhanh: '00', tenChiNhanh: 'Tất cả' }].concat(listChiNhanh as any),
    [listChiNhanh],
  )

  const [reloadKey, setReloadKey] = useState(0)

  const stockRows = listStock as Record<string, unknown>[]

  const handleExport = () => {
    if (!stockRows.length) return
    void exportTableToExcel({
      columns: tpStockColumns,
      data: stockRows,
      fileName: `ton-kho-tp-${chiNhanhSelected.maChiNhanh ?? 'all'}.xlsx`,
    })
  }

  const _onSelectChiNhanh = (maChiNhanh: string) => {
    if (maChiNhanh === '-1') return
    dispatch(
      thanhPhamUpdateData({
        chiNhanhSelected: listChiNhanhConvert.find((value: any) => value.maChiNhanh === maChiNhanh),
      }),
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
        <div className="flex items-center gap-4">
          <select
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700"
            value={chiNhanhSelected.maChiNhanh ?? ''}
            onChange={(e) => _onSelectChiNhanh(e.target.value)}
          >
            <option value={'-1'}>
              -- Chọn chi nhánh --
            </option>
            {listChiNhanhConvert.map((c: any) => (
              <option key={c.maChiNhanh} value={c.maChiNhanh}>
                {c.tenChiNhanh}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
            onClick={() => setReloadKey((k) => k + 1)}
          >
            <RefreshCw size={14} />
            Tải lại
          </button>
          {tab === 'stock' && (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
              onClick={handleExport}
            >
              <Download size={14} />
              Excel
            </button>
          )}
        </div>
      </header>

      <div className="flex shrink-0 gap-1 border-b border-gray-200 bg-white px-6 pt-2">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === item.key
                ? 'border border-b-white border-gray-200 bg-white text-blue-600'
                : 'text-gray-500 hover:text-gray-800'
            }`}
            onClick={() => setTab(item.key)}
          >
            {item.label}
            {item.key === 'stock' && stockRows.length > 0 && (
              <span className="ml-1.5 text-xs text-gray-400">({stockRows.length})</span>
            )}
          </button>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-4">
        {tab === 'stock' && <TPStockTable key={reloadKey} chiNhanh={chiNhanhSelected} />}
        {tab === 'trucQuan' && <TPTrucQuanGrid key={reloadKey} chiNhanh={chiNhanhSelected} />}
        {tab === 'stockTime' && (
          <div className="flex min-h-0 flex-1 gap-4">
            <div className="flex min-h-0 flex-1 flex-col">
              <TPStockTimeChart key={reloadKey} chiNhanh={chiNhanhSelected} />
            </div>
            <div className="flex min-h-0 flex-1 flex-col">
              <TPDuBaoChart key={reloadKey} chiNhanh={chiNhanhSelected} simplified />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

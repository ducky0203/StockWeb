import { useMemo, useState } from 'react'
import type { JSX } from 'react'
import { Download, RefreshCw } from 'lucide-react'
import NLStockTable from '@/features/nguyen_lieu/components/NLStockTable'
import TrucQuanDayGrid from '@/features/nguyen_lieu/components/TrucQuanDayGrid'
import StockTimeChart from '@/features/nguyen_lieu/components/StockTimeChart'
import DuBaoChart from '@/features/nguyen_lieu/components/DuBaoChart'
import { nlStockColumns, stockTimeBands, filterStockByTime } from '@/features/nguyen_lieu/columns'
import type { StockTimeBand } from '@/features/nguyen_lieu/columns'
import { useAppDispatch, useAppSelector } from '@/store'
import { nguyenLieuUpdateData } from '@/features/nguyen_lieu/reducer'
import { exportTableToExcel } from '@/utils/exportExcel'

type TabKey = 'stock' | 'trucQuan' | 'stockTime'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'stock', label: 'Tồn kho' },
  { key: 'trucQuan', label: 'Trực quan' },
  { key: 'stockTime', label: 'Stock Time' },
]

export default function NguyenLieuPage(): JSX.Element {
  const dispatch = useAppDispatch()
  const [tab, setTab] = useState<TabKey>('stock')
  const { listKho } = useAppSelector((state) => state.ConfigReducer)
  const { listStock, khoSelected } = useAppSelector((state) => state.NguyenLieuReducer)

  const listKhoConvert = useMemo(() => {
    return [{id_Kho: 0, ten_Kho: "Tất cả", maChiNhanh: "00"}].concat(listKho.filter(i => i.loaiKho === 1) as any);
  }, [listKho]);

  // Bộ lọc thời gian lưu kho
  const [timeBand, setTimeBand] = useState<StockTimeBand>('all')

  // Bump để remount tab đang mở -> các component tự fetch lại
  const [reloadKey, setReloadKey] = useState(0)

  const stockRows = listStock as Record<string, unknown>[]
  const filteredStockRows = useMemo(
    () => filterStockByTime(stockRows, timeBand),
    [stockRows, timeBand],
  )

  const handleExport = () => {
    if (!filteredStockRows.length) return
    void exportTableToExcel({
      columns: nlStockColumns,
      data: filteredStockRows,
      fileName: `ton-kho-nl-${khoSelected.id_Kho ?? 'all'}.xlsx`,
    })
  }

  const _onSelectKho = (id_Kho: any) => {
    if (Number(id_Kho) === -1) return
    dispatch(
      nguyenLieuUpdateData({
        khoSelected: listKhoConvert.find((value: any) => value.id_Kho === Number(id_Kho)),
      }),
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
        <div className="flex items-center gap-4">
          <select
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700"
            value={khoSelected.id_Kho ?? ''}
            onChange={(e) => _onSelectKho(e.target.value)}//setKhoSelected(listKho.find((value: any) => value.id_Kho === e.target.value))}
          >
            <option value={-1}>-- Chọn kho --</option>
            {listKhoConvert.map((k: any) => (
              <option key={k.id_Kho} value={k.id_Kho}>
                {k.ten_Kho}
              </option>
            ))}
          </select>
          {tab === 'stock' && (
            <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5">
              {stockTimeBands.map((b) => (
                <button
                  key={b.key}
                  type="button"
                  className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                    timeBand === b.key
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setTimeBand(b.key)}
                >
                  {b.label}
                </button>
              ))}
            </div>
          )}
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
            {item.key === 'stock' && filteredStockRows.length > 0 && (
              <span className="ml-1.5 text-xs text-gray-400">({filteredStockRows.length})</span>
            )}
          </button>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-4">
        {tab === 'stock' && <NLStockTable key={reloadKey} kho={khoSelected} band={timeBand} />}
        {tab === 'trucQuan' && <TrucQuanDayGrid key={reloadKey} kho={khoSelected} />}
        {tab === 'stockTime' && (
          <div className="flex min-h-0 flex-1 gap-4">
            <div className="flex min-h-0 flex-1 flex-col">
              <StockTimeChart key={reloadKey} kho={khoSelected} />
            </div>
            <div className="flex min-h-0 flex-1 flex-col">
              <DuBaoChart key={reloadKey} kho={khoSelected} simplified />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

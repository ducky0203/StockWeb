import { useMemo, useState } from 'react'
import type { JSX } from 'react'
import { Download, RefreshCw } from 'lucide-react'
import PLStockTable from '@/features/phu_lieu/components/PLStockTable'
import PLTrucQuanGrid from '@/features/phu_lieu/components/PLTrucQuanGrid'
import { plStockColumns } from '@/features/phu_lieu/columns'
import { useAppDispatch, useAppSelector } from '@/store'
import { phuLieuUpdateData } from '@/features/phu_lieu/reducer'
import { exportTableToExcel } from '@/utils/exportExcel'

type TabKey = 'stock' | 'trucQuan'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'stock', label: 'Tồn kho' },
  { key: 'trucQuan', label: 'Trực quan' },
]

export default function PhuLieuPage(): JSX.Element {
  const dispatch = useAppDispatch()
  const [tab, setTab] = useState<TabKey>('stock')
  const { listKho } = useAppSelector((state) => state.ConfigReducer)
  const { listStock, khoSelected } = useAppSelector((state) => state.PhuLieuReducer)

  // Kho phụ liệu: LoaiKho === 2
  const listKhoConvert = useMemo(() => {
    return [{ id_Kho: 0, ten_Kho: 'Tất cả', maChiNhanh: '00' }].concat(
      listKho.filter((i) => i.loaiKho === 2) as any,
    )
  }, [listKho])

  const [reloadKey, setReloadKey] = useState(0)

  const stockRows = listStock as Record<string, unknown>[]

  const handleExport = () => {
    if (!stockRows.length) return
    void exportTableToExcel({
      columns: plStockColumns,
      data: stockRows,
      fileName: `ton-kho-pl-${khoSelected.id_Kho ?? 'all'}.xlsx`,
    })
  }

  const _onSelectKho = (id_Kho: any) => {
    if (id_Kho === -1) return
    dispatch(
      phuLieuUpdateData({
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
            onChange={(e) => _onSelectKho(e.target.value)}
          >
            <option value={-1}>-- Chọn kho --</option>
            {listKhoConvert.map((k: any) => (
              <option key={k.id_Kho} value={k.id_Kho}>
                {k.ten_Kho}
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
        {tab === 'stock' && <PLStockTable key={reloadKey} kho={khoSelected} />}
        {tab === 'trucQuan' && <PLTrucQuanGrid key={reloadKey} kho={khoSelected} />}
      </div>
    </div>
  )
}

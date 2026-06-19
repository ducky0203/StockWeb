import { useEffect, useState } from 'react'
import type { JSX } from 'react'
import { Download, Search } from 'lucide-react'
import VirtualDataTable from '@/components/VirtualDataTable'
import { packingListColumns } from '@/features/packinglist/columns'
import { fetchPackingList } from '@/features/packinglist/reducer'
import { useAppDispatch, useAppSelector } from '@/store'
import { exportTableToExcel } from '@/utils/exportExcel'

function toInputDate(d: Date): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function PackingListPage(): JSX.Element {
  const dispatch = useAppDispatch()
  const { loading, listPackingList } = useAppSelector((state) => state.PackingListReducer)

  const today = new Date()
  const startOfYear = new Date(today.getFullYear(), 0, 1)

  const [tuNgay, setTuNgay] = useState<string>(toInputDate(startOfYear))
  const [denNgay, setDenNgay] = useState<string>(toInputDate(today))

  const rows = (listPackingList ?? []) as Record<string, unknown>[]

  const load = () => {
    dispatch(fetchPackingList({ tuNgay, denNgay }))
  }

  // Tự tải lần đầu theo khoảng ngày mặc định.
  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleExport = () => {
    if (!rows.length) return
    void exportTableToExcel({
      columns: packingListColumns,
      data: rows,
      fileName: `packing-list-${tuNgay}_${denNgay}.xlsx`,
    })
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Từ</span>
            <input
              type="date"
              className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-700"
              value={tuNgay}
              max={denNgay}
              onChange={(e) => setTuNgay(e.target.value)}
            />
            <span>đến</span>
            <input
              type="date"
              className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-700"
              value={denNgay}
              min={tuNgay}
              onChange={(e) => setDenNgay(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
            onClick={load}
          >
            <Search size={14} />
            Xem
          </button>
          {rows.length > 0 && <span className="text-xs text-gray-400">({rows.length})</span>}
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
          onClick={handleExport}
        >
          <Download size={14} />
          Excel
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col p-4">
        <VirtualDataTable filterable columns={packingListColumns} data={rows} loading={loading} />
      </div>
    </div>
  )
}

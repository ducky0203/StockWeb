import { useEffect, useMemo } from 'react'
import VirtualDataTable from '@/components/VirtualDataTable'
import { plStockColumns } from '@/features/phu_lieu/columns'
import { fetchPLStock } from '@/features/phu_lieu/reducer'
import { filterStockByTime } from '@/utils/stockTimeBand'
import type { StockTimeBand } from '@/utils/stockTimeBand'
import { useAppDispatch, useAppSelector } from '@/store'

interface PLStockTableProps {
  kho: any
  band?: StockTimeBand
}

export default function PLStockTable({ kho, band = 'all' }: PLStockTableProps) {
  const dispatch = useAppDispatch()
  const { loading, listStock } = useAppSelector((state) => state.PhuLieuReducer)

  useEffect(() => {
    if (kho?.id_Kho < 0) return
    dispatch(fetchPLStock(kho))
  }, [dispatch, kho])

  const rows = listStock as Record<string, unknown>[]
  const filteredRows = useMemo(() => filterStockByTime(rows, band, 'ngay'), [rows, band])

  return <VirtualDataTable filterable columns={plStockColumns} data={filteredRows} loading={loading} />
}

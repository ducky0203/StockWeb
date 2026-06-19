import { useEffect, useMemo } from 'react'
import VirtualDataTable from '@/components/VirtualDataTable'
import { nlStockColumns, filterStockByTime } from '@/features/nguyen_lieu/columns'
import type { StockTimeBand } from '@/features/nguyen_lieu/columns'
import { fetchNLStock } from '@/features/nguyen_lieu/reducer'
import { useAppDispatch, useAppSelector } from '@/store'

interface NLStockTableProps {
  kho: any
  band?: StockTimeBand
}

export default function NLStockTable({ kho, band = 'all' }: NLStockTableProps) {
  const dispatch = useAppDispatch()
  const { loading, listStock } = useAppSelector((state) => state.NguyenLieuReducer)

  useEffect(() => {
    if (kho?.id_Kho < 0) return
    dispatch(fetchNLStock(kho))
  }, [dispatch, kho])

  const rows = listStock as Record<string, unknown>[]
  const filteredRows = useMemo(() => filterStockByTime(rows, band), [rows, band])

  return <VirtualDataTable filterable columns={nlStockColumns} data={filteredRows} loading={loading} />
}

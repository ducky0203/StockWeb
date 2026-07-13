import { useEffect, useMemo } from 'react'
import VirtualDataTable from '@/components/VirtualDataTable'
import { tpStockColumns } from '@/features/thanh_pham/columns'
import { fetchTPStock } from '@/features/thanh_pham/reducer'
import { filterStockByTime } from '@/utils/stockTimeBand'
import type { StockTimeBand } from '@/utils/stockTimeBand'
import { useAppDispatch, useAppSelector } from '@/store'

interface TPStockTableProps {
  chiNhanh: any
  band?: StockTimeBand
}

export default function TPStockTable({ chiNhanh, band = 'all' }: TPStockTableProps) {
  const dispatch = useAppDispatch()
  const { loading, listStock } = useAppSelector((state) => state.ThanhPhamReducer)

  useEffect(() => {
    if (!chiNhanh?.maChiNhanh || chiNhanh.maChiNhanh === '-1') return
    dispatch(fetchTPStock(chiNhanh))
  }, [dispatch, chiNhanh])

  const rows = listStock as Record<string, unknown>[]
  const filteredRows = useMemo(() => filterStockByTime(rows, band, 'ngay'), [rows, band])

  return <VirtualDataTable filterable columns={tpStockColumns} data={filteredRows} loading={loading} />
}

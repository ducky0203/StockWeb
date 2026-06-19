import { useEffect } from 'react'
import VirtualDataTable from '@/components/VirtualDataTable'
import { plStockColumns } from '@/features/phu_lieu/columns'
import { fetchPLStock } from '@/features/phu_lieu/reducer'
import { useAppDispatch, useAppSelector } from '@/store'

interface PLStockTableProps {
  kho: any
}

export default function PLStockTable({ kho }: PLStockTableProps) {
  const dispatch = useAppDispatch()
  const { loading, listStock } = useAppSelector((state) => state.PhuLieuReducer)

  useEffect(() => {
    if (kho?.id_Kho < 0) return
    dispatch(fetchPLStock(kho))
  }, [dispatch, kho])

  const rows = listStock as Record<string, unknown>[]

  return <VirtualDataTable filterable columns={plStockColumns} data={rows} loading={loading} />
}

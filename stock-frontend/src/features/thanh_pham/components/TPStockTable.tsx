import { useEffect } from 'react'
import VirtualDataTable from '@/components/VirtualDataTable'
import { tpStockColumns } from '@/features/thanh_pham/columns'
import { fetchTPStock } from '@/features/thanh_pham/reducer'
import { useAppDispatch, useAppSelector } from '@/store'

interface TPStockTableProps {
  chiNhanh: any
}

export default function TPStockTable({ chiNhanh }: TPStockTableProps) {
  const dispatch = useAppDispatch()
  const { loading, listStock } = useAppSelector((state) => state.ThanhPhamReducer)

  useEffect(() => {
    if (!chiNhanh?.maChiNhanh || chiNhanh.maChiNhanh === '-1') return
    dispatch(fetchTPStock(chiNhanh))
  }, [dispatch, chiNhanh])

  const rows = listStock as Record<string, unknown>[]

  return <VirtualDataTable filterable columns={tpStockColumns} data={rows} loading={loading} />
}

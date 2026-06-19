import { useEffect } from 'react'
import StockTimeView from '@/components/StockTimeView'
import { fetchTPStockTime } from '@/features/thanh_pham/reducer'
import { useAppDispatch, useAppSelector } from '@/store'

interface TPStockTimeChartProps {
  chiNhanh: any
}

export default function TPStockTimeChart({ chiNhanh }: TPStockTimeChartProps) {
  const dispatch = useAppDispatch()
  const { loading, listStockTime } = useAppSelector((state) => state.ThanhPhamReducer)

  useEffect(() => {
    if (!chiNhanh?.maChiNhanh || chiNhanh.maChiNhanh === '-1') return
    dispatch(fetchTPStockTime(chiNhanh))
  }, [dispatch, chiNhanh])

  return <StockTimeView rows={listStockTime as Record<string, unknown>[]} loading={loading} />
}

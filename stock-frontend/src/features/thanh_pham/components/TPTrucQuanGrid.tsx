import { useEffect } from 'react'
import TrucQuanGrid from '@/components/TrucQuanGrid'
import { tpTrucQuanFields } from '@/features/thanh_pham/columns'
import { fetchTPTrucQuan } from '@/features/thanh_pham/reducer'
import { useAppDispatch, useAppSelector } from '@/store'

interface TPTrucQuanGridProps {
  chiNhanh: any
}

export default function TPTrucQuanGrid({ chiNhanh }: TPTrucQuanGridProps) {
  const dispatch = useAppDispatch()
  const { loading, listTrucQuan } = useAppSelector((state) => state.ThanhPhamReducer)

  useEffect(() => {
    if (!chiNhanh?.maChiNhanh || chiNhanh.maChiNhanh === '-1') return
    dispatch(fetchTPTrucQuan({ ...chiNhanh, search: '' }))
  }, [dispatch, chiNhanh])

  const rows = listTrucQuan as Record<string, unknown>[]

  return <TrucQuanGrid rows={rows} loading={loading} fields={tpTrucQuanFields} phanTramKey="phanTram" />
}

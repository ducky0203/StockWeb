import { useEffect } from 'react'
import TrucQuanGrid from '@/components/TrucQuanGrid'
import { plTrucQuanFields } from '@/features/phu_lieu/columns'
import { fetchPLTrucQuan } from '@/features/phu_lieu/reducer'
import { useAppDispatch, useAppSelector } from '@/store'

interface PLTrucQuanGridProps {
  kho: any
}

export default function PLTrucQuanGrid({ kho }: PLTrucQuanGridProps) {
  const dispatch = useAppDispatch()
  const { loading, listTrucQuan } = useAppSelector((state) => state.PhuLieuReducer)

  useEffect(() => {
    if (kho?.id_Kho < 0) return
    dispatch(fetchPLTrucQuan({ ...kho, search: '' }))
  }, [dispatch, kho])

  const rows = listTrucQuan as Record<string, unknown>[]

  return <TrucQuanGrid rows={rows} loading={loading} fields={plTrucQuanFields} quantityKey="soLuong" />
}

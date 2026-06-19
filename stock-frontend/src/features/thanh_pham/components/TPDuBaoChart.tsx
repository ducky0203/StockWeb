import { useEffect } from 'react'
import DuBaoView from '@/components/DuBaoView'
import { tpDuBaoBars } from '@/features/thanh_pham/columns'
import { fetchTPDuBao } from '@/features/thanh_pham/reducer'
import { useAppDispatch, useAppSelector } from '@/store'

interface TPDuBaoChartProps {
  chiNhanh: any
  simplified?: boolean
}

export default function TPDuBaoChart({ chiNhanh, simplified = false }: TPDuBaoChartProps) {
  const dispatch = useAppDispatch()
  const { loading, listDuBao } = useAppSelector((state) => state.ThanhPhamReducer)

  useEffect(() => {
    if (!chiNhanh?.maChiNhanh || chiNhanh.maChiNhanh === '-1') return
    dispatch(fetchTPDuBao(chiNhanh))
  }, [dispatch, chiNhanh])

  return (
    <DuBaoView
      rows={listDuBao as Record<string, unknown>[]}
      loading={loading}
      bars={tpDuBaoBars}
      simplified={simplified}
      title={simplified ? '% Sức chứa theo tuần' : 'Dự báo kho TP theo tuần'}
    />
  )
}

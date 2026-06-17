import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface AsyncState {
  data: Record<string, unknown>[] | null
  loading: boolean
  error: string | null
}

interface PhuLieuState {
  stock: AsyncState
  trucQuan: AsyncState
  stockTime: AsyncState
}

function asyncState(): AsyncState {
  return { data: null, loading: false, error: null }
}

const initialState: PhuLieuState = {
  stock: asyncState(),
  trucQuan: asyncState(),
  stockTime: asyncState(),
}

const phuLieuSlice = createSlice({
  name: 'phuLieuSlice',
  initialState,
  reducers: {
    phuLieuUpdateData: (state, action: PayloadAction<Partial<PhuLieuState>>) => {
      Object.assign(state, action.payload)
    },
    fetchPLStock: (_state, _action: PayloadAction<number | undefined>) => {},
    fetchPLTrucQuan: (_state, _action: PayloadAction<{ idKho: number | undefined; search: string }>) => {},
    fetchPLStockTime: (_state, _action: PayloadAction<number | undefined>) => {},
  },
})

export const { phuLieuUpdateData, fetchPLStock, fetchPLTrucQuan, fetchPLStockTime } = phuLieuSlice.actions
export default phuLieuSlice.reducer

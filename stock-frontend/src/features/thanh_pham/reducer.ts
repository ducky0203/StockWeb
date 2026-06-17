import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface AsyncState {
  data: Record<string, unknown>[] | null
  loading: boolean
  error: string | null
}

interface ThanhPhamState {
  stock: AsyncState
  trucQuan: AsyncState
  stockTime: AsyncState
  duBao: AsyncState
}

function asyncState(): AsyncState {
  return { data: null, loading: false, error: null }
}

const initialState: ThanhPhamState = {
  stock: asyncState(),
  trucQuan: asyncState(),
  stockTime: asyncState(),
  duBao: asyncState(),
}

const thanhPhamSlice = createSlice({
  name: 'thanhPhamSlice',
  initialState,
  reducers: {
    thanhPhamUpdateData: (state, action: PayloadAction<Partial<ThanhPhamState>>) => {
      Object.assign(state, action.payload)
    },
    fetchTPStock: (_state, _action: PayloadAction<string | undefined>) => {},
    fetchTPTrucQuan: (_state, _action: PayloadAction<{ maChiNhanh: string | undefined; search: string }>) => {},
    fetchTPStockTime: (_state, _action: PayloadAction<string | undefined>) => {},
    fetchTPDuBao: (_state, _action: PayloadAction<string | undefined>) => {},
  },
})

export const { thanhPhamUpdateData, fetchTPStock, fetchTPTrucQuan, fetchTPStockTime, fetchTPDuBao } =
  thanhPhamSlice.actions
export default thanhPhamSlice.reducer

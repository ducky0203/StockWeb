import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  loading: false,
  khoSelected: { id_Kho: -1, ten_Kho: '-- Chọn kho --', maChiNhanh: '00' } as any,
  listStock: [],
  listTrucQuan: [],
}

const phuLieuSlice = createSlice({
  name: 'phuLieuSlice',
  initialState,
  reducers: {
    phuLieuUpdateData: (state, action: PayloadAction<any>) => {
      Object.assign(state, action.payload)
    },
    fetchPLStock: (_state, _action) => {},
    fetchPLTrucQuan: (_state, _action) => {},
  },
})

export const { phuLieuUpdateData, fetchPLStock, fetchPLTrucQuan } = phuLieuSlice.actions
export default phuLieuSlice.reducer

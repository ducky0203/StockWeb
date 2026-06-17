import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  loading: false,
  listStock: [],
  listTrucQuan: [],
  listStockTime: [],
  listDuBao: [],
}

const nguyenLieuSlice = createSlice({
  name: 'nguyenLieuSlice',
  initialState,
  reducers: {
    nguyenLieuUpdateData: (state, action: PayloadAction<any>) => {
      Object.assign(state, action.payload)
    },
    fetchNLStock: (_state, _action) => {},
    fetchNLTrucQuan: (_state, _action) => {},
    fetchNLStockTime: (_state, _action) => {},
    fetchNLDuBao: (_state, _action) => {},
  },
})

export const { nguyenLieuUpdateData, fetchNLStock, fetchNLTrucQuan, fetchNLStockTime, fetchNLDuBao } =
  nguyenLieuSlice.actions
export default nguyenLieuSlice.reducer

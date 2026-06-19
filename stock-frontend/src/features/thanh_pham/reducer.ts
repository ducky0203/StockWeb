import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  loading: false,
  chiNhanhSelected: { maChiNhanh: '-1', tenChiNhanh: '-- Chọn chi nhánh --' } as any,
  listStock: [],
  listTrucQuan: [],
  listStockTime: [],
  listDuBao: [],
}

const thanhPhamSlice = createSlice({
  name: 'thanhPhamSlice',
  initialState,
  reducers: {
    thanhPhamUpdateData: (state, action: PayloadAction<any>) => {
      Object.assign(state, action.payload)
    },
    fetchTPStock: (_state, _action) => {},
    fetchTPTrucQuan: (_state, _action) => {},
    fetchTPStockTime: (_state, _action) => {},
    fetchTPDuBao: (_state, _action) => {},
  },
})

export const { thanhPhamUpdateData, fetchTPStock, fetchTPTrucQuan, fetchTPStockTime, fetchTPDuBao } =
  thanhPhamSlice.actions
export default thanhPhamSlice.reducer

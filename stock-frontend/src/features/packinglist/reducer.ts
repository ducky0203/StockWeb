import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  listPackingList: [],
  loading: false,
}

const packingListSlice = createSlice({
  name: 'packingListSlice',
  initialState,
  reducers: {
    packingListUpdateData: (state, action: PayloadAction<any>) => {
      Object.assign(state, action.payload)
    },
    fetchPackingList: (_state, _action) => {},
  },
})

export const { packingListUpdateData, fetchPackingList } = packingListSlice.actions
export default packingListSlice.reducer

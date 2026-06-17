import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface PackingListState {
  listPackingList: Record<string, unknown>[] | null
  loading: boolean
  error: string | null
}

const initialState: PackingListState = {
  listPackingList: null,
  loading: false,
  error: null,
}

const packingListSlice = createSlice({
  name: 'packingListSlice',
  initialState,
  reducers: {
    packingListUpdateData: (state, action: PayloadAction<Partial<PackingListState>>) => {
      Object.assign(state, action.payload)
    },
    fetchPackingList: (_state, _action: PayloadAction<{ tuNgay: string; denNgay: string }>) => {},
  },
})

export const { packingListUpdateData, fetchPackingList } = packingListSlice.actions
export default packingListSlice.reducer

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface ConfigState {
  listKho: Record<string, unknown>[]
  listChiNhanh: Record<string, unknown>[]
  loading: boolean
  error: string | null
}

const initialState: ConfigState = {
  listKho: [],
  listChiNhanh: [],
  loading: false,
  error: null,
}

const configSlice = createSlice({
  name: 'configSlice',
  initialState,
  reducers: {
    configUpdateData: (state, action: PayloadAction<Partial<ConfigState>>) => {
      Object.assign(state, action.payload)
    },
    getConfig: () => {},
  },
})

export const { configUpdateData, getConfig } = configSlice.actions
export default configSlice.reducer

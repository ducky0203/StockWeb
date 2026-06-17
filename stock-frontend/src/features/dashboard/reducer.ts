import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  listKho: [],
  listChiNhanh: [],
}

const dashboardSlice = createSlice({
  name: "dashboardSlice",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    dashboardUpdateData: (state, action) => {
      Object.assign(state, action.payload);
    },
    getListConfig: () => {}
  }
});

export const {setLoading, dashboardUpdateData, getListConfig} = dashboardSlice.actions;
export default dashboardSlice.reducer;

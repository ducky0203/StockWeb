import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import configReducer from '@/features/config/reducer'
import dashboardReducer from '@/features/dashboard/reducer'
import nguyenLieuReducer from '@/features/nguyen_lieu/reducer'
import phuLieuReducer from '@/features/phu_lieu/reducer'
import thanhPhamReducer from '@/features/thanh_pham/reducer'
import packingListReducer from '@/features/packinglist/reducer'
import rootSaga from '@/store/rootSaga'

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: {
    ConfigReducer: configReducer,
    DashboardReducer: dashboardReducer,
    NguyenLieuReducer: nguyenLieuReducer,
    PhuLieuReducer: phuLieuReducer,
    ThanhPhamReducer: thanhPhamReducer,
    PackingListReducer: packingListReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
})

sagaMiddleware.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector = <T>(selector: (state: RootState) => T): T => useSelector(selector)

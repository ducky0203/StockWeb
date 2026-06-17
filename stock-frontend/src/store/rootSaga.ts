import { all } from 'redux-saga/effects'
import configSaga from '@/features/config/saga'
import dashboardSaga from '@/features/dashboard/saga'
import nguyenLieuSaga from '@/features/nguyen_lieu/saga'
import phuLieuSaga from '@/features/phu_lieu/saga'
import thanhPhamSaga from '@/features/thanh_pham/saga'
import packingListSaga from '@/features/packinglist/saga'

export default function* rootSaga() {
  yield all([
    ...configSaga,
    ...dashboardSaga,
    ...nguyenLieuSaga,
    ...phuLieuSaga,
    ...thanhPhamSaga,
    ...packingListSaga,
  ])
}

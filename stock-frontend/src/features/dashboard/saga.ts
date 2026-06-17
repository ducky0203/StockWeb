import { put, takeLatest } from 'redux-saga/effects'
import api from '@/config/api.ts'
import { dashboardUpdateData, getListConfig, setLoading } from './reducer'

function* _getListConfig(): Generator<any> {
  try {
    yield put(setLoading(true))
    const res = yield api.get('config/list-config');
    const payload = res.data?.data ?? res.data
    const { listKho, listChiNhanh } = payload
    yield put(dashboardUpdateData({ listKho, listChiNhanh, loading: false }))
  } catch (error) {
    console.log(error)
  } finally {
    yield put(setLoading(false))
  }
}

export default [
  takeLatest(getListConfig.type, _getListConfig),
]

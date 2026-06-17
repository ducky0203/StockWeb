import { put, takeLatest } from 'redux-saga/effects'
import api from '@/config/api'
import { configUpdateData, getConfig } from './reducer'

function* _getConfig(): Generator<any> {
  try {
    yield put(configUpdateData({ loading: true, error: null }))
    const res = yield api.get('config/list-config')
    const { listKho, listChiNhanh } = res.data?.data ?? res.data
    yield put(configUpdateData({ listKho: listKho ?? [], listChiNhanh: listChiNhanh ?? [], loading: false }))
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    yield put(configUpdateData({ loading: false, error: msg }))
  }
}

export default [
  takeLatest(getConfig.type, _getConfig),
]

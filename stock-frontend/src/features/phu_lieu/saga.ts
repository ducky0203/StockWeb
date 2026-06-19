import { put, takeLatest } from 'redux-saga/effects'
import api from '@/config/api'
import { phuLieuUpdateData, fetchPLStock, fetchPLTrucQuan } from './reducer'

function* _fetchPLStock({ payload }: any): Generator<any> {
  try {
    yield put(phuLieuUpdateData({ loading: true }))
    const res = yield api.get('phu-lieu/stock', { params: payload })
    const { data } = res.data
    yield put(phuLieuUpdateData({ ...data, loading: false }))
  } catch (e: any) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[PhuLieu API] stock error:', msg)
  } finally {
    yield put(phuLieuUpdateData({ loading: false }))
  }
}

function* _fetchPLTrucQuan({ payload }: any): Generator<any> {
  try {
    yield put(phuLieuUpdateData({ loading: true }))
    const res = yield api.get('phu-lieu/truc-quan', { params: payload })
    const { data } = res.data
    yield put(phuLieuUpdateData({ ...data, loading: false }))
  } catch (e: any) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[PhuLieu API] truc-quan error:', msg)
  } finally {
    yield put(phuLieuUpdateData({ loading: false }))
  }
}

export default [
  takeLatest(fetchPLStock.type, _fetchPLStock),
  takeLatest(fetchPLTrucQuan.type, _fetchPLTrucQuan),
]

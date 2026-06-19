import { put, takeLatest } from 'redux-saga/effects'
import api from '@/config/api'
import {
  nguyenLieuUpdateData,
  fetchNLStock,
  fetchNLTrucQuan,
  fetchNLStockTime,
  fetchNLDuBao,
} from './reducer'

function* _fetchNLStock({payload}: any): Generator<any> {
  try {
    yield put(nguyenLieuUpdateData({ loading: true }))
    const res = yield api.get("nguyen-lieu/stock", {params: payload})
    const { data } = res.data
    console.log('[NguyenLieu API] listStock sample:', data?.listStock?.[0])
    yield put(nguyenLieuUpdateData({ ...data, loading: false }))
  } catch (e: any) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[NguyenLieu API] stock error:', msg)
  } finally {
    yield put(nguyenLieuUpdateData({ loading: false }))
  }
}

function* _fetchNLTrucQuan({payload}: any): Generator<any> {
  try {
    yield put(nguyenLieuUpdateData({ loading: true }))
    const res = yield api.get("nguyen-lieu/truc-quan", {params: payload})
    const { data } = res.data
    console.log('[NguyenLieu API] listTrucQuan sample:', data?.listTrucQuan?.[0])
    yield put(nguyenLieuUpdateData({ ...data, loading: false }))
  } catch (e: any) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[NguyenLieu API] truc-quan error:', msg)
  } finally {
    yield put(nguyenLieuUpdateData({ loading: false }))
  }
}

function* _fetchNLStockTime({payload}: any): Generator<any> {
  try {
    yield put(nguyenLieuUpdateData({ loading: true }))
    const res = yield api.get("nguyen-lieu/stock-time", {params: payload})
    const { data } = res.data
    console.log('[NguyenLieu API] listStockTime:', data?.listStockTime)
    yield put(nguyenLieuUpdateData({ ...data, loading: false }))
  } catch (e: any) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[NguyenLieu API] stock-time error:', msg)
  } finally {
    yield put(nguyenLieuUpdateData({ loading: false }))
  }
}

function* _fetchNLDuBao({payload}: any): Generator<any> {
  try {
    yield put(nguyenLieuUpdateData({ loading: true }))
    const res = yield api.get("nguyen-lieu/du-bao", {params: payload})
    const { data } = res.data
    console.log('[NguyenLieu API] listDuBao:', data?.listDuBao)
    yield put(nguyenLieuUpdateData({ ...data, loading: false }))
  } catch (e: any) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[NguyenLieu API] du-bao error:', msg)
  } finally {
    yield put(nguyenLieuUpdateData({ loading: false }))
  }
}

export default [
  takeLatest(fetchNLStock.type, _fetchNLStock),
  takeLatest(fetchNLTrucQuan.type, _fetchNLTrucQuan),
  takeLatest(fetchNLStockTime.type, _fetchNLStockTime),
  takeLatest(fetchNLDuBao.type, _fetchNLDuBao),
]

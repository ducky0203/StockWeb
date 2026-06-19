import { put, takeLatest } from 'redux-saga/effects'
import api from '@/config/api'
import {
  thanhPhamUpdateData,
  fetchTPStock,
  fetchTPTrucQuan,
  fetchTPStockTime,
  fetchTPDuBao,
} from './reducer'

function* _fetchTPStock({ payload }: any): Generator<any> {
  try {
    yield put(thanhPhamUpdateData({ loading: true }))
    const res = yield api.get('thanh-pham/stock', { params: payload })
    const { data } = res.data
    yield put(thanhPhamUpdateData({ ...data, loading: false }))
  } catch (e: any) {
    console.error('[ThanhPham API] stock error:', e instanceof Error ? e.message : String(e))
  } finally {
    yield put(thanhPhamUpdateData({ loading: false }))
  }
}

function* _fetchTPTrucQuan({ payload }: any): Generator<any> {
  try {
    yield put(thanhPhamUpdateData({ loading: true }))
    const res = yield api.get('thanh-pham/truc-quan', { params: payload })
    const { data } = res.data
    yield put(thanhPhamUpdateData({ ...data, loading: false }))
  } catch (e: any) {
    console.error('[ThanhPham API] truc-quan error:', e instanceof Error ? e.message : String(e))
  } finally {
    yield put(thanhPhamUpdateData({ loading: false }))
  }
}

function* _fetchTPStockTime({ payload }: any): Generator<any> {
  try {
    yield put(thanhPhamUpdateData({ loading: true }))
    const res = yield api.get('thanh-pham/stock-time', { params: payload })
    const { data } = res.data
    yield put(thanhPhamUpdateData({ ...data, loading: false }))
  } catch (e: any) {
    console.error('[ThanhPham API] stock-time error:', e instanceof Error ? e.message : String(e))
  } finally {
    yield put(thanhPhamUpdateData({ loading: false }))
  }
}

function* _fetchTPDuBao({ payload }: any): Generator<any> {
  try {
    yield put(thanhPhamUpdateData({ loading: true }))
    const res = yield api.get('thanh-pham/du-bao', { params: payload })
    const { data } = res.data
    yield put(thanhPhamUpdateData({ ...data, loading: false }))
  } catch (e: any) {
    console.error('[ThanhPham API] du-bao error:', e instanceof Error ? e.message : String(e))
  } finally {
    yield put(thanhPhamUpdateData({ loading: false }))
  }
}

export default [
  takeLatest(fetchTPStock.type, _fetchTPStock),
  takeLatest(fetchTPTrucQuan.type, _fetchTPTrucQuan),
  takeLatest(fetchTPStockTime.type, _fetchTPStockTime),
  takeLatest(fetchTPDuBao.type, _fetchTPDuBao),
]

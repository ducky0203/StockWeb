import { put, takeLatest } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import api from '@/config/api'
import { thanhPhamUpdateData, fetchTPStock, fetchTPTrucQuan, fetchTPStockTime, fetchTPDuBao } from './reducer'

function extractData(res: unknown): Record<string, unknown>[] {
  const r = res as { data: unknown }
  const payload = (r.data as { data?: unknown })?.data ?? r.data
  return Array.isArray(payload) ? payload : []
}

function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}

function* _fetchTPStock(action: PayloadAction<string | undefined>): Generator<unknown> {
  try {
    yield put(thanhPhamUpdateData({ stock: { loading: true, data: null, error: null } }))
    const res = yield api.get(`thanh-pham/stock/${action.payload}`)
    yield put(thanhPhamUpdateData({ stock: { loading: false, data: extractData(res), error: null } }))
  } catch (e) {
    yield put(thanhPhamUpdateData({ stock: { loading: false, data: null, error: errMsg(e) } }))
  }
}

function* _fetchTPTrucQuan(action: PayloadAction<{ maChiNhanh: string | undefined; search: string }>): Generator<unknown> {
  try {
    yield put(thanhPhamUpdateData({ trucQuan: { loading: true, data: null, error: null } }))
    const res = yield api.get(`thanh-pham/truc-quan/${action.payload.maChiNhanh}`)
    yield put(thanhPhamUpdateData({ trucQuan: { loading: false, data: extractData(res), error: null } }))
  } catch (e) {
    yield put(thanhPhamUpdateData({ trucQuan: { loading: false, data: null, error: errMsg(e) } }))
  }
}

function* _fetchTPStockTime(action: PayloadAction<string | undefined>): Generator<unknown> {
  try {
    yield put(thanhPhamUpdateData({ stockTime: { loading: true, data: null, error: null } }))
    const res = yield api.get(`thanh-pham/stock-time/${action.payload}`)
    yield put(thanhPhamUpdateData({ stockTime: { loading: false, data: extractData(res), error: null } }))
  } catch (e) {
    yield put(thanhPhamUpdateData({ stockTime: { loading: false, data: null, error: errMsg(e) } }))
  }
}

function* _fetchTPDuBao(action: PayloadAction<string | undefined>): Generator<unknown> {
  try {
    yield put(thanhPhamUpdateData({ duBao: { loading: true, data: null, error: null } }))
    const res = yield api.get(`thanh-pham/du-bao/${action.payload}`)
    yield put(thanhPhamUpdateData({ duBao: { loading: false, data: extractData(res), error: null } }))
  } catch (e) {
    yield put(thanhPhamUpdateData({ duBao: { loading: false, data: null, error: errMsg(e) } }))
  }
}

export default [
  takeLatest(fetchTPStock.type, _fetchTPStock),
  takeLatest(fetchTPTrucQuan.type, _fetchTPTrucQuan),
  takeLatest(fetchTPStockTime.type, _fetchTPStockTime),
  takeLatest(fetchTPDuBao.type, _fetchTPDuBao),
]

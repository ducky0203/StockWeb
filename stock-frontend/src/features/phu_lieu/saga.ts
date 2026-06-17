import { put, takeLatest } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import api from '@/config/api'
import { phuLieuUpdateData, fetchPLStock, fetchPLTrucQuan, fetchPLStockTime } from './reducer'

function extractData(res: unknown): Record<string, unknown>[] {
  const r = res as { data: unknown }
  const payload = (r.data as { data?: unknown })?.data ?? r.data
  return Array.isArray(payload) ? payload : []
}

function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}

function* _fetchPLStock(action: PayloadAction<number | undefined>): Generator<unknown> {
  try {
    yield put(phuLieuUpdateData({ stock: { loading: true, data: null, error: null } }))
    const res = yield api.get(`phu-lieu/stock/${action.payload}`)
    yield put(phuLieuUpdateData({ stock: { loading: false, data: extractData(res), error: null } }))
  } catch (e) {
    yield put(phuLieuUpdateData({ stock: { loading: false, data: null, error: errMsg(e) } }))
  }
}

function* _fetchPLTrucQuan(action: PayloadAction<{ idKho: number | undefined; search: string }>): Generator<unknown> {
  try {
    yield put(phuLieuUpdateData({ trucQuan: { loading: true, data: null, error: null } }))
    const res = yield api.get(`phu-lieu/truc-quan/${action.payload.idKho}`)
    yield put(phuLieuUpdateData({ trucQuan: { loading: false, data: extractData(res), error: null } }))
  } catch (e) {
    yield put(phuLieuUpdateData({ trucQuan: { loading: false, data: null, error: errMsg(e) } }))
  }
}

function* _fetchPLStockTime(action: PayloadAction<number | undefined>): Generator<unknown> {
  try {
    yield put(phuLieuUpdateData({ stockTime: { loading: true, data: null, error: null } }))
    const res = yield api.get(`phu-lieu/stock-time/${action.payload}`)
    yield put(phuLieuUpdateData({ stockTime: { loading: false, data: extractData(res), error: null } }))
  } catch (e) {
    yield put(phuLieuUpdateData({ stockTime: { loading: false, data: null, error: errMsg(e) } }))
  }
}

export default [
  takeLatest(fetchPLStock.type, _fetchPLStock),
  takeLatest(fetchPLTrucQuan.type, _fetchPLTrucQuan),
  takeLatest(fetchPLStockTime.type, _fetchPLStockTime),
]

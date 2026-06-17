import { put, takeLatest } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import api from '@/config/api'
import {
  nguyenLieuUpdateData,
  fetchNLStock,
  fetchNLTrucQuan,
  fetchNLStockTime,
  fetchNLDuBao,
} from './reducer'

function* _fetchNLStock(action: PayloadAction<number | undefined>): Generator<unknown> {
  try {
    yield put(nguyenLieuUpdateData({loading: true}))
    const res = yield api.get(`nguyen-lieu/stock/${action.payload}`)
    const {data} = res.data;
    yield put(nguyenLieuUpdateData({...data, loading: false}))
  } catch (e: any) {
    alert("Lỗi: " + e.message);
  }
}

function* _fetchNLTrucQuan(action: PayloadAction<{ idKho: number | undefined; search: string }>): Generator<unknown> {
  try {
    yield put(nguyenLieuUpdateData({loading: true}))
    const res = yield api.get(`nguyen-lieu/truc-quan/${action.payload.idKho}`)
    const {data} = res.data;
    yield put(nguyenLieuUpdateData({...data, loading: false}))
  } catch (e: any) {
    alert("Lỗi: " + e.message);
  }
}

function* _fetchNLStockTime(action: PayloadAction<number | undefined>): Generator<unknown> {
  try {
    yield put(nguyenLieuUpdateData({loading: true}))
    const res = yield api.get(`nguyen-lieu/stock-time/${action.payload}`)
    const {data} = res.data;
    yield put(nguyenLieuUpdateData({...data, loading: false}))
  } catch (e: any) {
    alert("Lỗi: " + e.message);
  }
}

function* _fetchNLDuBao(action: PayloadAction<number | undefined>): Generator<unknown> {
  try {
    yield put(nguyenLieuUpdateData({loading: true}))
    const res = yield api.get(`nguyen-lieu/du-bao/${action.payload}`)
    const {data} = res.data;
    yield put(nguyenLieuUpdateData({...data, loading: false}))
  } catch (e: any) {
    alert("Lỗi: " + e.message);
  }
}

export default [
  takeLatest(fetchNLStock.type, _fetchNLStock),
  takeLatest(fetchNLTrucQuan.type, _fetchNLTrucQuan),
  takeLatest(fetchNLStockTime.type, _fetchNLStockTime),
  takeLatest(fetchNLDuBao.type, _fetchNLDuBao),
]

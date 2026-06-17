import { put, takeLatest } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import api from '@/config/api'
import { packingListUpdateData, fetchPackingList } from './reducer'

function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}

function* _fetchPackingList(action: PayloadAction<{ tuNgay: string; denNgay: string }>): Generator<unknown> {
  try {
    yield put(packingListUpdateData({ loading: true, error: null }))
    const res = yield api.get('packing-list', {
      params: { tuNgay: action.payload.tuNgay, denNgay: action.payload.denNgay },
    })
    const r = res as { data: { data?: { listPackingList?: unknown[] } } }
    const listPackingList = (r.data?.data?.listPackingList ?? []) as Record<string, unknown>[]
    yield put(packingListUpdateData({ loading: false, listPackingList, error: null }))
  } catch (e) {
    yield put(packingListUpdateData({ loading: false, listPackingList: null, error: errMsg(e) }))
  }
}

export default [
  takeLatest(fetchPackingList.type, _fetchPackingList),
]

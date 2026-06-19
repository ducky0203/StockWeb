import { put, takeLatest } from 'redux-saga/effects'
import api from '@/config/api'
import { packingListUpdateData, fetchPackingList } from './reducer'

function* _fetchPackingList({ payload }: any): Generator<any> {
  try {
    yield put(packingListUpdateData({ loading: true }))
    const res = yield api.get('packing-list', { params: payload })
    const { data } = res.data
    yield put(packingListUpdateData({ ...data, loading: false }))
  } catch (e: any) {
    console.error('[PackingList API] error:', e instanceof Error ? e.message : String(e))
  } finally {
    yield put(packingListUpdateData({ loading: false }))
  }
}

export default [
  takeLatest(fetchPackingList.type, _fetchPackingList),
]

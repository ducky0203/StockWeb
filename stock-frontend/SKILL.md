# Skills — StockWeb Frontend

Tập hợp các pattern tái sử dụng cho project. Mỗi skill là một "công thức" hoàn chỉnh, copy-paste và điều chỉnh tên là dùng được.

---

## Skill 1 — Thêm Feature mới (end-to-end)

Checklist khi tạo một feature hoàn chỉnh (ví dụ: `nguyen-lieu`):

```
src/features/nguyen-lieu/
├── containers/
│   └── index.tsx      ← Page component
├── components/        ← UI components riêng (nếu có)
├── reducer.ts         ← RTK slice
└── saga.ts            ← Side effects
```

**Bước 1 — Tạo reducer**

```ts
// src/features/nguyen-lieu/reducer.ts
import { createSlice } from '@reduxjs/toolkit'

interface NguyenLieuItem {
  id: number
  ten: string
  donVi: string
}

interface NguyenLieuState {
  loading: boolean
  list: NguyenLieuItem[]
}

const initialState: NguyenLieuState = {
  loading: false,
  list: [],
}

const nguyenLieuSlice = createSlice({
  name: 'nguyenLieuSlice',
  initialState,
  reducers: {
    setLoading: (state, action) => { state.loading = action.payload },
    nguyenLieuUpdateData: (state, action) => { Object.assign(state, action.payload) },
    fetchNguyenLieu: () => {},   // trigger saga
  },
})

export const { setLoading, nguyenLieuUpdateData, fetchNguyenLieu } = nguyenLieuSlice.actions
export default nguyenLieuSlice.reducer
```

**Bước 2 — Tạo saga**

```ts
// src/features/nguyen-lieu/saga.ts
import { put, takeLatest } from 'redux-saga/effects'
import api from '@/config/api'
import { fetchNguyenLieu, nguyenLieuUpdateData, setLoading } from './reducer'

function* _fetchNguyenLieu(): Generator<any> {
  try {
    yield put(setLoading(true))
    const res = yield api.get('nguyen-lieu/list')
    const list = res.data?.data ?? res.data
    yield put(nguyenLieuUpdateData({ list, loading: false }))
  } catch (error) {
    console.error(error)
  } finally {
    yield put(setLoading(false))
  }
}

export default [
  takeLatest(fetchNguyenLieu.type, _fetchNguyenLieu),
]
```

**Bước 3 — Đăng ký vào store và rootSaga**

```ts
// src/store/index.ts — thêm vào reducer map
import nguyenLieuReducer from '@/features/nguyen-lieu/reducer'

reducer: {
  DashboardReducer: dashboardReducer,
  NguyenLieuReducer: nguyenLieuReducer,   // ← thêm
}
```

```ts
// src/store/rootSaga.ts — thêm vào all()
import nguyenLieuSaga from '@/features/nguyen-lieu/saga'

export default function* rootSaga() {
  yield all([...dashboardSaga, ...nguyenLieuSaga])   // ← spread mảng
}
```

**Bước 4 — Tạo page container**

```tsx
// src/features/nguyen-lieu/containers/index.tsx
import { useEffect } from 'react'
import type { JSX } from 'react'
import { fetchNguyenLieu } from '@/features/nguyen-lieu/reducer'
import { useAppDispatch, useAppSelector } from '@/store'

export default function NguyenLieuPage(): JSX.Element {
  const dispatch = useAppDispatch()
  const { loading, list } = useAppSelector((state: any) => state.NguyenLieuReducer)

  useEffect(() => {
    dispatch(fetchNguyenLieu())
  }, [dispatch])

  return (
    <div>
      <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
        <h1 className="text-gray-700 font-medium">Nguyên liệu</h1>
      </header>
      {loading && <p className="mt-4 px-4 text-sm text-gray-400">Đang tải…</p>}
      {!loading && (
        <div className="mt-4 px-4">
          {/* render list */}
        </div>
      )}
    </div>
  )
}
```

**Bước 5 — Gắn vào router và sidebar**

```ts
// src/router/index.tsx — thêm route
import NguyenLieuPage from '@/features/nguyen-lieu/containers'

{ path: '/nguyen-lieu', element: <NguyenLieuPage /> },
```

```ts
// src/layouts/MainLayout.tsx — navItems đã có sẵn, chỉ cần route khớp với to
```

---

## Skill 2 — Saga gọi API với params

Khi cần truyền tham số vào action (ví dụ: filter, id):

```ts
// reducer.ts
fetchDetail: (_state, _action: PayloadAction<{ id: number }>) => {},
```

```ts
// saga.ts
import type { PayloadAction } from '@reduxjs/toolkit'

function* _fetchDetail(action: PayloadAction<{ id: number }>): Generator<any> {
  try {
    yield put(setLoading(true))
    const { id } = action.payload
    const res = yield api.get(`nguyen-lieu/${id}`)
    const data = res.data?.data ?? res.data
    yield put(nguyenLieuUpdateData({ detail: data, loading: false }))
  } catch (error) {
    console.error(error)
  } finally {
    yield put(setLoading(false))
  }
}

export default [
  takeLatest(fetchNguyenLieu.type, _fetchNguyenLieu),
  takeLatest(fetchDetail.type, _fetchDetail),
]
```

---

## Skill 3 — Saga gọi POST / mutation

```ts
// reducer.ts
createItem: (_state, _action: PayloadAction<{ ten: string; donVi: string }>) => {},
createItemSuccess: (state) => { state.createLoading = false },
```

```ts
// saga.ts
import { put, takeLatest, call } from 'redux-saga/effects'

function* _createItem(action: PayloadAction<{ ten: string; donVi: string }>): Generator<any> {
  try {
    yield put(setLoading(true))
    yield call([api, api.post], 'nguyen-lieu/create', action.payload)
    // Reload list sau khi tạo thành công
    yield put(fetchNguyenLieu())
  } catch (error) {
    console.error(error)
  } finally {
    yield put(setLoading(false))
  }
}
```

---

## Skill 4 — Component bảng dữ liệu (Table)

Pattern bảng chuẩn dùng Tailwind:

```tsx
// src/features/<feature>/components/ItemTable.tsx
interface Column<T> {
  key: keyof T
  label: string
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

interface Props<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
}

export default function ItemTable<T extends { id: number }>({ columns, data, loading }: Props<T>): JSX.Element {
  if (loading) {
    return <p className="px-4 py-6 text-sm text-gray-400">Đang tải…</p>
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className="px-4 py-3 text-left font-medium tracking-wide">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-3 text-gray-700">
                  {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-400">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
```

**Cách dùng:**

```tsx
<ItemTable
  columns={[
    { key: 'ten', label: 'Tên' },
    { key: 'donVi', label: 'Đơn vị' },
    { key: 'id', label: '', render: (_, row) => (
      <button onClick={() => dispatch(fetchDetail({ id: row.id }))}>Chi tiết</button>
    )},
  ]}
  data={list}
  loading={loading}
/>
```

---

## Skill 5 — Page Header chuẩn

```tsx
// Dùng lại trong mọi page container
<header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
  <h1 className="text-gray-700 font-medium">Tên trang</h1>
  <button
    onClick={() => {/* mở modal tạo mới */}}
    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
  >
    <Plus size={16} />
    Thêm mới
  </button>
</header>
```

---

## Skill 6 — Thêm biến môi trường

**Bước 1** — Thêm vào file `.env`:

```
VITE_API_BASE_URL=http://localhost:3000/api/
VITE_APP_NAME=StockWeb
VITE_APP_ENV=development
VITE_NEW_VAR=value        # ← biến mới
```

**Bước 2** — Khai báo trong `src/config/env.ts`:

```ts
const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string,
  appName: import.meta.env.VITE_APP_NAME as string,
  appEnv: import.meta.env.VITE_APP_ENV as 'development' | 'production',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  newVar: import.meta.env.VITE_NEW_VAR as string,   // ← thêm ở đây
}
```

**Bước 3** — Dùng trong code:

```ts
import env from '@/config/env'
console.log(env.newVar)
```

> Không đọc `import.meta.env.VITE_*` trực tiếp ngoài `env.ts`.

---

## Skill 7 — Typed RootState (bỏ `any` trong selector)

Khi store đã ổn định, thêm kiểu `RootState` vào `src/store/index.ts`:

```ts
// src/store/index.ts
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

Import thêm:

```ts
import type { TypedUseSelectorHook } from 'react-redux'
```

Sau đó trong container bỏ `state: any`:

```ts
// Trước
const { loading, list } = useAppSelector((state: any) => state.NguyenLieuReducer)

// Sau
const { loading, list } = useAppSelector((state) => state.NguyenLieuReducer)
```

---

## Skill 8 — Xử lý 401 / logout

`src/config/api.ts` đã tự xử lý 401 (xóa token, redirect `/login`). Khi thêm trang login:

1. Tạo route `/login` **ngoài** `MainLayout` (không có sidebar).
2. Sau login thành công, lưu token: `localStorage.setItem('token', token)`.
3. Redirect về `/dashboard`.

```tsx
// src/router/index.tsx
import LoginPage from '@/features/auth/containers'

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [ /* ... */ ],
  },
  { path: '/login', element: <LoginPage /> },   // ← ngoài layout
  { path: '*', element: <NotFoundPage /> },
])
```

# Project Rules — StockWeb Frontend

## Stack

| Lớp | Công nghệ |
|---|---|
| UI | React 19, TypeScript ~6, Tailwind CSS v4 |
| Routing | React Router v7 (`react-router`) |
| State | Redux Toolkit + Redux Saga |
| HTTP | Axios (instance tại `src/config/api.ts`) |
| Build | Vite 8, Yarn 4 |

---

## Cấu trúc thư mục

```
src/
├── assets/           # Ảnh, SVG tĩnh
├── config/           # api.ts (axios instance), env.ts
├── features/         # Mỗi feature là một thư mục độc lập
│   └── <feature>/
│       ├── containers/   # Page component (smart component)
│       ├── components/   # UI component thuần (dumb component)
│       ├── reducer.ts    # RTK slice: state + actions
│       └── saga.ts       # Side effects (API call)
├── layouts/          # Layout dùng chung (MainLayout, v.v.)
├── pages/            # Trang không thuộc feature (NotFoundPage, v.v.)
├── router/           # Cấu hình routes
├── store/            # configureStore, rootSaga, typed hooks
└── utils/            # Hàm tiện ích thuần (không có side effect)
```

### Quy tắc đặt file
- Mỗi **feature mới** tạo thư mục riêng trong `src/features/<ten-feature>/`.
- File index của page component để trong `containers/index.tsx`.
- Reducer và Saga **luôn đặt trong cùng feature**, không tập trung vào `store/`.
- Khi thêm reducer mới, đăng ký vào `src/store/index.ts` và saga vào `src/store/rootSaga.ts`.

---

## State Management

### Redux Toolkit Slice
- Mỗi feature có **một slice** duy nhất.
- Action không có side effect thì viết reducer bình thường.
- Action trigger side effect (gọi API) thì để reducer **rỗng** (`() => {}`), saga sẽ xử lý.
- Dùng `dashboardUpdateData`-pattern (Object.assign) để cập nhật nhiều field cùng lúc thay vì nhiều action riêng lẻ.

```ts
// reducer.ts
reducers: {
  setLoading: (state, action) => { state.loading = action.payload },
  fooUpdateData: (state, action) => { Object.assign(state, action.payload) },
  fetchFoo: () => {},   // trigger saga, không có reducer body
}
```

### Redux Saga
- Export mảng watcher effects từ `saga.ts`, **không export default function**.
- Dùng `takeLatest` cho action fetch dữ liệu (tránh race condition).
- Luôn có `try/catch/finally`; gọi `setLoading(false)` trong `finally`.
- Gọi API qua `api` instance từ `@/config/api.ts`, không import axios trực tiếp.

```ts
// saga.ts
export default [
  takeLatest(fetchFoo.type, _fetchFoo),
]
```

### Typed Hooks
- Luôn dùng `useAppDispatch` và `useAppSelector` từ `@/store`.
- Tránh dùng `state: any` trong selector — định nghĩa kiểu RootState.

---

## Component

- **Containers** (`containers/`) nhận data từ Redux, dispatch action, không nhận props phức tạp.
- **Components** (`components/`) nhận props, không biết đến Redux.
- Dùng named export cho components thuần, default export cho page/container.
- Kiểu trả về JSX phải khai báo tường minh: `function Foo(): JSX.Element`.

---

## Routing

- Routes khai báo tập trung trong `src/router/index.tsx`.
- Mọi route đều nằm trong `MainLayout` (có sidebar), trừ trang lỗi.
- Path dùng tiếng Việt không dấu, nối bằng gạch ngang (`/nguyen-lieu`, `/phu-lieu`).
- Khi thêm route, thêm cả `navItem` tương ứng trong `src/layouts/MainLayout.tsx`.

---

## TypeScript

- Không dùng `any` trừ khi bất khả kháng và phải có comment giải thích.
- Không tắt `strict` trong `tsconfig`.
- Ưu tiên `interface` cho props, `type` cho union/alias.

---

## Styling

- Chỉ dùng **Tailwind CSS** — không viết CSS/SCSS riêng ngoài `src/index.css`.
- Tailwind v4: config qua CSS (`@theme`) thay vì `tailwind.config.js`.
- Class điều kiện viết bằng template literal, không dùng thư viện `clsx`/`cn` trừ khi cần.

---

## API & HTTP

- Mọi request HTTP đi qua axios instance `@/config/api.ts`.
- Base URL lấy từ `src/config/env.ts` (không hardcode URL).
- Response data truy cập theo pattern: `res.data?.data ?? res.data`.

---

## Quy ước đặt tên

| Đối tượng | Convention | Ví dụ |
|---|---|---|
| Component | PascalCase | `DashboardPage` |
| Hook | camelCase + `use` prefix | `useAppDispatch` |
| Action/Selector | camelCase | `getListConfig`, `setLoading` |
| Saga worker | camelCase + `_` prefix | `_getListConfig` |
| File component | `index.tsx` trong folder | `containers/index.tsx` |
| CSS class | Tailwind utility | — |

---

## Lệnh thường dùng

```bash
yarn dev          # Dev server
yarn build        # Build production (tsc + vite)
yarn lint         # Kiểm tra ESLint
yarn preview      # Preview bản build
```

---

## Không làm

- Không commit thẳng lên `main` — tạo branch theo feature.
- Không đặt logic gọi API trực tiếp trong component.
- Không import circular giữa các feature.
- Không dùng `useEffect` để sync Redux state — để saga xử lý.
- Không tạo file `*.css` mới ngoài `index.css`.

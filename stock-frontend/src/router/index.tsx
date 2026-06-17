import { createBrowserRouter } from 'react-router'
import MainLayout from '@/layouts/MainLayout'
import NotFoundPage from '@/pages/NotFoundPage'
import DashboardPage from '@/features/dashboard/containers'
import NguyenLieuPage from '@/features/nguyen_lieu/containers'
import PhuLieuPage from '@/features/phu_lieu/containers'
import ThanhPhamPage from '@/features/thanh_pham/containers'
import PackingListPage from '@/features/packinglist/containers'

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/nguyen-lieu', element: <NguyenLieuPage /> },
      { path: '/phu-lieu', element: <PhuLieuPage /> },
      { path: '/thanh-pham', element: <ThanhPhamPage /> },
      { path: '/packing-list', element: <PackingListPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])

export default router

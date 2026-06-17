import { useEffect } from 'react'
import { NavLink, Outlet } from 'react-router'
import {
  Layers,
  Package,
  CheckSquare,
  ClipboardList,
  LayoutDashboard,
} from 'lucide-react'
import { useAppDispatch } from '@/store'
import { getConfig } from '@/features/config/reducer'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/nguyen-lieu', label: 'Nguyên liệu', icon: Layers },
  { to: '/phu-lieu', label: 'Phụ liệu', icon: Package },
  { to: '/thanh-pham', label: 'Thành phẩm', icon: CheckSquare },
  { to: '/packing-list', label: 'Packing List', icon: ClipboardList },
]

export default function MainLayout() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getConfig())
  }, [dispatch])

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="text-lg font-bold text-blue-600">StockWeb</span>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      {/* Content */}
        <main className="flex-1 overflow-hidden flex flex-col">
          <Outlet />
        </main>
    </div>

  )
}

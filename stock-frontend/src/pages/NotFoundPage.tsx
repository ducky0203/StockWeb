import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center gap-4">
      <h1 className="text-8xl font-bold text-gray-200">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700">Trang không tồn tại</h2>
      <p className="text-gray-500">Đường dẫn bạn truy cập không tồn tại hoặc đã bị xóa.</p>
      <Link
        to="/"
        className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Về trang chủ
      </Link>
    </div>
  )
}

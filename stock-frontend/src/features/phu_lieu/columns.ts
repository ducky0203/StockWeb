import { dateCol, numCol, textCol } from '@/utils/tableColumns'
import type { ColDescriptor } from '@/utils/tableColumns'
import { formatDate, formatNumber } from '@/utils/tableFormat'
import type { TrucQuanField } from '@/components/TrucQuanGrid'

// Tồn kho phụ liệu — SP pr_Web_Report_KhoPL_Stock (StockPhuLieuDto).
export const plStockColumns: ColDescriptor[] = [
  textCol('STT', 'id', { minWidth: 80 }),
  textCol('Chi nhánh', 'tenChiNhanh', { minWidth: 100 }),
  dateCol('Ngày', 'ngay'),
  textCol('Khách hàng', 'khachHang', { minWidth: 140 }),
  textCol('Mã hàng', 'maHang', { minWidth: 120 }),
  textCol('Mã NPL', 'ma_NPL', { minWidth: 110 }),
  textCol('Chủng loại', 'tenChungLoaiVatTu', { minWidth: 120 }),
  textCol('Item', 'item', { minWidth: 130 }),
  textCol('Màu', 'tenMau', { minWidth: 110 }),
  textCol('Khổ', 'tenCo', { minWidth: 90 }),
  textCol('ĐVT', 'donViTinh', { minWidth: 70 }),
  textCol('NCC', 'tenNhaCungCap', { minWidth: 140 }),
  numCol('SL chứng từ', 'soLuong_ChungTu', { minWidth: 110 }),
  numCol('Đã nhập', 'soLuong_DaNhap', { minWidth: 100 }),
  numCol('Chênh lệch', 'soLuong_ChenhLech', { minWidth: 110 }),
  numCol('Đã xuất', 'soLuong_DaXuat', { minWidth: 100 }),
  numCol('Tồn', 'soLuong_ConLai'),
  numCol('Ngày lưu kho', 'soNgay_LuuKho', { minWidth: 110 }),
  textCol('Vị trí', 'ma_ViTriKho', { minWidth: 90 }),
  dateCol('Hạn SD', 'hanSuDung'),
]

// Trực quan vị trí — SP pr_App_KhoPL_TrucQuan_Select_wID_Kho (TrucQuanPhuLieuDto, không có % lấp đầy).
export const plTrucQuanFields: TrucQuanField[] = [
  { label: 'KH', key: 'tenKhachHang' },
  { label: 'Mã hàng', key: 'maHang' },
  { label: 'Chủng loại', key: 'tenChungLoaiVatTu' },
  { label: 'Màu', key: 'tenMau_VatTu' },
  { label: 'Khổ', key: 'tenCo_VatTu' },
  { label: 'Quy cách', key: 'tenQuyCach' },
  { label: 'SL', key: 'soLuong', format: (v) => formatNumber(v) },
  { label: 'Thùng', key: 'soLuong_Thung', format: (v) => formatNumber(v) },
  { label: 'Ngày nhập', key: 'ngay_NhapKho', format: (v) => (v ? formatDate(v) : '') },
  { label: 'Hạn SD', key: 'hanSuDung', format: (v) => (v ? formatDate(v) : '') },
]

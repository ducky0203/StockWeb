import { dateCol, numCol, textCol } from '@/utils/tableColumns'
import type { ColDescriptor } from '@/utils/tableColumns'
import { formatNumber } from '@/utils/tableFormat'
import type { TrucQuanField } from '@/components/TrucQuanGrid'
import type { DuBaoBar } from '@/components/DuBaoView'

// Tồn kho thành phẩm — SP pr_Web_Report_NhapXuatKho_ThanhPham_Stock (StockThanhPhamDto).
export const tpStockColumns: ColDescriptor[] = [
  numCol('STT', 'stt', { minWidth: 56 }),
  textCol('Chi nhánh', 'tenChiNhanh', { minWidth: 100 }),
  dateCol('Ngày', 'ngay'),
  textCol('Mã hàng', 'maHang', { minWidth: 120 }),
  textCol('PO', 'po_No', { minWidth: 120 }),
  textCol('Đích đến', 'dichDen', { minWidth: 120 }),
  numCol('TG lưu kho', 'thoiGian_LuuKho', { minWidth: 110 }),
  textCol('Màu SP', 'tenMau_SanPham', { minWidth: 120 }),
  textCol('Cỡ SP', 'tenCo_SanPham', { minWidth: 90 }),
  numCol('Số kiện', 'soKien', { minWidth: 90 }),
  numCol('Tỷ lệ/kiện', 'tyLe_TrongKien', { minWidth: 100 }),
  numCol('SL kế hoạch', 'soLuong_KeHoach', { minWidth: 110 }),
  numCol('Đã nhập', 'soLuong_DaNhap', { minWidth: 100 }),
  numCol('Đã xuất', 'soLuong_DaXuat', { minWidth: 100 }),
  numCol('Tồn', 'soLuong_ConLai'),
  numCol('Thùng tồn', 'soLuong_ThungTon', { minWidth: 100 }),
  textCol('Vị trí', 'viTri', { minWidth: 90 }),
  numCol('Giá đàm phán', 'giaDamPhan_KH', { minWidth: 120 }),
  numCol('Giá trị', 'giaTri', { minWidth: 120 }),
]

// Trực quan vị trí — SP pr_App_NhapKho_ThanhPham_TrucQuan_Select_wMaChiNhanh (TrucQuanThanhPhamDto, có % lấp đầy).
export const tpTrucQuanFields: TrucQuanField[] = [
  { label: 'Mã hàng', key: 'maHang' },
  { label: 'PO', key: 'po_No' },
  { label: 'SL SP', key: 'soLuong_SanPham', format: (v) => formatNumber(v) },
  { label: 'Thùng', key: 'soLuong_Thung', format: (v) => formatNumber(v) },
  { label: 'CBM', key: 'cbm', format: (v) => formatNumber(v) },
]

// Dự báo kho thành phẩm — SP pr_CBK_DuBaoKhoTP_Select_wMaChiNhanh (DuBaoKhoThanhPhamDto, đơn vị khối).
export const tpDuBaoBars: DuBaoBar[] = [
  { key: 'soKhoiDung', name: 'Khối đang dùng', color: '#3b82f6' },
  { key: 'soKhoiGiaiPhong', name: 'Khối giải phóng', color: '#22c55e' },
  { key: 'soKhoiThem', name: 'Khối thêm', color: '#f59e0b' },
]

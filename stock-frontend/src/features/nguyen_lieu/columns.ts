import { dateCol, numCol, textCol } from '@/utils/tableColumns'
import type { ColDescriptor } from '@/utils/tableColumns'

export const nlStockColumns: ColDescriptor[] = [
  numCol('STT', 'stt', { minWidth: 56 }),
  textCol('Chi nhánh', 'tenChiNhanh', { minWidth: 100 }),
  dateCol('Ngày nhập', 'ngay_NhapKho'),
  textCol('Mã hàng', 'maHang', { minWidth: 120 }),
  textCol('Mùa SP', 'muaSP', { minWidth: 100 }),
  textCol('NCC', 'nhaCungCap', { minWidth: 140 }),
  textCol('PO', 'po_No', { minWidth: 120 }),
  textCol('Item', 'item_No', { minWidth: 140 }),
  textCol('Chủng loại', 'tenChungLoaiVatTu', { minWidth: 110 }),
  textCol('Mô tả VT', 'moTaVatTu', { minWidth: 220 }),
  numCol('TG lưu kho', 'thoiGian_LuuKho', { minWidth: 110 }),
  textCol('Màu LK', 'mauLuuKho', { minWidth: 150 }),
  numCol('Tổng nhập', 'tongNhap', { minWidth: 120 }),
  numCol('Tổng xuất', 'tongXuat', { minWidth: 120 }),
  numCol('Tồn', 'soLuongTon'),
  textCol('Vị trí', 'ten_ViTri', { minWidth: 80 }),
]

// Bộ lọc theo thời gian lưu kho — dùng chung, cột ngày nhập của NL là 'ngay_NhapKho'.
export { stockTimeBands, filterStockByTime } from '@/utils/stockTimeBand'
export type { StockTimeBand } from '@/utils/stockTimeBand'

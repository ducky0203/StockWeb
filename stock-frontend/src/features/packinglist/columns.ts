import { dateCol, numCol, textCol } from '@/utils/tableColumns'
import type { ColDescriptor } from '@/utils/tableColumns'

// Danh sách packing list — SP pr_Web_PackingList_Select_Main (PackingListDto).
export const packingListColumns: ColDescriptor[] = [
  textCol('Số PL', 'so_PackingList', { minWidth: 130 }),
  // textCol('Nhóm', 'tenNhom', { minWidth: 120 }),
  textCol('NCC', 'tenNhaCungCap', { minWidth: 160 }),
  textCol('Xuất xứ', 'tenXuatXu', { minWidth: 110 }),
  textCol('Khách hàng', 'tenKhachHang', { minWidth: 140 }),
  textCol('Mã hàng', 'maHang', { minWidth: 120 }),
  textCol('Chủng loại', 'tenChungLoaiVatTu', { minWidth: 120 }),
  textCol('Số kiện', 'soKien', { minWidth: 90 }),
  textCol('Số Bill', 'so_Bill', { minWidth: 120 }),
  numCol('Số khối', 'soKhoi', { minWidth: 90 }),
  numCol('Trọng lượng', 'trongLuong', { minWidth: 110 }),
  dateCol('Ngày về', 'ngayVe'),
  dateCol('ETD', 'etd'),
  dateCol('ETA', 'eta'),
  textCol('Số tờ khai', 'soToKhai', { minWidth: 120 }),
  dateCol('Ngày mở TK', 'ngay_MoToKhai'),
  dateCol('Dự kiến về kho', 'ngayDuKien_VeKho'),
  dateCol('Nhận thực tế', 'ngayNhan_ThucTe'),
  textCol('Số PI', 'soPI', { minWidth: 110 }),
  textCol('Số xe', 'soXe', { minWidth: 100 }),
  textCol('Người giao', 'nguoiGiaoHang', { minWidth: 130 }),
  textCol('Ghi chú', 'ghiChu', { minWidth: 180 }),
]

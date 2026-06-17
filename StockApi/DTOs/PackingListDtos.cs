
namespace StockApi.DTOs;

/// <summary>Danh sách packing list. SP: pr_Web_PackingList_Select_Main.</summary>
public sealed class PackingListDto
{
    public int Id_PackingList { get; set; }
    public string So_PackingList { get; set; } = string.Empty;
    public byte? Loai_PackingList { get; set; }
    public int MaNhaCungCap { get; set; }
    public string? TenNhaCungCap { get; set; }
    public string? XuatXu { get; set; }
    public string TenXuatXu { get; set; } = string.Empty;
    public string? SoKien { get; set; }
    public string? So_Bill { get; set; }
    public decimal? SoKhoi { get; set; }
    public decimal? TrongLuong { get; set; }
    public DateTime NgayVe { get; set; }
    public DateTime? Etd { get; set; }
    public DateTime? Eta { get; set; }
    public DateTime? NgayDongBo_HoSo { get; set; }
    public DateTime? NgayGiaoCT_XNK { get; set; }
    public DateTime? NgayGiaoCT_VT { get; set; }
    public string? SoToKhai { get; set; }
    public DateTime? Ngay_MoToKhai { get; set; }
    public DateTime? NgayDuKien_VeKho { get; set; }
    public DateTime? NgayNhan_ThucTe { get; set; }
    public string? GhiChu { get; set; }
    public string? Nhom { get; set; }
    public string? TenNhom { get; set; }
    public string? SoXe { get; set; }
    public string? NguoiGiaoHang { get; set; }
    public string? MaHang { get; set; }
    public string? TenKhachHang { get; set; }
    public string? MaChiNhanh_VatTu { get; set; }
    public string? TenChungLoaiVatTu { get; set; }
    public string? SoPI { get; set; }
}

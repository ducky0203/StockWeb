
namespace StockApi.DTOs;

/// <summary>Tồn kho nguyên liệu. SP: pr_Web_rptPackingList_ItemDetail_Stock.</summary>
public sealed class StockNguyenLieuDto
{
    public long? Stt { get; set; }
    public string? TenChiNhanh { get; set; }
    public DateTime? Ngay_NhapKho { get; set; }
    public string? MaHang { get; set; }
    public string? MuaSP { get; set; }
    public string? ModelCode_FG { get; set; }
    public string? NhaCungCap { get; set; }
    public string? Po_No { get; set; }
    public string? Item_No { get; set; }
    public string? ModelNo { get; set; }
    public string? TenChungLoaiVatTu { get; set; }
    public string? MoTaVatTu { get; set; }
    public int? ThoiGian_LuuKho { get; set; }
    public string MauLuuKho { get; set; } = string.Empty;
    public decimal TongNhap { get; set; }
    public decimal TongXuat { get; set; }
    public decimal? SoLuongTon { get; set; }
    public string? Ten_ViTri { get; set; }
}

/// <summary>Trực quan vị trí kho nguyên liệu. SP: pr_APP_DM_Kho_ViTri_Select_TrucQuan_wID_Kho.</summary>
public sealed class TrucQuanNguyenLieuDto
{
    public short Id_ViTriKho { get; set; }
    public short? Id_Kho { get; set; }
    public string Ma_ViTriKho { get; set; } = string.Empty;
    public string Day { get; set; } = string.Empty;
    public string? Ngan { get; set; }
    public string? TenKhachHang { get; set; }
    public string? TenChungLoaiVatTu { get; set; }
    public string? MaHang { get; set; }
    public string? TenMau_VatTu { get; set; }
    public string? Item_No { get; set; }
    public decimal PhanTram { get; set; }
    public int? SoLuong_Max { get; set; }
    public decimal SoLuong { get; set; }
    public int? SoCuon { get; set; }
    public DateTime? Ngay_NhapKho { get; set; }
    public string? SoKien { get; set; }
    public short Stt_ViTriKho { get; set; }
}

/// <summary>
/// Báo cáo tồn theo mốc thời gian — nguyên liệu.
/// SP: pr_App_PackingList_ItemDetail_StockTime (cột màu là <c>Mau</c>, không phải <c>MaMau</c>).
/// </summary>
public sealed class NguyenLieuStockTimeDto
{
    public int Id_StockTime { get; set; }
    public string? Ten_StockTime { get; set; }
    public string? Mau { get; set; }
    public decimal? SoLuong { get; set; }
    public decimal? GiaTri { get; set; }
    public decimal? SoLuong_SanPham { get; set; }
    public decimal? KhoiLuong { get; set; }
}

/// <summary>Dự báo kho nguyên liệu. SP: pr_CBK_DuBaoKhoNL_Select_wKho.</summary>
public sealed class DuBaoKhoNguyenLieuDto
{
    public int Id_DuBaoKho { get; set; }
    public string? Tuan { get; set; }
    public double? ToKeDung { get; set; }
    public double? SoKeGiaiPhong { get; set; }
    public double? SoKeThem { get; set; }
    public string? SucChua { get; set; }
    public string? ChiNhanh { get; set; }
    public string? MaChiNhanh { get; set; }
    public DateTime? NgayCapNhatCuoi { get; set; }
    public short Id_Kho { get; set; }
}

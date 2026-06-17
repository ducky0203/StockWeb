
namespace StockApi.DTOs;

/// <summary>Tồn kho phụ liệu. SP: pr_Web_Report_KhoPL_Stock.</summary>
public sealed class StockPhuLieuDto
{
    public long? Id { get; set; }
    public int? Id_NPL { get; set; }
    public int? Id_VatTu { get; set; }
    public DateTime? Ngay { get; set; }
    public string? TenChiNhanh { get; set; }
    public string? KhachHang { get; set; }
    public string? MaHang { get; set; }
    public string? TenChungLoaiVatTu { get; set; }
    public string? Item { get; set; }
    public string? TenMau { get; set; }
    public string? TenCo { get; set; }
    public string? DonViTinh { get; set; }
    public string? Ma_NPL { get; set; }
    public decimal? SoLuong_ChungTu { get; set; }
    public decimal? SoLuong_DaNhap { get; set; }
    public decimal? SoLuong_ChenhLech { get; set; }
    public decimal? SoLuong_DaXuat { get; set; }
    public decimal? SoLuong_ConLai { get; set; }
    public string? Ma_ViTriKho { get; set; }
    public string? TenNhaCungCap { get; set; }
    public int? SoNgay_LuuKho { get; set; }
    public DateTime? HanSuDung { get; set; }
}

/// <summary>Trực quan vị trí kho phụ liệu. SP: pr_App_KhoPL_TrucQuan_Select_wID_Kho.</summary>
public sealed class TrucQuanPhuLieuDto
{
    public short Id_ViTriKho { get; set; }
    public short? Id_Kho { get; set; }
    public string Ma_ViTriKho { get; set; } = string.Empty;
    public string Ten_ViTriKho { get; set; } = string.Empty;
    public string Day { get; set; } = string.Empty;
    public string Ngan { get; set; } = string.Empty;
    public decimal? Max_CBM { get; set; }
    public string? TenKhachHang { get; set; }
    public string? MaHang { get; set; }
    public string? TenQuyCach { get; set; }
    public string? TenChungLoaiVatTu { get; set; }
    public string? TenMau_VatTu { get; set; }
    public string? TenCo_VatTu { get; set; }
    public int SoLuong_Thung { get; set; }
    public decimal SoLuong { get; set; }
    public DateTime? Ngay_NhapKho { get; set; }
    public DateTime? HanSuDung { get; set; }
}

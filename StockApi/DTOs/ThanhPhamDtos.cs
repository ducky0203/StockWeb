
namespace StockApi.DTOs;

/// <summary>Tồn kho thành phẩm. SP: pr_Web_Report_NhapXuatKho_ThanhPham_Stock.</summary>
public sealed class StockThanhPhamDto
{
    public long? Stt { get; set; }
    public string? MaChiNhanh { get; set; }
    public DateTime? Ngay { get; set; }
    public string? MaHang { get; set; }
    public string? Po_No { get; set; }
    public string? DichDen { get; set; }
    public int? ThoiGian_LuuKho { get; set; }
    public string? TenMau_SanPham { get; set; }
    public string? TenCo_SanPham { get; set; }
    public int? SoKien { get; set; }
    public int? TyLe_TrongKien { get; set; }
    public int? SoLuong_KeHoach { get; set; }
    public int? SoLuong_DaNhap { get; set; }
    public int? SoLuong_DaXuat { get; set; }
    public int? SoLuong_ConLai { get; set; }
    public int? SoLuong_ThungTon { get; set; }
    public string? ViTri { get; set; }
    public string? TenChiNhanh { get; set; }
    public decimal? GiaDamPhan_KH { get; set; }
    public decimal? GiaTri { get; set; }
}

/// <summary>Trực quan vị trí kho thành phẩm. SP: pr_App_NhapKho_ThanhPham_TrucQuan_Select_wMaChiNhanh.</summary>
public sealed class TrucQuanThanhPhamDto
{
    public short Id_ViTriKho { get; set; }
    public string? MaChiNhanh { get; set; }
    public string Ma_ViTriKho { get; set; } = string.Empty;
    public decimal? Max_CBM { get; set; }
    public string Day { get; set; } = string.Empty;
    public string? MaHang { get; set; }
    public string? Po_No { get; set; }
    public int? SoLuong_Thung { get; set; }
    public int SoLuong_SanPham { get; set; }
    public decimal? Cbm { get; set; }
    public decimal? PhanTram { get; set; }
}

/// <summary>Báo cáo tồn theo thời gian (thành phẩm). SP: pr_APP_CTDT_ListXuat_Carton_RfidCode_TonKho.</summary>
public sealed class StockTimeThanhPhamDto
{
    public int Id_StockTime { get; set; }
    public string? Ten_StockTime { get; set; }
    public int? SoLuong { get; set; }
    public int? SoLuong_SanPham { get; set; }
    public decimal? GiaTri { get; set; }
    public decimal? KhoiLuong { get; set; }
    public string? Mau { get; set; }
}

/// <summary>Dự báo kho thành phẩm. SP: pr_CBK_DuBaoKhoTP_Select_wMaChiNhanh.</summary>
public sealed class DuBaoKhoThanhPhamDto
{
    public int Id_DuBaoKhoTP { get; set; }
    public string? Tuan { get; set; }
    public double? SoKhoiDung { get; set; }
    public double? SoKhoiGiaiPhong { get; set; }
    public double? SoKhoiThem { get; set; }
    public string? SucChua { get; set; }
    public string? ChiNhanh { get; set; }
    public string? MaChiNhanh { get; set; }
    public string? NguoiCapNhatCuoi { get; set; }
    public DateTime? NgayCapNhatCuoi { get; set; }
}

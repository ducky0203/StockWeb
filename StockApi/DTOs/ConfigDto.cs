
namespace StockApi.DTOs;

public sealed class DM_KhoDTO
{
    public short Id_Kho { get; set; }
    public byte LoaiKho { get; set; }
    public string Ten_Kho { get; set; }
    public string MaChiNhanh { get; set; }
}

public sealed class DM_ChiNhanhDTO
{
    public string MaChiNhanh { get; set; }
    public string? TenChiNhanh { get; set; }
    public string? TenDayDu { get; set; }
    public bool? ChiNhanh_PhuTro { get; set; }
    public int? Stt { get; set; }
}

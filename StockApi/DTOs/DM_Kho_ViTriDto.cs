using System.ComponentModel.DataAnnotations;

namespace StockApi.DTOs;

public class DM_Kho_ViTriDto
{
    [Key]
    public short Id_ViTriKho { get; set; }
    public short? NhomKho { get; set; }
    public int? Id_Kho { get; set; }
    public string Ten_Kho { get; set; }
    public string? MaChiNhanh { get; set; }
    public string? TenChiNhanh { get; set; }
    public string? Ma_ViTriKho { get; set; }
    public string? Ten_ViTriKho { get; set; }
    public string? Day { get; set; }
    public string? Ngan { get; set; }
    public decimal? Max_CBM { get; set; }
    public string? GhiChu { get; set; }
    public short? Stt_ViTriKho { get; set; }
    public bool TonTai { get; set; }
}
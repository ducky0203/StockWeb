using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StockApi.Models;

[Table("DM_Kho_ViTri")]
public class DM_Kho_ViTri
{
    [Key]
    public short Id_ViTriKho { get; set; }
    public short? NhomKho { get; set; }
    public short? Id_Kho { get; set; }
    public string MaChiNhanh { get; set; }
    public string Ma_ViTriKho { get; set; }
    public string Ten_ViTriKho { get; set; }
    public string Day { get; set; }
    public string Ngan { get; set; }
    public decimal? Max_CBM { get; set; }
    public string GhiChu { get; set; }
    public short Stt_ViTriKho { get; set; }
    public bool TonTai { get; set; }
}
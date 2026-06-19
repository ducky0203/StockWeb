using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using StockApi.Commnons;
using StockApi.Data;
using StockApi.DTOs;

namespace StockApi.Services;

public interface IKhoThanhPhamService
{
    Task<List<StockThanhPhamDto>> GetStockAsync(string maChiNhanh, CancellationToken ct = default);
    Task<List<TrucQuanThanhPhamDto>> GetTrucQuanAsync(string maChiNhanh, CancellationToken ct = default);
    Task<List<StockTimeThanhPhamDto>> GetStockTimeAsync(string maChiNhanh, CancellationToken ct = default);
    Task<List<DuBaoKhoThanhPhamDto>> GetDuBaoAsync(string maChiNhanh, CancellationToken ct = default);
}

public class KhoThanhPhamService(ApplicationDbContext db, ICacheService cache) : IKhoThanhPhamService
{
    public Task<List<StockThanhPhamDto>> GetStockAsync(string maChiNhanh, CancellationToken ct = default) =>
        cache.GetOrCreateAsync($"tp:stock:{maChiNhanh}", CacheDuration.Medium, _ =>
        {
            var param = new SqlParameter("@sMaChiNhanh", maChiNhanh);
            var errorCode = new SqlParameter("@iErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
            return db.StockThanhPhamRepo
                .FromSqlRaw("EXEC dbo.pr_Web_Report_NhapXuatKho_ThanhPham_Stock @sMaChiNhanh, @iErrorCode OUTPUT", param, errorCode)
                .ToListAsync(ct);
        }, ct);

    public Task<List<TrucQuanThanhPhamDto>> GetTrucQuanAsync(string maChiNhanh, CancellationToken ct = default) =>
        cache.GetOrCreateAsync($"tp:truc-quan:{maChiNhanh}", CacheDuration.Small, _ =>
        {
            var param = new SqlParameter("@sMaChiNhanh", maChiNhanh);
            var searchParam = new SqlParameter("@sSearch", "");
            return db.TrucQuanThanhPhamRepo
                .FromSqlRaw("EXEC dbo.pr_App_NhapKho_ThanhPham_TrucQuan_Select_wMaChiNhanh @sMaChiNhanh, @sSearch", param, searchParam)
                .ToListAsync(ct);
        }, ct);

    public Task<List<StockTimeThanhPhamDto>> GetStockTimeAsync(string maChiNhanh, CancellationToken ct = default) =>
        cache.GetOrCreateAsync($"tp:stock-time:{maChiNhanh}", CacheDuration.Medium, _ =>
        {
            var param = new SqlParameter("@sMaChiNhanh", maChiNhanh);
            return db.StockTimeThanhPhamRepo
                .FromSqlRaw("EXEC dbo.pr_APP_CTDT_ListXuat_Carton_RfidCode_TonKho @sMaChiNhanh", param)
                .ToListAsync(ct);
        }, ct);

    public Task<List<DuBaoKhoThanhPhamDto>> GetDuBaoAsync(string maChiNhanh, CancellationToken ct = default) =>
        cache.GetOrCreateAsync($"tp:du-bao:{maChiNhanh}", CacheDuration.Small, _ =>
        {
            var param = new SqlParameter("@sMaChiNhanh", maChiNhanh);
            var errorCode = new SqlParameter("@iErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
            return db.DuBaoKhoThanhPhamRepo
                .FromSqlRaw("EXEC dbo.pr_CBK_DuBaoKhoTP_Select_wMaChiNhanh @sMaChiNhanh, @iErrorCode OUTPUT", param, errorCode)
                .ToListAsync(ct);
        }, ct);
}

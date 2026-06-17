using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using StockApi.Commnons;
using StockApi.Data;
using StockApi.DTOs;

namespace StockApi.Services;

public interface IKhoPhuLieuService
{
    Task<List<StockPhuLieuDto>> GetStockAsync(short id_Kho, CancellationToken ct = default);
    Task<List<TrucQuanPhuLieuDto>> GetTrucQuanAsync(short id_Kho, CancellationToken ct = default);
}

public class KhoPhuLieuService(ApplicationDbContext db, ICacheService cache) : IKhoPhuLieuService
{
    public Task<List<StockPhuLieuDto>> GetStockAsync(short id_Kho, CancellationToken ct = default) =>
        cache.GetOrCreateAsync($"pl:stock:{id_Kho}", CacheDuration.Medium, _ =>
        {
            var param = new SqlParameter("@iID_Kho", id_Kho);
            return db.StockPhuLieuRepo
                .FromSqlRaw("EXEC dbo.pr_Web_Report_KhoPL_Stock @iID_Kho", param)
                .ToListAsync(ct);
        }, ct);

    public Task<List<TrucQuanPhuLieuDto>> GetTrucQuanAsync(short id_Kho, CancellationToken ct = default) =>
        cache.GetOrCreateAsync($"pl:truc-quan:{id_Kho}", CacheDuration.Small, _ =>
        {
            var param = new SqlParameter("@iID_Kho", id_Kho);
            return db.TrucQuanPhuLieuRepo
                .FromSqlRaw("EXEC dbo.pr_App_KhoPL_TrucQuan_Select_wID_Kho @iID_Kho", param)
                .ToListAsync(ct);
        }, ct);
}

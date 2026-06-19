using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using StockApi.Commnons;
using StockApi.Data;
using StockApi.DTOs;

namespace StockApi.Services;

public interface IKhoNguyenLieuService
{
    Task<List<StockNguyenLieuDto>> GetStockAsync(short id_Kho, CancellationToken ct = default);
    Task<List<TrucQuanNguyenLieuDto>> GetTrucQuanAsync(short id_Kho, CancellationToken ct = default);
    Task<List<NguyenLieuStockTimeDto>> GetStockTimeAsync(short id_Kho, CancellationToken ct = default);
    Task<List<DuBaoKhoNguyenLieuDto>> GetDuBaoAsync(short id_Kho, CancellationToken ct = default);
}

public class KhoNguyenLieuService(ApplicationDbContext db, ICacheService cache) : IKhoNguyenLieuService
{
    public Task<List<StockNguyenLieuDto>> GetStockAsync(short id_Kho, CancellationToken ct = default) =>
        cache.GetOrCreateAsync($"nl:stock:{id_Kho}", CacheDuration.Medium, _ =>
        {
            var param = new SqlParameter("@iID_Kho", id_Kho);
            return db.StockNguyenLieuRepo
                .FromSqlRaw("EXEC dbo.pr_Web_rptPackingList_ItemDetail_Stock @iID_Kho", param)
                .ToListAsync(ct);
        }, ct);

    public Task<List<TrucQuanNguyenLieuDto>> GetTrucQuanAsync(short id_Kho, CancellationToken ct = default) =>
        cache.GetOrCreateAsync($"nl:truc-quan:{id_Kho}", CacheDuration.Small, _ =>
        {
            var param = new SqlParameter("@iID_Kho", id_Kho);
            return db.TrucQuanNguyenLieuRepo
                .FromSqlRaw("EXEC dbo.pr_APP_DM_Kho_ViTri_Select_TrucQuan_wID_Kho @iID_Kho, @sSearch = ''", param)
                .ToListAsync(ct);
        }, ct);

    public Task<List<NguyenLieuStockTimeDto>> GetStockTimeAsync(short id_Kho, CancellationToken ct = default) =>
        cache.GetOrCreateAsync($"nl:stock-time:{id_Kho}", CacheDuration.Medium, _ =>
        {
            var param = new SqlParameter("@iID_Kho", id_Kho);
            return db.NguyenLieuStockTimeRepo
                .FromSqlRaw("EXEC dbo.pr_App_PackingList_ItemDetail_StockTime @iID_Kho", param)
                .ToListAsync(ct);
        }, ct);

    public Task<List<DuBaoKhoNguyenLieuDto>> GetDuBaoAsync(short id_Kho, CancellationToken ct = default) =>
        cache.GetOrCreateAsync($"nl:du-bao:{id_Kho}", CacheDuration.Small, _ =>
        {
            var param = new SqlParameter("@iID_Kho", id_Kho);
            var errorCode = new SqlParameter("@iErrorCode", SqlDbType.Int) { Direction = ParameterDirection.Output };
            return db.DuBaoKhoNguyenLieuRepo
                .FromSqlRaw("EXEC dbo.pr_CBK_DuBaoKhoNL_Select_wKho @iID_Kho, @iErrorCode OUTPUT", param, errorCode)
                .ToListAsync(ct);
        }, ct);
}

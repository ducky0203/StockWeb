using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using StockApi.Commnons;
using StockApi.Data;
using StockApi.DTOs;

namespace StockApi.Services;

public interface IPackingListService
{
    Task<List<PackingListDto>> GetMainAsync(DateOnly tuNgay, DateOnly denNgay, CancellationToken ct);
}

public class PackingListService(ApplicationDbContext db, ICacheService cache) : IPackingListService
{
    // pr_Web_PackingList_Select_Main(@daTuNgay date, @daDenNgay date)
    public Task<List<PackingListDto>> GetMainAsync(DateOnly tuNgay, DateOnly denNgay, CancellationToken ct) =>
        cache.GetOrCreateAsync($"tp:packing-list:{tuNgay}_{denNgay}", CacheDuration.Medium, _ =>
        {
            var daTuNgay = new SqlParameter("@daTuNgay", SqlDbType.Date)
            {
                Value = tuNgay.ToDateTime(TimeOnly.MinValue)
            };
            var daDenNgay = new SqlParameter("@daDenNgay", SqlDbType.Date)
            {
                Value = denNgay.ToDateTime(TimeOnly.MinValue)
            };
            return db.PackingListRepo
                .FromSqlRaw("EXEC dbo.pr_Web_PackingList_Select_Main @daTuNgay, @daDenNgay", daTuNgay, daDenNgay)
                .ToListAsync(ct);
        }, ct);
}

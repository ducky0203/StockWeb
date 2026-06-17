using Microsoft.EntityFrameworkCore;
using StockApi.Commnons;
using StockApi.Data;
using StockApi.DTOs;

namespace StockApi.Services;

public interface IConfigService
{
    Task<List<DM_KhoDTO>> GetListKho(CancellationToken ct = default);
    Task<List<DM_ChiNhanhDTO>> GetListChiNhanh(CancellationToken ct = default);

    Task<List<DM_KhoDTO>> GetAllKho(CancellationToken ct = default);
    Task<List<DM_ChiNhanhDTO>> GetAllChiNhanh(CancellationToken ct = default);
}

public class ConfigService(ApplicationDbContext context, ICacheService cache) : IConfigService
{
    public Task<List<DM_KhoDTO>> GetListKho(CancellationToken ct = default) =>
        cache.GetOrCreateAsync("config:list-kho", CacheDuration.Large, _ =>
        {
            const string sqlRaw = """
                                  SELECT a.ID_Kho, a.Ten_Kho, a.LoaiKho, a.MaChiNhanh
                                  FROM dbo.DM_Kho a
                                  INNER JOIN TNG_SYSDB.dbo.DM_CHINHANH cn ON a.MaChiNhanh = cn.MaChiNhanh
                                  WHERE a.LoaiKho IN (1, 2)
                                    AND a.TonTai = 1
                                    AND cn.TinhTrangSuDung = 1
                                    AND cn.TinhTrangTonTai = 1
                                    AND ChiNhanh_Ngoai = 0
                                    AND a.MaChiNhanh IN ('05', '06', '11', '12', '14')
                                  ORDER BY a.STT_Kho
                                  """;
            return context.DM_KhoRepo.FromSqlRaw(sqlRaw).ToListAsync(ct);
        }, ct);

    public Task<List<DM_ChiNhanhDTO>> GetListChiNhanh(CancellationToken ct = default) =>
        cache.GetOrCreateAsync("config:list-chi-nhanh", CacheDuration.Large, _ =>
        {
            const string sqlRaw = """
                                  SELECT cn.MaChiNhanh, cn.TenChiNhanh, cn.ChiNhanh_PhuTro, cn.STT
                                  FROM TNG_SYSDB.dbo.DM_CHINHANH cn
                                  WHERE cn.MaChiNhanh IN ('05', '06', '11', '12', '14')
                                    AND cn.ChiNhanh_Ngoai = 0
                                    AND cn.TinhTrangSuDung = 1
                                    AND cn.TinhTrangTonTai = 1
                                  ORDER BY cn.MaChiNhanh
                                  """;
            return context.DM_ChiNhanhRepo.FromSqlRaw(sqlRaw).ToListAsync(ct);
        }, ct);

    public Task<List<DM_KhoDTO>> GetAllKho(CancellationToken ct = default) =>
        cache.GetOrCreateAsync("config:all-kho", CacheDuration.Large, _ =>
        {
            const string sqlRaw = """
                                  SELECT a.ID_Kho, a.Ten_Kho, a.LoaiKho, a.MaChiNhanh
                                  FROM dbo.DM_Kho a
                                  INNER JOIN TNG_SYSDB.dbo.DM_CHINHANH cn ON a.MaChiNhanh = cn.MaChiNhanh
                                  WHERE a.LoaiKho IN (1, 2)
                                    AND a.TonTai = 1
                                    AND cn.TinhTrangSuDung = 1
                                    AND cn.TinhTrangTonTai = 1
                                    AND ChiNhanh_Ngoai = 0
                                  ORDER BY a.STT_Kho
                                  """;
            return context.DM_KhoRepo.FromSqlRaw(sqlRaw).ToListAsync(ct);
        }, ct);

    public Task<List<DM_ChiNhanhDTO>> GetAllChiNhanh(CancellationToken ct = default) =>
        cache.GetOrCreateAsync("config:all-chi-nhanh", CacheDuration.Large, _ =>
        {
            const string sqlRaw = """
                                  SELECT cn.MaChiNhanh, cn.TenChiNhanh, cn.ChiNhanh_PhuTro, cn.STT
                                  FROM TNG_SYSDB.dbo.DM_CHINHANH cn
                                  WHERE cn.ChiNhanh_Ngoai = 0
                                    AND cn.TinhTrangSuDung = 1
                                    AND cn.TinhTrangTonTai = 1
                                  ORDER BY cn.MaChiNhanh
                                  """;
            return context.DM_ChiNhanhRepo.FromSqlRaw(sqlRaw).ToListAsync(ct);
        }, ct);
}

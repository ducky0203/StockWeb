using StockApi.Commnons;

namespace StockApi.Services;

public static class ApplicationServices
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddMemoryCache();
        services.AddSingleton<ICacheService, CacheService>();

        services.AddScoped<IConfigService, ConfigService>();
        services.AddScoped<IKhoNguyenLieuService, KhoNguyenLieuService>();
        services.AddScoped<IKhoPhuLieuService, KhoPhuLieuService>();
        services.AddScoped<IKhoThanhPhamService, KhoThanhPhamService>();
        services.AddScoped<IPackingListService, PackingListService>();
        return services;
    }
}

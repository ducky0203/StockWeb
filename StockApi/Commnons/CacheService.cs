using Microsoft.Extensions.Caching.Memory;

namespace StockApi.Commnons;

public interface ICacheService
{
    Task<T> GetOrCreateAsync<T>(string key, TimeSpan ttl, Func<CancellationToken, Task<T>> factory, CancellationToken ct = default);
}

public class CacheService(IMemoryCache cache) : ICacheService
{
    public async Task<T> GetOrCreateAsync<T>(string key, TimeSpan ttl, Func<CancellationToken, Task<T>> factory, CancellationToken ct = default)
    {
        if (cache.TryGetValue(key, out T? cached) && cached is not null)
            return cached;

        var value = await factory(ct);

        cache.Set(key, value, new MemoryCacheEntryOptions { AbsoluteExpirationRelativeToNow = ttl });

        return value;
    }
}

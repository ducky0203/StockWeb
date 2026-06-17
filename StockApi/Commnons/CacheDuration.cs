namespace StockApi.Commnons;

public static class CacheDuration
{
    public static readonly TimeSpan Small  = TimeSpan.FromMinutes(10);
    public static readonly TimeSpan Medium = TimeSpan.FromMinutes(20);
    public static readonly TimeSpan Large  = TimeSpan.FromMinutes(30);
}

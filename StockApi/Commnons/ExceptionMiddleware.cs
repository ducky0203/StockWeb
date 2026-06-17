using System.Text.Json;

namespace StockApi.Commnons;

public class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (AppException ex)
        {
            logger.LogWarning(ex, "Application exception: {Message}", ex.Message);
            await WriteResponse(context, ex.StatusCode, ex.Message);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled exception");
            await WriteResponse(context, 500, "Internal server error");
        }
    }

    private static Task WriteResponse(HttpContext context, int statusCode, string message)
    {
        var response = ApiResponse<object>.Fail(statusCode, message);
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";
        return context.Response.WriteAsync(JsonSerializer.Serialize(response, JsonOptions));
    }
}

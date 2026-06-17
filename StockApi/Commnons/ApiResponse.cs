namespace StockApi.Commnons;

public class ApiResponse<T>
{
    public bool Success { get; init; }
    public int Code { get; init; }
    public string Message { get; init; } = string.Empty;
    public T? Data { get; init; }

    public static ApiResponse<T> Ok(T data, string message = "Success") =>
        new() { Success = true, Code = 200, Message = message, Data = data };

    public static ApiResponse<T> Created(T data, string message = "Created") =>
        new() { Success = true, Code = 201, Message = message, Data = data };

    public static ApiResponse<T> Fail(int code, string message) =>
        new() { Success = false, Code = code, Message = message };

    public static ApiResponse<T> BadRequest(string message = "Bad request") =>
        Fail(400, message);

    public static ApiResponse<T> NotFound(string message = "Not found") =>
        Fail(404, message);

    public static ApiResponse<T> ServerError(string message = "Internal server error") =>
        Fail(500, message);
}

public static class ApiResponse
{
    public static ApiResponse<object> Ok(string message = "Success") =>
        ApiResponse<object>.Ok(null!, message);

    public static ApiResponse<T> Ok<T>(T data, string message = "Success") =>
        ApiResponse<T>.Ok(data, message);

    public static ApiResponse<T> Created<T>(T data, string message = "Created") =>
        ApiResponse<T>.Created(data, message);

    public static ApiResponse<object> Fail(int code, string message) =>
        ApiResponse<object>.Fail(code, message);

    public static ApiResponse<object> BadRequest(string message = "Bad request") =>
        ApiResponse<object>.BadRequest(message);

    public static ApiResponse<object> NotFound(string message = "Not found") =>
        ApiResponse<object>.NotFound(message);

    public static ApiResponse<object> ServerError(string message = "Internal server error") =>
        ApiResponse<object>.ServerError(message);
}

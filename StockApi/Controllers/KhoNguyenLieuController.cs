using Microsoft.AspNetCore.Mvc;
using StockApi.Commnons;
using StockApi.Services;

namespace StockApi.Controllers;

[ApiController]
[Route("api/nguyen-lieu")]
[Produces("application/json")]
public class KhoNguyenLieuController(
    IKhoNguyenLieuService service,
    ILogger<KhoNguyenLieuController> logger) : ControllerBase
{
    [HttpGet("stock")]
    public async Task<IActionResult> GetStock([FromQuery] short id_Kho, CancellationToken ct)
    {
        try
        {
            var data = await service.GetStockAsync(id_Kho, ct);
            return Ok(ApiResponse.Ok(new {listStock = data}));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Lỗi lấy tồn kho nguyên liệu id_Kho={id_Kho}", id_Kho);
            return StatusCode(500, ApiResponse.ServerError());
        }
    }

    [HttpGet("truc-quan")]
    public async Task<IActionResult> GetTrucQuan([FromQuery] short id_Kho, CancellationToken ct)
    {
        try
        {
            var data = await service.GetTrucQuanAsync(id_Kho, ct);
            return Ok(ApiResponse.Ok(new {listTrucQuan = data}));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Lỗi lấy trực quan kho nguyên liệu id_Kho={id_Kho}", id_Kho);
            return StatusCode(500, ApiResponse.ServerError());
        }
    }

    [HttpGet("stock-time")]
    public async Task<IActionResult> GetStockTime([FromQuery] short id_Kho, CancellationToken ct)
    {
        try
        {
            var data = await service.GetStockTimeAsync(id_Kho, ct);
            return Ok(ApiResponse.Ok(new {listStockTime = data}));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Lỗi lấy tồn theo mốc thời gian nguyên liệu id_Kho={id_Kho}", id_Kho);
            return StatusCode(500, ApiResponse.ServerError());
        }
    }

    [HttpGet("du-bao")]
    public async Task<IActionResult> GetDuBao([FromQuery] short id_Kho, CancellationToken ct)
    {
        try
        {
            var data = await service.GetDuBaoAsync(id_Kho, ct);
            return Ok(ApiResponse.Ok(new {listDuBao = data}));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Lỗi lấy dự báo kho nguyên liệu id_Kho={id_Kho}", id_Kho);
            return StatusCode(500, ApiResponse.ServerError());
        }
    }
}

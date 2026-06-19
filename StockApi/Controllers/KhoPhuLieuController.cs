using Microsoft.AspNetCore.Mvc;
using StockApi.Commnons;
using StockApi.Services;

namespace StockApi.Controllers;

[ApiController]
[Route("api/phu-lieu")]
[Produces("application/json")]
public class KhoPhuLieuController(
    IKhoPhuLieuService service,
    ILogger<KhoPhuLieuController> logger) : ControllerBase
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
            logger.LogError(ex, "Lỗi lấy tồn kho phụ liệu id_Kho={id_Kho}", id_Kho);
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
            logger.LogError(ex, "Lỗi lấy trực quan kho phụ liệu id_Kho={id_Kho}", id_Kho);
            return StatusCode(500, ApiResponse.ServerError());
        }
    }
}

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
    [HttpGet("stock/{id_Kho:int}")]
    public async Task<IActionResult> GetStock(short id_Kho, CancellationToken ct)
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

    [HttpGet("truc-quan/{id_Kho:int}")]
    public async Task<IActionResult> GetTrucQuan(short id_Kho, CancellationToken ct)
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

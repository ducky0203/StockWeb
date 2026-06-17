using Microsoft.AspNetCore.Mvc;
using StockApi.Commnons;
using StockApi.Services;

namespace StockApi.Controllers;

[ApiController]
[Route("api/thanh-pham")]
[Produces("application/json")]
public class KhoThanhPhamController(
    IKhoThanhPhamService service,
    ILogger<KhoThanhPhamController> logger) : ControllerBase
{
    [HttpGet("stock/{maChiNhanh}")]
    public async Task<IActionResult> GetStock(string maChiNhanh, CancellationToken ct)
    {
        try
        {
            var data = await service.GetStockAsync(maChiNhanh, ct);
            return Ok(ApiResponse.Ok(new {listStock = data}));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Lỗi lấy tồn kho thành phẩm maChiNhanh={MaChiNhanh}", maChiNhanh);
            return StatusCode(500, ApiResponse.ServerError());
        }
    }

    [HttpGet("truc-quan/{maChiNhanh}")]
    public async Task<IActionResult> GetTrucQuan(string maChiNhanh, CancellationToken ct)
    {
        try
        {
            var data = await service.GetTrucQuanAsync(maChiNhanh, ct);
            return Ok(ApiResponse.Ok(new {listTrucQuan = data}));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Lỗi lấy trực quan kho thành phẩm maChiNhanh={MaChiNhanh}", maChiNhanh);
            return StatusCode(500, ApiResponse.ServerError());
        }
    }

    [HttpGet("stock-time/{maChiNhanh}")]
    public async Task<IActionResult> GetStockTime(string maChiNhanh, CancellationToken ct)
    {
        try
        {
            var data = await service.GetStockTimeAsync(maChiNhanh, ct);
            return Ok(ApiResponse.Ok(new {listStockTime = data}));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Lỗi lấy tồn theo thời gian thành phẩm maChiNhanh={MaChiNhanh}", maChiNhanh);
            return StatusCode(500, ApiResponse.ServerError());
        }
    }

    [HttpGet("du-bao/{maChiNhanh}")]
    public async Task<IActionResult> GetDuBao(string maChiNhanh, CancellationToken ct)
    {
        try
        {
            var data = await service.GetDuBaoAsync(maChiNhanh, ct);
            return Ok(ApiResponse.Ok(new {listDuBao = data}));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Lỗi lấy dự báo kho thành phẩm maChiNhanh={MaChiNhanh}", maChiNhanh);
            return StatusCode(500, ApiResponse.ServerError());
        }
    }
}

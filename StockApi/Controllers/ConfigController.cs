using Microsoft.AspNetCore.Mvc;
using StockApi.Commnons;
using StockApi.Services;

namespace StockApi.Controllers;

[ApiController]
[Route("api/config")]
[Produces("application/json")]
public class ConfigController(IConfigService configService, ILogger<ConfigController> logger) : ControllerBase
{
    [HttpGet("list-config")]
    public async Task<IActionResult> GetListConfig(CancellationToken ct)
    {
        try
        {
            var listKho = await configService.GetListKho(ct);
            var listChiNhanh = await configService.GetListChiNhanh(ct);
            return Ok(ApiResponse.Ok(new { listKho, listChiNhanh }));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting list config");
            return StatusCode(500, ApiResponse.ServerError());
        }
    }

    [HttpGet("all-config")]
    public async Task<IActionResult> GetAllConfig(CancellationToken ct)
    {
        try
        {
            var listKho = await configService.GetAllKho(ct);
            var listChiNhanh = await configService.GetAllChiNhanh(ct);
            return Ok(ApiResponse.Ok(new { listKho, listChiNhanh }));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting all config");
            return StatusCode(500, ApiResponse.ServerError());
        }
    }

    [HttpGet("vi-tri-kho")]
    public async Task<IActionResult> GetViTriKho_NPL([FromQuery] short id_Kho, CancellationToken ct)
    {
        try
        {
            var listViTriKho = await configService.GetListViTri_WithID_Kho(id_Kho, ct);
            return Ok(ApiResponse.Ok(new { listViTriKho }));
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error getting all config");
            return StatusCode(500, ApiResponse.ServerError());
        }
    }
    
    [HttpGet("vi-tri-thanh-pham")]
    public async Task<IActionResult> GetViTriKho_ThanhPham([FromQuery] string maChiNhanh, CancellationToken ct)
    {
        try
        {
            var listViTriKho = await configService.GetListViTri_WithMaChiNhanh(maChiNhanh, ct);
            return Ok(ApiResponse.Ok(new { listViTriKho }));
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error getting all config");
            return StatusCode(500, ApiResponse.ServerError());
        }
    }
}

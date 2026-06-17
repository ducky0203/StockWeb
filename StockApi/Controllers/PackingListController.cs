using Microsoft.AspNetCore.Mvc;
using StockApi.Commnons;
using StockApi.Services;

namespace StockApi.Controllers;

[ApiController]
[Route("api/packing-list")]
public class PackingListController(IPackingListService service, ILogger<KhoThanhPhamController> logger) : ControllerBase
{
    // pr_Web_PackingList_Select_Main lọc theo khoảng ngày (@daTuNgay, @daDenNgay) — bắt buộc cả hai.
    [HttpGet]
    public async Task<IActionResult> GetPackingList([FromQuery] DateOnly tuNgay, [FromQuery] DateOnly denNgay,
        CancellationToken cancellationToken)
    {
        try
        {
            var data = await service.GetMainAsync(tuNgay, denNgay, cancellationToken);
            return Ok(ApiResponse.Ok(new {listPackingList = data}));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "GetPackingList");
            return StatusCode(500, ApiResponse.ServerError());
        }
    }
    // {
    //     // await query.GetMainAsync(tuNgay, denNgay, cancellationToken)
    // }
    
       
}
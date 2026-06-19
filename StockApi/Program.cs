using Serilog;
using StockApi.Commnons;
using StockApi.Data;
using StockApi.Services;
using Microsoft.EntityFrameworkCore;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

var builder = WebApplication.CreateBuilder(args);

// Ghi log ra path tuyệt đối theo ContentRoot để không phụ thuộc working directory của IIS.
var logPath = Path.Combine(builder.Environment.ContentRootPath, "logs", "log-.txt");

builder.Host.UseSerilog((ctx, _, config) => config
    .ReadFrom.Configuration(ctx.Configuration)
    .WriteTo.Console()
    .WriteTo.File(logPath, rollingInterval: RollingInterval.Day)
);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new()
    {
        Title = "StockApi API",
        Version = "v1",
        Description = "API kho TNG - Nguyên liệu, Phụ liệu, Thành phẩm, PackingList"
    });
});

builder.Services.AddDbContext<ApplicationDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
        sql => sql.EnableRetryOnFailure(3))
);

builder.Services.AddCors(opt =>
    opt.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod()
    )
);

builder.Services.AddApplicationServices();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapGet("/", () => Results.Redirect("/swagger"));
}

// CORS phải chạy sớm nhất: đảm bảo preflight OPTIONS và cả response lỗi đều có header CORS,
// tránh việc HttpsRedirection redirect preflight hoặc ExceptionMiddleware nuốt mất header.
app.UseCors();

app.UseMiddleware<ExceptionMiddleware>();
app.UseSerilogRequestLogging();

// Chỉ redirect HTTPS khi đã cấu hình HTTPS port (tránh lỗi/redirect hỏng khi IIS chỉ bind HTTP).
if (app.Configuration["HttpsRedirection:Enabled"] != "false")
{
    app.UseHttpsRedirection();
}

app.MapControllers();

app.Run();

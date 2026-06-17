using Microsoft.EntityFrameworkCore;
using StockApi.DTOs;

namespace StockApi.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<DM_KhoDTO> DM_KhoRepo { get; set; }
    public DbSet<DM_ChiNhanhDTO> DM_ChiNhanhRepo { get; set; }

    // Nguyên liệu
    public DbSet<StockNguyenLieuDto> StockNguyenLieuRepo { get; set; }
    public DbSet<TrucQuanNguyenLieuDto> TrucQuanNguyenLieuRepo { get; set; }
    public DbSet<NguyenLieuStockTimeDto> NguyenLieuStockTimeRepo { get; set; }
    public DbSet<DuBaoKhoNguyenLieuDto> DuBaoKhoNguyenLieuRepo { get; set; }

    // Phụ liệu
    public DbSet<StockPhuLieuDto> StockPhuLieuRepo { get; set; }
    public DbSet<TrucQuanPhuLieuDto> TrucQuanPhuLieuRepo { get; set; }

    // Thành phẩm
    public DbSet<StockThanhPhamDto> StockThanhPhamRepo { get; set; }
    public DbSet<TrucQuanThanhPhamDto> TrucQuanThanhPhamRepo { get; set; }
    public DbSet<StockTimeThanhPhamDto> StockTimeThanhPhamRepo { get; set; }
    public DbSet<DuBaoKhoThanhPhamDto> DuBaoKhoThanhPhamRepo { get; set; }

    // Packing list
    public DbSet<PackingListDto> PackingListRepo { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Config
        modelBuilder.Entity<DM_KhoDTO>().HasNoKey();
        modelBuilder.Entity<DM_ChiNhanhDTO>().HasNoKey();

        // Nguyên liệu
        modelBuilder.Entity<StockNguyenLieuDto>().HasNoKey();
        modelBuilder.Entity<TrucQuanNguyenLieuDto>().HasNoKey();
        modelBuilder.Entity<NguyenLieuStockTimeDto>().HasNoKey();
        modelBuilder.Entity<DuBaoKhoNguyenLieuDto>().HasNoKey();

        // Phụ liệu
        modelBuilder.Entity<StockPhuLieuDto>().HasNoKey();
        modelBuilder.Entity<TrucQuanPhuLieuDto>().HasNoKey();

        // Thành phẩm
        modelBuilder.Entity<StockThanhPhamDto>().HasNoKey();
        modelBuilder.Entity<TrucQuanThanhPhamDto>().HasNoKey();
        modelBuilder.Entity<StockTimeThanhPhamDto>().HasNoKey();
        modelBuilder.Entity<DuBaoKhoThanhPhamDto>().HasNoKey();

        // Packing list
        modelBuilder.Entity<PackingListDto>().HasNoKey();
    }
}

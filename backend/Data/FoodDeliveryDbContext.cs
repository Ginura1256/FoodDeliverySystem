using Microsoft.EntityFrameworkCore;
using FoodDelivery.API.Models;

namespace FoodDelivery.API.Data;

public class FoodDeliveryDbContext : DbContext
{
    public FoodDeliveryDbContext(DbContextOptions<FoodDeliveryDbContext> options)
        : base(options)
    {
    }

    public DbSet<Order> Orders { get; set; } = null!;
    public DbSet<MenuItem> MenuItems { get; set; } = null!;
    public DbSet<DeliveryJob> DeliveryJobs { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // One-to-one relationship between Order and DeliveryJob
        modelBuilder.Entity<Order>()
            .HasOne(o => o.DeliveryJob)
            .WithOne(d => d.Order)
            .HasForeignKey<DeliveryJob>(d => d.OrderId);

        // Many-to-many relationship between Order and MenuItem
        modelBuilder.Entity<Order>()
            .HasMany(o => o.Items)
            .WithMany(m => m.Orders);
    }
}

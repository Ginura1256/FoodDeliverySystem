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

        // Configure One-to-One relationship between Order and DeliveryJob
        modelBuilder.Entity<Order>()
            .HasOne(o => o.DeliveryJob)
            .WithOne(d => d.Order)
            .HasForeignKey<DeliveryJob>(d => d.OrderId);

        // Configure Many-to-Many relationship between Order and MenuItem
        modelBuilder.Entity<Order>()
            .HasMany(o => o.Items)
            .WithMany(m => m.Orders);

        // Seed Initial Data for MenuItem entity
        modelBuilder.Entity<MenuItem>().HasData(
            new MenuItem
            {
                Id = 1,
                Name = "Classic Cheeseburger",
                Description = "Juicy beef patty with cheddar cheese, lettuce, tomato, and special sauce",
                Price = 12.99m,
                IsAvailable = true,
                CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new MenuItem
            {
                Id = 2,
                Name = "Margherita Pizza",
                Description = "Fresh mozzarella, San Marzano tomatoes, and organic basil on crispy crust",
                Price = 16.50m,
                IsAvailable = true,
                CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new MenuItem
            {
                Id = 3,
                Name = "Creamy Alfredo Pasta",
                Description = "Fettuccine pasta tossed in rich parmesan cream sauce with garlic herbs",
                Price = 14.75m,
                IsAvailable = true,
                CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );
    }
}

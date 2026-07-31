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
}

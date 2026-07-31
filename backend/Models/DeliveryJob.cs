namespace FoodDelivery.API.Models;

public class DeliveryJob
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public int DriverId { get; set; }
    public string Status { get; set; } = "Assigned";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Order Order { get; set; } = null!;
}

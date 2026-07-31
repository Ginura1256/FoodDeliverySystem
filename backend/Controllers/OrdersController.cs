using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FoodDelivery.API.Data;
using FoodDelivery.API.Models;

namespace FoodDelivery.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly FoodDeliveryDbContext _context;

    public OrdersController(FoodDeliveryDbContext context)
    {
        _context = context;
    }

    // GET: api/orders
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
    {
        return await _context.Orders.ToListAsync();
    }

    // POST: api/orders
    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder(Order order)
    {
        if (order.CreatedAt == default)
        {
            order.CreatedAt = DateTime.UtcNow;
        }

        if (order.UpdatedAt == default)
        {
            order.UpdatedAt = DateTime.UtcNow;
        }

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetOrders), new { id = order.Id }, order);
    }
}

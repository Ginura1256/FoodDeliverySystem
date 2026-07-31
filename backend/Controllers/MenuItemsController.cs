using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FoodDelivery.API.Data;
using FoodDelivery.API.Models;

namespace FoodDelivery.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MenuItemsController : ControllerBase
{
    private readonly FoodDeliveryDbContext _context;

    public MenuItemsController(FoodDeliveryDbContext context)
    {
        _context = context;
    }

    // GET: api/menuitems
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MenuItem>>> GetMenuItems()
    {
        return await _context.MenuItems.ToListAsync();
    }
}

using System.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using FoodRegistration.Models;

namespace FoodRegistration.Controllers
{
    public class HomeController : Controller
    {
        private readonly ItemDbContext _itemDbContext; // Dependency Injection for DbContext
        private readonly ILogger<HomeController> _logger; // Logger for error handling

        // Constructor for dependency injection
        public HomeController(ItemDbContext itemDbContext, ILogger<HomeController> logger)
        {
            _itemDbContext = itemDbContext;
            _logger = logger;
        }

        public async Task<IActionResult> Index()
        {
            try
            {
                var items = await _itemDbContext.Items.ToListAsync(); // Fetch items asynchronously
                ViewBag.CurrentViewName = "Index";
                return View(items);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching items for Index.");
                return View("Error"); // Return an Error view
            }
        }

        public async Task<IActionResult> Details(int id)
        {
            try
            {
                var item = await _itemDbContext.Items.FirstOrDefaultAsync(i => i.ItemId == id);

                if (item == null)
                {
                    _logger.LogWarning("Item with ID {ItemId} not found.", id);
                    return NotFound("The requested item was not found.");
                }

                return View(item);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching item details for ID {ItemId}.", id);
                return View("Error"); // Return an Error view
            }
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Create(Item item)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid model state for item: {@Item}", item);
                return View(item); // Re-render the form with validation messages
            }

            try
            {
                _itemDbContext.Items.Add(item);
                await _itemDbContext.SaveChangesAsync(); // Save changes asynchronously
                return RedirectToAction(nameof(Index));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while creating a new item: {@Item}", item);
                return View("Error"); // Return an Error view
            }
        }

        public async Task<List<Item>> GetItems()
        {
            try
            {
                return await Task.FromResult(new List<Item>
                {
                    new Item
                    {
                        ItemId = 1,
                        Name = "Biff",
                        Category = "Meat",
                        Sertifikat = "Best price",
                        ImageUrl = "/images/biff.jpg"
                    },
                    new Item
                    {
                        ItemId = 2,
                        Name = "Potet",
                        Category = "Vegetables",
                        Sertifikat = "Vegan",
                        ImageUrl = "/images/potet_.jpg"
                    },
                    new Item
                    {
                        ItemId = 3,
                        Name = "Rosin bolle",
                        Category = "Bakst",
                        Sertifikat = ""
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while generating the items list.");
                return new List<Item>(); // Return an empty list on error
            }
        }
    }
}
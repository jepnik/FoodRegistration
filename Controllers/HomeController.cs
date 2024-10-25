using System.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using FoodRegistration.Models;
using FoodRegistration.DAL;
using FoodRegistration.ViewModels;

namespace FoodRegistration.Controllers
{
    public class HomeController : Controller
    {
        private readonly IItemRepository _itemRepository; // Dependency Injection for DbContext
        private readonly ILogger<HomeController> _logger; // Logger for error handling

        // Constructor for dependency injection
        public HomeController(IItemRepository itemRepository, ILogger<HomeController> logger)
        {
            _itemRepository = itemRepository ?? throw new ArgumentNullException(nameof(itemRepository)); // Ensure the DbContext is not null
            _logger = logger ?? throw new ArgumentNullException(nameof(logger)); // Ensure the logger is not null
        }

        public async Task<IActionResult> Index()
        {
            try
            {
                var items = await _itemRepository.GetAll();
                var itemsViewModel = new ItemsViewModel(items, "Index");
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
            // Check if the ID is valid (e.g., greater than 0)
            if (id <= 0)
            {
                _logger.LogWarning("Invalid ID {ItemId} provided.", id);
                return BadRequest("The provided ID is invalid.");
            }

            try
            {
                        var item = await _itemRepository.GetItemById(id);

                if (item == null)
                {
                    _logger.LogWarning("Item with ID {ItemId} not found.", id);
                    return BadRequest("The requested item was not found.");
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
            // Check if the model state is valid
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid model state for item: {@Item}", item);
                return View(item); // Re-render the view with validation messages
            }

            try
            {
                await _itemRepository.Create(item);
                return RedirectToAction(nameof(Index));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while creating a new item: {@Item}", item);
                return View("Error"); // Return an Error view
            }
        }

        [HttpGet]
        public async Task<IActionResult> Update(int id)
        {
            var item = await _itemRepository.GetItemById(id);
            if (item == null)
            {
                return NotFound();
            }
            return View(item);
        }

        [HttpPost]
        public async Task<IActionResult> Update(Item item)
        {
            if (ModelState.IsValid)
            {
                await _itemRepository.Update(item);
                return RedirectToAction(nameof(Index));
            }
            return View(item); // Hvis noe er galt, last opp skjemaet på nytt
        }

        [HttpGet]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _itemRepository.GetItemById(id);
            if (item == null)
            {
                return NotFound();
            }
            return View(item);
        }

        [HttpPost]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            await _itemRepository.Delete(id);
            return RedirectToAction(nameof(Index));
        }
    }
}
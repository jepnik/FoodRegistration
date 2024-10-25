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
            _itemDbContext = itemDbContext ?? throw new ArgumentNullException(nameof(itemDbContext)); // Ensure the DbContext is not null
            _logger = logger ?? throw new ArgumentNullException(nameof(logger)); // Ensure the logger is not null
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
            // Check if the model state is valid
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid model state for item: {@Item}", item);
                return View(item); // Re-render the view with validation messages
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

        [HttpGet]
        public IActionResult Update(int id)
        {
            var item = _itemDbContext.Items.Find(id);
            if (item == null)
            {
                return NotFound();
            }
            return View(item);
        }

        [HttpPost]
        public IActionResult Update(Item item)
        {
            if (ModelState.IsValid)
            {
                // Hent det eksisterende elementet fra databasen
                var existingItem = _itemDbContext.Items.Include(i => i.Productinfo).FirstOrDefault(i => i.ItemId == item.ItemId);

                if (existingItem != null)
                {
                    // Oppdater feltene som ble endret
                    existingItem.Name = item.Name;
                    existingItem.Category = item.Category;
                    existingItem.Sertifikat = item.Sertifikat;
                    existingItem.ImageUrl = item.ImageUrl;
                    existingItem.Energi = item.Energi;
                    existingItem.Carbohydrates = item.Carbohydrates;
                    existingItem.Sugar = item.Sugar;
                    existingItem.Protein = item.Protein;
                    existingItem.Fat = item.Fat;
                    existingItem.Saturatedfat = item.Saturatedfat;
                    existingItem.Unsaturatedfat = item.Unsaturatedfat;
                    existingItem.Fiber = item.Fiber;
                    existingItem.Salt = item.Salt;

                    // Oppdater productinfo
                    if (existingItem.Productinfo != null)
                    {
                        existingItem.Productinfo.CountryOfOrigin = item.Productinfo?.CountryOfOrigin; // Use null-conditional operator
                        existingItem.Productinfo.CountryOfProvenance = item.Productinfo?.CountryOfProvenance; // Use null-conditional operator
                        existingItem.Productinfo.ItemNumber = item.Productinfo?.ItemNumber; // Use null-conditional operator
                    }

                    _itemDbContext.Items.Update(existingItem); // Oppdaterer det eksisterende elementet
                    _itemDbContext.SaveChanges(); // Lagre endringene
                    return RedirectToAction("Index"); // Tilbake til ønsket visning
                }
            }
            return View(item); // Hvis noe er galt, last opp skjemaet på nytt
        }

        [HttpGet]
        public IActionResult Delete(int id)
        {
            var item = _itemDbContext.Items.Find(id);
            if (item == null)
            {
                return NotFound();
            }
            return View(item);
        }

        [HttpPost]
        public IActionResult DeleteConfirmed(int id)
        {
            var item = _itemDbContext.Items.Find(id);
            if (item == null)
            {
                return NotFound();
            }
            _itemDbContext.Items.Remove(item);
            _itemDbContext.SaveChanges();
            return RedirectToAction(nameof(Index));
        }
    }
}

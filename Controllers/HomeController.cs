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
            _itemRepository = itemRepository;
            _logger = logger;
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
            try
            {

                // Henter item inkludert relasjon til Productinfo
               // var item = await _itemDbContext.Items.FirstOrDefaultAsync(i => i.ItemId == id);
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
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid model state for item: {@Item}", item);
                return View(item); // Re-render the form with validation messages
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

        /*      public async Task<List<Item>> GetItems()
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
        } */
                    //For å kunne slette og oppdatere
        /* [HttpGet]
        public IActionResult Update(int id)
        {
            var item = _itemDbContext.Items.Find(id);
            if (item == null)
            {
                return NotFound();
            }
            return View(item);
        }

        // Legg til en POST-metode for å håndtere oppdateringer
        [HttpPost]
        public IActionResult Update(Item item)
        {
            if (ModelState.IsValid)
            {
                _itemDbContext.Items.Update(item);  // Oppdaterer item i databasen
                _itemDbContext.SaveChanges();       // Lagre endringer i databasen
                return RedirectToAction("Index");   // Tilbake til ønsket visning, som en liste
            }
            return View(item);  // Hvis noe går galt, last opp siden på nytt med valideringsfeil
        } */

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
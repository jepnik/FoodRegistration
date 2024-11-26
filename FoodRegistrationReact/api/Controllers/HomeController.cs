using Microsoft.AspNetCore.Mvc;
using FoodRegistration.Models;
using FoodRegistration.DAL;
using FoodRegistration.ViewModels;
using Microsoft.Extensions.Logging;

namespace FoodRegistration.Controllers
{
    public class HomeController : Controller
    {
        private readonly IItemRepository _itemRepository;
        private readonly ILogger<HomeController> _logger;

        public HomeController(IItemRepository itemRepository, ILogger<HomeController> logger)
        {
            _itemRepository = itemRepository ?? throw new ArgumentNullException(nameof(itemRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Displays the main index page with a list of items.
        /// </summary>
        public async Task<IActionResult> Index()
        {
            try
            {
                var items = await _itemRepository.GetAll();
                if (items == null || !items.Any())
                {
                    _logger.LogWarning("No items found to display on the index page.");
                    return View(new List<Item>()); // Return an empty view model if no items exist.
                }

                var viewModel = new ItemsViewModel(items, "Index");
                return View(viewModel);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while loading the index page.");
                return StatusCode(500, "Internal server error.");
            }
        }

        /// <summary>
        /// Displays the details of an item by its ID.
        /// </summary>
        public async Task<IActionResult> Details(int id)
        {
            try
            {
                var item = await _itemRepository.GetItemById(id);
                if (item == null)
                {
                    _logger.LogWarning($"Item with ID {id} not found.");
                    return NotFound($"Item with ID {id} not found.");
                }

                return View(item);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while fetching details for item ID {id}.");
                return StatusCode(500, "Internal server error.");
            }
        }

        /// <summary>
        /// Displays the Create Item form.
        /// </summary>
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        /// <summary>
        /// Handles the creation of a new item after form submission.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create(Item item)
        {
            if (!ModelState.IsValid)
            {
                foreach (var state in ModelState)
                {
                    foreach (var error in state.Value.Errors)
                    {
                        _logger.LogWarning($"Validation error: {error.ErrorMessage}");
                    }
                }
                return View(item); // Return the form with validation errors.
            }

            try
            {
                item.CreatedDate = DateTime.UtcNow;
                await _itemRepository.Create(item);
                return RedirectToAction(nameof(Index));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating an item.");
                return StatusCode(500, "Internal server error.");
            }
        }

        /// <summary>
        /// Displays the Update Item form for a specific item ID.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> Update(int id)
        {
            try
            {
                var item = await _itemRepository.GetItemById(id);
                if (item == null)
                {
                    _logger.LogWarning($"Item with ID {id} not found for update.");
                    return NotFound($"Item with ID {id} not found.");
                }

                return View(item);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while fetching item ID {id} for update.");
                return StatusCode(500, "Internal server error.");
            }
        }

        /// <summary>
        /// Handles the update of an existing item after form submission.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Update(Item item)
        {
            if (!ModelState.IsValid)
            {
                return View(item); // Return the form with validation errors.
            }

            try
            {
                var existingItem = await _itemRepository.GetItemById(item.ItemId);
                if (existingItem == null)
                {
                    _logger.LogWarning($"Item with ID {item.ItemId} not found for update.");
                    return NotFound($"Item with ID {item.ItemId} not found.");
                }

                // Update only the properties allowed to be modified
                existingItem.Name = item.Name;
                existingItem.Category = item.Category;
                existingItem.Certificate = item.Certificate;
                existingItem.ImageUrl = item.ImageUrl;
                existingItem.Energy = item.Energy;
                existingItem.Carbohydrates = item.Carbohydrates;
                existingItem.Sugar = item.Sugar;
                existingItem.Protein = item.Protein;
                existingItem.Fat = item.Fat;
                existingItem.Saturatedfat = item.Saturatedfat;
                existingItem.Unsaturatedfat = item.Unsaturatedfat;
                existingItem.Fibre = item.Fibre;
                existingItem.Salt = item.Salt;
                existingItem.CountryOfOrigin = item.CountryOfOrigin;
                existingItem.CountryOfProvenance = item.CountryOfProvenance;
                existingItem.UpdatedDate = DateTime.UtcNow;

                await _itemRepository.Update(existingItem);
                return RedirectToAction(nameof(Index));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while updating item ID {item.ItemId}.");
                return StatusCode(500, "Internal server error.");
            }
        }

        /// <summary>
        /// Displays a confirmation page before deleting an item.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var item = await _itemRepository.GetItemById(id);
                if (item == null)
                {
                    _logger.LogWarning($"Item with ID {id} not found for deletion.");
                    return NotFound($"Item with ID {id} not found.");
                }

                return View(item);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while fetching item ID {id} for deletion.");
                return StatusCode(500, "Internal server error.");
            }
        }

        /// <summary>
        /// Handles the deletion of an item after confirmation.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            try
            {
                var success = await _itemRepository.Delete(id);
                if (!success)
                {
                    _logger.LogWarning($"Item with ID {id} not found or could not be deleted.");
                    return NotFound($"Item with ID {id} not found.");
                }

                return RedirectToAction(nameof(Index));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while deleting item ID {id}.");
                return StatusCode(500, "Internal server error.");
            }
        }
    }
}

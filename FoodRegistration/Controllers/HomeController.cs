using Microsoft.AspNetCore.Mvc;
using FoodRegistration.Models;
using FoodRegistration.DAL;
using FoodRegistration.ViewModels;

namespace FoodRegistration.Controllers;

public class HomeController : Controller
{
    //Interface for item databse
    private readonly IItemRepository _itemRepository;
    // Logger for error handling
    private readonly ILogger<HomeController> _logger;

    // Constructor for dependency injection
    public HomeController(IItemRepository itemRepository, ILogger<HomeController> logger)
    {
        _itemRepository = itemRepository ?? throw new ArgumentNullException(nameof(itemRepository)); 
        _logger = logger ?? throw new ArgumentNullException(nameof(logger)); 
    }

    // Main index page showing table with added items
    public async Task<IActionResult> Index()
    {
        var items = await _itemRepository.GetAll();
        if (items == null)
        {
            _logger.LogError("[HomeController] Item list not found while executing _itemRepository.GetAll()");
            return NotFound("Item list not found");
        }
        var itemsViewModel = new ItemsViewModel(items, "Index");
        return View(itemsViewModel);
    }

    // Details page for an item by ItemID
    public async Task<IActionResult> Details(int id)
    {
        var item = await _itemRepository.GetItemById(id);
        // Check if the ID is valid (e.g., greater than 0)
        if (item == null)
        {
            _logger.LogError("[HomeController] Item not found for the ItemId {ItemId:0000}", id);
            return NotFound("Item not found for the ItemId");
        }
        return View(item);
    }

    //Create item form 
    [HttpGet]
    public IActionResult Create()
    {
        return View();
    }

    //Submit the create item form with validation
    [HttpPost]
    public async Task<IActionResult> Create(Item item)
    {
        if (!ModelState.IsValid)
        {
            // Log validation errors
            foreach (var state in ModelState)
            {
                foreach (var error in state.Value.Errors)
                {
                    _logger.LogError($"Field: {state.Key}, Error: {error.ErrorMessage}");
                }
            }
            //returns to view with validation errors
            return View(item);
        }
        
        item.CreatedDate = DateTime.Now; 
        await _itemRepository.Create(item); 
        return RedirectToAction(nameof(Index));
    }

    //Update specific item by it's ItemId
    [HttpGet]
    public async Task<IActionResult> Update(int id)
    {
        var item = await _itemRepository.GetItemById(id);
        if (item == null)
        {
            _logger.LogError("[HomeController] Item not found when updating the ItemId {ItemId:0000}", id);
            return BadRequest("Item not found for the ItemId");
        }
        return View(item);
    }

    //Save changes to the item from update
    [HttpPost]
    public async Task<IActionResult> Update(Item item)
    {
        if (ModelState.IsValid)
        {
            //Retrieve the existing item from the database
            var existingItem = await _itemRepository.GetItemById(item.ItemId);

            if (existingItem == null)
            {
                _logger.LogError("[HomeController] Item not found when updating the ItemId {ItemId:0000}", item.ItemId);
                return NotFound("Item not found.");
            }

            //Keep original CreatedDate, only updates other properties
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
            //Set updatet date to now
            existingItem.UpdatedDate = DateTime.Now;

            // Saves updates to database
            await _itemRepository.Update(existingItem);

            return RedirectToAction(nameof(Index));
        }
        // Reload view if validation fails 
        return View(item);
    }

    //Show confirmation page for deleting an item
    [HttpGet]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await _itemRepository.GetItemById(id);
        if (item == null)
        {
            _logger.LogError("[HomeController] Item not found for the ItemId {ItemId:0000}", id);
            return BadRequest("Item not found for the ItemId");
        }
        return View(item);
    }

    // Confirm and delete item from the database
    [HttpPost]
    public async Task<IActionResult> DeleteConfirmed(int id)
    {
        bool returnOk = await _itemRepository.Delete(id);
        if (!returnOk)
        {
            _logger.LogError("[HomeController] Item deletion failed for the ItemId {ItemId:0000}", id);
            return BadRequest("Item deletion failed");
        }
        return RedirectToAction(nameof(Index));
    }
}
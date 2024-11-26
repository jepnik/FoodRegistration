using Microsoft.AspNetCore.Mvc;
using FoodRegistration.Models;
using FoodRegistration.DAL;
using FoodRegistration.ViewModels;

namespace FoodRegistration.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HomeAPIController : Controller
{
    private readonly IItemRepository _itemRepository;
    private readonly ILogger<HomeController> _logger;

    public HomeAPIController(IItemRepository itemRepository, ILogger<HomeController> logger)
    {
        _itemRepository = itemRepository;
        _logger = logger;
    }

    [HttpGet("api/items")]
    public async Task<IActionResult> GetAllItems()
    {
        var items = await _itemRepository.GetAll();
        return Ok(items);
    }

    [HttpGet("api/items/{id}")]
    public async Task<IActionResult> GetItemById(int id)
    {
        var item = await _itemRepository.GetItemById(id);
        if (item == null)
        {
            return NotFound("Item not found.");
        }
        return Ok(item);
    }

    [HttpPost("api/items")]
    public async Task<IActionResult> CreateItem([FromBody] Item item)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        item.CreatedDate = DateTime.Now;
        await _itemRepository.Create(item);
        return CreatedAtAction(nameof(GetItemById), new { id = item.ItemId }, item);
    }

    [HttpPut("api/items/{id}")]
    public async Task<IActionResult> UpdateItem(int id, [FromBody] Item updatedItem)
    {
        var existingItem = await _itemRepository.GetItemById(id);
        if (existingItem == null)
        {
            return NotFound("Item not found.");
        }

        existingItem.Name = updatedItem.Name;
        existingItem.Category = updatedItem.Category;
        existingItem.Certificate = updatedItem.Certificate;
        existingItem.ImageUrl = updatedItem.ImageUrl;
        existingItem.Energy = updatedItem.Energy;
        existingItem.Carbohydrates = updatedItem.Carbohydrates;
        existingItem.Sugar = updatedItem.Sugar;
        existingItem.Protein = updatedItem.Protein;
        existingItem.Fat = updatedItem.Fat;
        existingItem.Saturatedfat = updatedItem.Saturatedfat;
        existingItem.Unsaturatedfat = updatedItem.Unsaturatedfat;
        existingItem.Fibre = updatedItem.Fibre;
        existingItem.Salt = updatedItem.Salt;
        existingItem.CountryOfOrigin = updatedItem.CountryOfOrigin;
        existingItem.CountryOfProvenance = updatedItem.CountryOfProvenance;
        existingItem.UpdatedDate = DateTime.Now;

        await _itemRepository.Update(existingItem);
        return NoContent();
    }

    [HttpDelete("api/items/{id}")]
    public async Task<IActionResult> DeleteItem(int id)
    {
        var success = await _itemRepository.Delete(id);
        if (!success)
        {
            return NotFound("Item not found.");
        }
        return NoContent();
    }

}

public class HomeController : Controller
{
    //Interface for item databse
    private readonly IItemRepository _itemRepository;
    // Logger for error handling
    private readonly ILogger<HomeController> _logger;

    // Constructor for dependency injection
    public HomeController(IItemRepository itemRepository, ILogger<HomeController> logger)
    {
        _itemRepository = itemRepository ?? throw new ArgumentNullException(nameof(itemRepository)); // Ensure the DbContext is not null
        _logger = logger ?? throw new ArgumentNullException(nameof(logger)); // Ensure the logger is not null
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

    // Details page for an item by ID
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

    //Submit the Create item form with validation
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
            //retunrs to view with validation errors
            return View(item);
        }

        item.CreatedDate = DateTime.Now; // Set created date to now
        await _itemRepository.Create(item); // Save new item to database
        return RedirectToAction(nameof(Index));
    }

    //Render the Update item form for a specific item by it's ItemId
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

    //Submit the Update form and save changes to the item
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
            //Sett UpdatedDate til nåværende tidspunkt
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
/* 
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

    // ----- Existing MVC Functionality -----

    public async Task<IActionResult> Index()
    {
        var items = await _itemRepository.GetAll();
        if (items == null)
        {
            _logger.LogError("Failed to fetch items for Index.");
            return NotFound("Items not found.");
        }

        var viewModel = new ItemsViewModel(items, "Index");
        return View(viewModel);
    }

    public async Task<IActionResult> Details(int id)
    {
        var item = await _itemRepository.GetItemById(id);
        if (item == null)
        {
            _logger.LogError("Item not found for ID {ItemId}", id);
            return NotFound("Item not found.");
        }

        return View(item);
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
            foreach (var state in ModelState)
            {
                foreach (var error in state.Value.Errors)
                {
                    _logger.LogError("Validation error: {Error}", error.ErrorMessage);
                }
            }
            return View(item);
        }

        item.CreatedDate = DateTime.Now;
        await _itemRepository.Create(item);
        return RedirectToAction(nameof(Index));
    }

    [HttpGet]
    public async Task<IActionResult> Update(int id)
    {
        var item = await _itemRepository.GetItemById(id);
        if (item == null)
        {
            _logger.LogError("Item not found for update with ID {ItemId}", id);
            return NotFound("Item not found.");
        }

        return View(item);
    }

    [HttpPost]
    public async Task<IActionResult> Update(Item item)
    {
        if (!ModelState.IsValid)
        {
            return View(item);
        }

        var existingItem = await _itemRepository.GetItemById(item.ItemId);
        if (existingItem == null)
        {
            _logger.LogError("Item not found for update with ID {ItemId}", item.ItemId);
            return NotFound("Item not found.");
        }

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
        existingItem.UpdatedDate = DateTime.Now;

        await _itemRepository.Update(existingItem);
        return RedirectToAction(nameof(Index));
    }

    [HttpGet]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await _itemRepository.GetItemById(id);
        if (item == null)
        {
            _logger.LogError("Item not found for delete with ID {ItemId}", id);
            return NotFound("Item not found.");
        }

        return View(item);
    }

    [HttpPost]
    public async Task<IActionResult> DeleteConfirmed(int id)
    {
        var success = await _itemRepository.Delete(id);
        if (!success)
        {
            _logger.LogError("Failed to delete item with ID {ItemId}", id);
            return BadRequest("Failed to delete item.");
        }

        return RedirectToAction(nameof(Index));
    }

    // ----- API Functionality for React Frontend -----

    [HttpGet("api/items")]
    public async Task<IActionResult> GetAllItems()
    {
        var items = await _itemRepository.GetAll();
        return Ok(items);
    }

    [HttpGet("api/items/{id}")]
    public async Task<IActionResult> GetItemById(int id)
    {
        var item = await _itemRepository.GetItemById(id);
        if (item == null)
        {
            return NotFound("Item not found.");
        }
        return Ok(item);
    }

    [HttpPost("api/items")]
    public async Task<IActionResult> CreateItem([FromBody] Item item)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        item.CreatedDate = DateTime.Now;
        await _itemRepository.Create(item);
        return CreatedAtAction(nameof(GetItemById), new { id = item.ItemId }, item);
    }

    [HttpPut("api/items/{id}")]
    public async Task<IActionResult> UpdateItem(int id, [FromBody] Item updatedItem)
    {
        var existingItem = await _itemRepository.GetItemById(id);
        if (existingItem == null)
        {
            return NotFound("Item not found.");
        }

        existingItem.Name = updatedItem.Name;
        existingItem.Category = updatedItem.Category;
        existingItem.Certificate = updatedItem.Certificate;
        existingItem.ImageUrl = updatedItem.ImageUrl;
        existingItem.Energy = updatedItem.Energy;
        existingItem.Carbohydrates = updatedItem.Carbohydrates;
        existingItem.Sugar = updatedItem.Sugar;
        existingItem.Protein = updatedItem.Protein;
        existingItem.Fat = updatedItem.Fat;
        existingItem.Saturatedfat = updatedItem.Saturatedfat;
        existingItem.Unsaturatedfat = updatedItem.Unsaturatedfat;
        existingItem.Fibre = updatedItem.Fibre;
        existingItem.Salt = updatedItem.Salt;
        existingItem.CountryOfOrigin = updatedItem.CountryOfOrigin;
        existingItem.CountryOfProvenance = updatedItem.CountryOfProvenance;
        existingItem.UpdatedDate = DateTime.Now;

        await _itemRepository.Update(existingItem);
        return NoContent();
    }

    [HttpDelete("api/items/{id}")]
    public async Task<IActionResult> DeleteItem(int id)
    {
        var success = await _itemRepository.Delete(id);
        if (!success)
        {
            return NotFound("Item not found.");
        }
        return NoContent();
    }
} */
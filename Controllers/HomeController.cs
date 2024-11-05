using Microsoft.AspNetCore.Mvc;
using FoodRegistration.Models;
using FoodRegistration.DAL;
using FoodRegistration.ViewModels;

namespace FoodRegistration.Controllers;

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
        var items = await _itemRepository.GetAll();
        if (items == null)
        {
            _logger.LogError("[HomeController] Item list not found while executing _itemRepository.GetAll()");
            return NotFound("Item list not found");
        }
        var itemsViewModel = new ItemsViewModel(items, "Index");
        return View(itemsViewModel);
    }
        
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

    [HttpGet]
    public IActionResult Create()
    {
        return View();
    }

 /*    [HttpPost] denne fungerer men da er ikke ItemID automatisert
    public async Task<IActionResult> Create(Item item)
    {
        // Check if the model state is valid
        if (!ModelState.IsValid)
        {
            bool returnOk = await _itemRepository.Create(item);
            if (returnOk)
                return RedirectToAction(nameof(Index));
        }
        _logger.LogWarning("[HomeController] Item creation failed {@item}", item);
        return View(item);
    } */

    //den nye koden:
    [HttpPost]
public async Task<IActionResult> Create(Item item)
{
    if (!ModelState.IsValid)
    {
        foreach (var state in ModelState)
        {
            foreach (var error in state.Value.Errors)
            {
                _logger.LogError($"Field: {state.Key}, Error: {error.ErrorMessage}");
            }
        }
        return View(item); // Returnerer til View med valideringsfeil
    }

    item.CreatedDate = DateTime.Now;
    await _itemRepository.Create(item); // ItemId settes automatisk
    return RedirectToAction(nameof(Index));
}



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

  /*   [HttpPost]
    public async Task<IActionResult> Update(Item item)
    {
        if (ModelState.IsValid)
        {
            bool returnOk = await _itemRepository.Update(item);
            if (returnOk)
                return RedirectToAction(nameof(Index));
        }
        _logger.LogWarning("[HomeController] Item update failed {@item}", item);
        return View(item); // Hvis noe er galt, last opp skjemaet på nytt
    } */

    //ny kode for update se om fungerer

    [HttpPost]
public async Task<IActionResult> Update(Item item)
{
    if (ModelState.IsValid)
    {
        item.UpdatedDate = DateTime.Now; // Sett UpdatedDate til gjeldende tidspunkt
        await _itemRepository.Update(item); // Oppdaterer elementet i databasen
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
            _logger.LogError("[HomeController] Item not found for the ItemId {ItemId:0000}", id);
            return BadRequest("Item not found for the ItemId");
        }
        return View(item);
    }

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
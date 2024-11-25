using Microsoft.AspNetCore.Mvc;
using FoodRegistration.Models;
using FoodRegistration.DAL;
using FoodRegistration.DTOs;

namespace FoodRegistration.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItemAPIController : Controller
{
    private readonly IItemRepository _itemRepository;
    private readonly ILogger<ItemAPIController> _logger;

    public ItemAPIController(IItemRepository itemRepository, ILogger<ItemAPIController> logger)
    {
        _itemRepository = itemRepository ?? throw new ArgumentNullException(nameof(itemRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    // GET: api/ItemAPI/items
    [HttpGet("items")]
    public async Task<IActionResult> GetItems()
    {
        var items = await _itemRepository.GetAll();
        if (items == null)
        {
            _logger.LogError("[ItemAPIController] Item list not found while executing _itemRepository.GetAll()");
            return NotFound("Items not found");
        }

        // Konverter til DTO-er (hvis nødvendig)
        var itemDtos = items.Select(item => new ItemDto
        {
            ItemId = item.ItemId,
            Name = item.Name,
            Category = item.Category,
            Certificate = item.Certificate,
            ImageUrl = item.ImageUrl,
            CreatedDate = item.CreatedDate,
            UpdatedDate = item.UpdatedDate
        });

        return Ok(itemDtos);
    }

    // GET: api/ItemAPI/items/{id}
    [HttpGet("items/{id}")]
    public async Task<IActionResult> GetItemById(int id)
    {
        var item = await _itemRepository.GetItemById(id);
        if (item == null)
        {
            _logger.LogError("[ItemAPIController] Item not found for the ItemId {ItemId:0000}", id);
            return NotFound("Item not found");
        }
        return Ok(item);
    }

    // POST: api/ItemAPI/items
    [HttpPost("items")]
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

    // PUT: api/ItemAPI/items/{id}
    [HttpPut("items/{id}")]
    public async Task<IActionResult> UpdateItem(int id, [FromBody] Item item)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var existingItem = await _itemRepository.GetItemById(id);
        if (existingItem == null)
        {
            return NotFound("Item not found");
        }

        // Oppdater verdier
        existingItem.Name = item.Name;
        existingItem.Category = item.Category;
        existingItem.Certificate = item.Certificate;
        existingItem.ImageUrl = item.ImageUrl;
        existingItem.UpdatedDate = DateTime.Now;

        await _itemRepository.Update(existingItem);
        return NoContent();
    }

    // DELETE: api/ItemAPI/items/{id}
    [HttpDelete("items/{id}")]
    public async Task<IActionResult> DeleteItem(int id)
    {
        var result = await _itemRepository.Delete(id);
        if (!result)
        {
            return NotFound("Item not found");
        }
        return NoContent();
    }
}


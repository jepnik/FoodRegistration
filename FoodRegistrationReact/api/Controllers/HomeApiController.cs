using Microsoft.AspNetCore.Mvc;
using FoodRegistration.Models;
using FoodRegistration.DAL;

namespace FoodRegistration.Controllers
{
    [ApiController]
    [Route("api/items")]
    public class HomeAPIController : ControllerBase
    {
        private readonly IItemRepository _itemRepository;
        private readonly ILogger<HomeAPIController> _logger;

        public HomeAPIController(IItemRepository itemRepository, ILogger<HomeAPIController> logger)
        {
            _itemRepository = itemRepository ?? throw new ArgumentNullException(nameof(itemRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        // Retrieves a list of all items from the repository
        [HttpGet]
        public async Task<IActionResult> GetAllItems()
        {
            try
            {
                var items = await _itemRepository.GetAll();
                return Ok(items);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching all items.");
                return StatusCode(500, new { message = "Internal server error." });
            }
        }

        // Retrieves a specific item by its ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetItemById(int id)
        {
            try
            {
                var item = await _itemRepository.GetItemById(id);
                if (item == null)
                {
                    return NotFound(new { message = $"Item with ID {id} not found." });
                }
                return Ok(item);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while fetching item with ID {id}.");
                return StatusCode(500, new { message = "Internal server error." });
            }
        }

        // Creates a new item and adds it to the repository
        [HttpPost]
        public async Task<IActionResult> CreateItem([FromBody] Item item)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid model state: {ModelState}", ModelState);
                return BadRequest(new { message = "Invalid request data.", details = ModelState });
            }

            try
            {
                item.CreatedDate = DateTime.UtcNow;
                await _itemRepository.Create(item);

                _logger.LogInformation("Item created successfully: {@Item}", item);
                return CreatedAtAction(nameof(GetItemById), new { id = item.ItemId }, item);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating an item.");
                return StatusCode(500, new { message = "Internal server error." });
            }
        }

        // Updates an existing item by its ID
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateItem(int id, [FromBody] Item updatedItem)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid model state: {ModelState}", ModelState);
                return BadRequest(new { message = "Invalid request data.", details = ModelState });
            }

            try
            {
                var existingItem = await _itemRepository.GetItemById(id);
                if (existingItem == null)
                {
                    return NotFound(new { message = $"Item with ID {id} not found." });
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
                existingItem.UpdatedDate = DateTime.UtcNow;

                await _itemRepository.Update(existingItem);

                _logger.LogInformation("Item updated successfully: {@Item}", existingItem);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while updating item with ID {id}.");
                return StatusCode(500, new { message = "Internal server error." });
            }
        }

        // Deletes an item by its ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            try
            {
                var success = await _itemRepository.Delete(id);
                if (!success)
                {
                    return NotFound(new { message = $"Item with ID {id} not found." });
                }

                _logger.LogInformation($"Item with ID {id} deleted successfully.");
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while deleting item with ID {id}.");
                return StatusCode(500, new { message = "Internal server error." });
            }
        }
    }
}


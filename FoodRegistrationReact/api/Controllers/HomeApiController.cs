using Microsoft.AspNetCore.Mvc;
using FoodRegistration.Models;
using FoodRegistration.DAL;
using Microsoft.Extensions.Logging;

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

        /// <summary>
        /// Retrieves all items.
        /// </summary>
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
                return StatusCode(500, "Internal server error.");
            }
        }

        /// <summary>
        /// Retrieves a single item by ID.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetItemById(int id)
        {
            try
            {
                var item = await _itemRepository.GetItemById(id);
                if (item == null)
                {
                    return NotFound($"Item with ID {id} not found.");
                }
                return Ok(item);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while fetching item with ID {id}.");
                return StatusCode(500, "Internal server error.");
            }
        }

        /// <summary>
        /// Creates a new item.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateItem([FromBody] Item item)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                item.CreatedDate = DateTime.UtcNow;
                await _itemRepository.Create(item);
                return CreatedAtAction(nameof(GetItemById), new { id = item.ItemId }, item);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating an item.");
                return StatusCode(500, "Internal server error.");
            }
        }

        /// <summary>
        /// Updates an existing item.
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateItem(int id, [FromBody] Item updatedItem)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var existingItem = await _itemRepository.GetItemById(id);
                if (existingItem == null)
                {
                    return NotFound($"Item with ID {id} not found.");
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
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while updating item with ID {id}.");
                return StatusCode(500, "Internal server error.");
            }
        }

        /// <summary>
        /// Deletes an item by ID.
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            try
            {
                var success = await _itemRepository.Delete(id);
                if (!success)
                {
                    return NotFound($"Item with ID {id} not found.");
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while deleting item with ID {id}.");
                return StatusCode(500, "Internal server error.");
            }
        }
    }
}

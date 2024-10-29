using FoodRegistration.Models;

namespace FoodRegistration.DAL;

public interface IItemRepository
{
    Task<IEnumerable<Item>> GetAll();
    Task<Item?> GetItemById(int id);
    Task Create(Item item);
    Task<bool> Update(Item item);
    Task<bool> Delete(int id);
}
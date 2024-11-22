using FoodRegistration.Models;

namespace FoodRegistration.ViewModels
{
    public class ItemsViewModel
    {
        //items that are displayed
        public IEnumerable<Item> Items;
        //curent view name
        public string? CurrentViewName;
        // Constructor to initialize Items and CurrentViewName properties
        public ItemsViewModel(IEnumerable<Item> items, string? currentViewName)
        {
            Items = items;
            CurrentViewName = currentViewName;
        }
    }
}
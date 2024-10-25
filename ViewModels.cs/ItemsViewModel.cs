using FoodRegistration.Models;
using System.Collections.Generic;

namespace FoodRegistration.ViewModels
{
    public class ItemsViewModel
    {
        public IEnumerable<Item> Items; // Endret til egenskap
        public string? CurrentViewName; // Endret til egenskap

        public ItemsViewModel(IEnumerable<Item> items, string? currentViewName)
        {
            Items = items;
            CurrentViewName = currentViewName;
        }
    }
}
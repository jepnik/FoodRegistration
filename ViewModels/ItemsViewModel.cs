using FoodTracking.Models;
using System.Collections.Generic;

namespace FoodTracking.ViewModels
{
    public class ItemsViewModel
    {
        public IEnumerable<Item> Items { get; set; } // Endret til egenskap
        public string? CurrentViewName { get; set; } // Endret til egenskap

        public ItemsViewModel(IEnumerable<Item> items, string? currentViewName)
        {
            Items = items;
            CurrentViewName = currentViewName;
        }
    }
}
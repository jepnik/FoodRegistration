using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using FoodRegistration.Models;



//trenger vi disse:
/* using System.Collections.Generic;
using FoodRegistration.ViewModels; */

namespace FoodRegistration.Controllers
{
    public class HomeController : Controller
        {

                public IActionResult Index()
        {
            var items = GetItems();
            ViewBag.CurrentViewName = "";
            return View(items);
        }

  
     /*    public IActionResult Grid()
        {
            var items = GetItems();
            var itemsViewModel = new ItemsViewModel(items, "Grid"); // Create ViewModel for the Grid view
            return View(itemsViewModel); // Return the ViewModel
        } */

        public IActionResult Details(int id)
        {
            var items = GetItems(); // Fetch items
            var item = items.FirstOrDefault(i => i.ItemId == id); // Find the item by ID

            if (item == null)
                return NotFound(); // Return Not Found if the item does not exist

            return View(item); // Return the found item to the Details view
        }


        // Sørg for at GetItems-metoden er definert her, direkte under klassen
        public List<Item> GetItems()
        {
            var items = new List<Item>
            {
                new Item
                {
                    ItemId = 1,
                    Name = "Biff",
                    Category = "Meat",
                    Sertifikat = "Best price",
                    ImageUrl = "/images/biff.jpg"
                },
                new Item
                {
                    ItemId = 2,
                    Name = "Potet",
                    Category = "Vegetables",
                    Sertifikat = "Vegan",
                    ImageUrl = "/images/potet_.jpg"
                },
                new Item
                {
                    ItemId = 3,
                    Name = "Rosin bolle",
                    Category = "Bakst",
                    Sertifikat = ""
                }
            };

            return items; // Returnerer listen
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using FoodTracking.Models; 
using FoodTracking.ViewModels;


using System.Collections.Generic;

namespace FoodTracking.Controllers
{
    public class HomeController : Controller
    {

        private readonly ItemDbContext _itemDbContext; // Legger til ItemDbContext

        // Konstruktør for avhengighetsinjeksjon
        public HomeController(ItemDbContext itemDbContext)
        {
            _itemDbContext = itemDbContext;
        }

         public IActionResult Index()
        {
            // Hent alle varer fra databasen
            var items = _itemDbContext.Items.ToList();
            ViewBag.CurrentViewName = "";
            return View(items);
        }
     
     public IActionResult Details(int id)
        {
            // Hent alle varer fra databasen
            var items = _itemDbContext.Items.ToList();
            var item = items.FirstOrDefault(i => i.ItemId == id); // Finn varen med ID

            if (item == null)
                return NotFound(); // Returner Not Found hvis varen ikke finnes

            return View(item); // Returner den funne varen til Details-vyn
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

using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using FoodRegistration.Models;

namespace FoodRegistration.Controllers
{
    public class HomeController : Controller
    {
        // GET: /<controller>/
        public IActionResult Index()
        {
            var items = new List<Item>();
            var item1 = new Item
            {
                ItemId = 1,
                Name = "Biff",
                Category = "Meat",
                Sertifikat = "Best price"
            };

            var item2 = new Item
            {
                ItemId = 2,
                Name = "Potet",
                Category = "Vegetables",
                Sertifikat = "Vegan"
            };

            var item3 = new Item
            {
                ItemId = 3,
                Name = "Rosin bolle",
                Category = "Bakst",
                Sertifikat = ""
            };
//legger til alle itemene her
            items.Add(item1);
            items.Add(item2);
            items.Add(item3);

           
            return View(items);
        }
    }
}
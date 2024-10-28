using Microsoft.EntityFrameworkCore;
using FoodRegistration.Models;

namespace FoodRegistration.DAL;

public static class DBInit
{
    public static void Seed(IApplicationBuilder app)
    {
        using var serviceScope = app.ApplicationServices.CreateScope();
        ItemDbContext context = serviceScope.ServiceProvider.GetRequiredService<ItemDbContext>();
        //context.Database.EnsureDeleted();   // Sletter databasen for testing
        context.Database.EnsureCreated();   // Oppretter databasen på nytt

        if (!context.Items.Any())   // Sjekker om det allerede er data
        {
            var items = new List<Item>
            {
                new Item
                {
                    Name = "Apple",
                    Category = "Fruit",
                    Sertifikat = "Organic",
                    ImageUrl = "/images/apple.jpg",
                    
                    // Ernæringsfakta (nutritional information)
                    Energi = 52,
                    Carbohydrates = 14,
                    Sugar = 10,
                    Protein = 0.3,
                    Fat = 0.2,
                    Saturatedfat = 0,
                    Unsaturatedfat = 0.1,
                    Fiber = 2.4,
                    Salt = 0,
                    
                    // Produksjonsinformasjon via Productinfo
                    Productinfo = new Productinfo
                    {
                        CountryOfOrigin = "Norway",    // Opprinnelsesland
                        CountryOfProvenance = "Norway", // Opphavsland
                        ItemNumber = "A123",           // Varenummer
                        CreatedDate = DateTime.Now,
                        UpdatedDate = DateTime.Now
                    }
                },
                new Item
                {
                    Name = "Banana",
                    Category = "Fruit",
                    Sertifikat = "Fair Trade",
                    ImageUrl = "/images/banana.jpg",
                    
                    // Ernæringsfakta
                    Energi = 89,
                    Carbohydrates = 23,
                    Sugar = 12,
                    Protein = 1.1,
                    Fat = 0.3,
                    Saturatedfat = 0.1,
                    Unsaturatedfat = 0.2,
                    Fiber = 2.6,
                    Salt = 0,
                    
                    // Produksjonsinformasjon via Productinfo
                    Productinfo = new Productinfo
                    {
                        CountryOfOrigin = "Ecuador",
                        CountryOfProvenance = "Ecuador",
                        ItemNumber = "B456",
                        CreatedDate = DateTime.Now,
                        UpdatedDate = DateTime.Now
                    }
                }
            };

            context.Items.AddRange(items);   // Legg til data i Items-tabellen
            context.SaveChanges();
        }
    }
}
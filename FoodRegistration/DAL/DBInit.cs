using FoodRegistration.Models;
using System.Security.Cryptography;
using System.Text;

namespace FoodRegistration.DAL;

public static class DBInit
{
    public static void Seed(IApplicationBuilder app)
    {
        using var serviceScope = app.ApplicationServices.CreateScope();
        ItemDbContext context = serviceScope.ServiceProvider.GetRequiredService<ItemDbContext>();
        //Uncomment the follwoing line to delets the database
        //context.Database.EnsureDeleted();   
        //Ensures the databse is created if it dosen't alredy exist
        context.Database.EnsureCreated();

        // Decide whether to keep or remove the following code for seeding initial items in the database.
        // This part is optional and only necessary if you want specific items to appear when the app starts.
        /* if (!context.Items.Any())   // Sjekker om det allerede er data
        {
            var items = new List<Item>
            {
                new Item
                {
                    Name = "Apple",
                    Category = "Fruit",
                    Certificate = "Organic",
                    ImageUrl = "/images/apple.jpg",
                    
                    // Ernæringsfakta (nutritional information)
                    Energy = 52,
                    Carbohydrates = 14,
                    Sugar = 10,
                    Protein = 0.3,
                    Fat = 0.2,
                    Saturatedfat = 0,
                    Unsaturatedfat = 0.1,
                    Fibre = 2.4,
                    Salt = 0,

                    // Produktinfo                    
                    CountryOfOrigin = "Norway",    // Opprinnelsesland
                    CountryOfProvenance = "Norway", // Opphavsland
                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now
                    
                   
                },
                new Item
                {
                    Name = "Banana",
                    Category = "Fruit",
                    Certificate = "Fair Trade",
                    ImageUrl = "/images/banana.jpg",
                    
                    // Ernæringsfakta
                    Energy = 89,
                    Carbohydrates = 23,
                    Sugar = 12,
                    Protein = 1.1,
                    Fat = 0.3,
                    Saturatedfat = 0.1,
                    Unsaturatedfat = 0.2,
                    Fibre = 2.6,
                    Salt = 0,

                    // Produktinfo
                    CountryOfOrigin = "Ecuador",
                    CountryOfProvenance = "Ecuador",
                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now
                   
                }
            };

            // Add the items to the Items table
            context.AddRange(items);   
            context.SaveChanges();
        } */

        if (!context.Users.Any())
        {
            var users = new List<User>
            {
                new User { Email = "test@foodcompany", Password = HashPassword("password")},
                new User { Email = "test@anotherfoodcompany", Password = HashPassword("password")},

            };
            context.AddRange(users);
            context.SaveChanges();
        }
    }
    private static string HashPassword(string password) //Method for hashing password. Using SHA256 because it's quick and we're not using ASP.NET Core Identity
    {
        using (var sha256 = SHA256.Create())
        {
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
        }
    }
}
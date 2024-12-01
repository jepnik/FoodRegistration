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
        //Uncomment the following line to delete the database
        //context.Database.EnsureDeleted();   
        //Ensures the database is created if it doesn't already exist
        context.Database.EnsureCreated();

        //Check if data already exists
        if (!context.Items.Any())   
        {
            var items = new List<Item>
            {
                // Example data for item table
                new Item
                {
                    Name = "Apple",
                    Category = "Fruit",
                    Certificate = "Organic",
                    ImageUrl = "/images/apple.jpg",
                    
                    // Nutritional information/values
                    Energy = 52,
                    Carbohydrates = 14,
                    Sugar = 10,
                    Protein = 0.3,
                    Fat = 0.2,
                    Saturatedfat = 0.1,
                    Unsaturatedfat = 0.1,
                    Fibre = 2.4,
                    Salt = 0,

                    // Product Information                    
                    CountryOfOrigin = "Norway",    
                    CountryOfProvenance = "Norway", 
                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now
                },
                new Item
                {
                    Name = "Banana",
                    Category = "Fruit",
                    Certificate = "Fair Trade",
                    ImageUrl = "/images/banana.jpg",
                    
                    // Nutritional information/values
                    Energy = 89,
                    Carbohydrates = 23,
                    Sugar = 12,
                    Protein = 1.1,
                    Fat = 0.3,
                    Saturatedfat = 0.1,
                    Unsaturatedfat = 0.2,
                    Fibre = 2.6,
                    Salt = 0,

                    // Product Information
                    CountryOfOrigin = "Ecuador",
                    CountryOfProvenance = "Ecuador",
                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now
                },
                 new Item
                {
                    Name = "Beef",
                    Category = "Meat",
                    Certificate = "Best trade",
                    ImageUrl = "/images/beef.jpg",
                    
                    // Nutritional information/values
                    Energy = 129,
                    Carbohydrates = 23,
                    Sugar = 0,
                    Protein = 22,
                    Fat = 17,
                    Saturatedfat = 7,
                    Unsaturatedfat = 10,
                    Fibre = 0,
                    Salt = 0,

                    // Product Information
                    CountryOfOrigin = "Ecuador",
                    CountryOfProvenance = "Ecuador",
                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now
                }
            };
            

            // Add the items to the Items table
            context.AddRange(items);
            context.SaveChanges();
        }

        //Check if any user data exist; if not, add a default user for testing
        if (!context.Users.Any())
        {
            var users = new List<User>
            {
                new User { Email = "test@foodcompany.com", Password = HashPassword("password")},
                new User { Email = "test@anotherfoodcompany.com", Password = HashPassword("password")},

            };
            context.AddRange(users);
            context.SaveChanges();
        }
    }

    //Method for hashing password. Using SHA256 because it's quick and we're not using ASP.NET Core Identity
    private static string HashPassword(string password) 
    {
        using (var sha256 = SHA256.Create())
        {
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
        }
    }
}
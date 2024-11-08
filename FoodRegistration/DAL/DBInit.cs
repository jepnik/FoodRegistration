using FoodRegistration.Models;

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

        //Check if any user data exists; if not, add a default user for testing
        if (!context.Users.Any())
        {
            var users = new List<User>
            {
                new User { Email = "Email", Password = "Password"},
            };
            //Add the users to the Users table
            context.AddRange(users);
            context.SaveChanges();
        }
    }
}
using Microsoft.EntityFrameworkCore;
using FoodRegistration.Models;

namespace FoodRegistration.DAL;

public class ItemDbContext : DbContext
{
	public ItemDbContext(DbContextOptions<ItemDbContext> options) : base(options)
	{
        //Database.EnsureCreated();
	}

	public DbSet<Item> Items { get; set; }
	// public DbSet<Productinfo> productinfos { get; set;}

	 protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseLazyLoadingProxies();
    }
}
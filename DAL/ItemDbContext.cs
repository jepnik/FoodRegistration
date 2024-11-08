using Microsoft.EntityFrameworkCore;
using FoodRegistration.Models;

namespace FoodRegistration.DAL;

public class ItemDbContext : DbContext
{
	public ItemDbContext(DbContextOptions<ItemDbContext> options) : base(options)
	{
		//Database.EnsureCreated();
	}
	// Represents the Items table in the database
	public DbSet<Item> Items { get; set; }

	// Represents the Users table in the database
	public DbSet<User> Users { get; set; }

	// Configures lazy loading, which loads related entities only when accessed
	protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
	{
		optionsBuilder.UseLazyLoadingProxies();
	}
}
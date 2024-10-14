using System;
namespace FoodTracking.Models
{
	public class Item
	{
		public int ItemId { get; set; }
		public string Name { get; set; } = string.Empty;
		public string? Category { get; set; }
		public string? Sertifikat { get; set; }
		public string? ImageUrl { get; set; }
	}
}
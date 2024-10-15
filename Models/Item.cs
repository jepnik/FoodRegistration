using System;
using System.ComponentModel.DataAnnotations;
namespace FoodRegistration.Models
{
	public class Item
	{
		public int ItemId { get; set; }
		
		[RegularExpression(@"[0-9a-zA-ZæøåÆØÅ. \-]{2,20}", ErrorMessage = "The Name must be numbers or letters and between 2 to 20 characters.")]
        [Display(Name = "Item name")]

		public string Name { get; set; } = string.Empty;
	    
		[StringLength(50)]
		public string? Category { get; set; }
		public string? Sertifikat { get; set; }
		public string? ImageUrl { get; set; }
	}
}
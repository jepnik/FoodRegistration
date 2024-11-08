using System.ComponentModel.DataAnnotations;
using FoodRegistration.Models;

namespace MyShop.Models;

public class Profile
{
    public int CustomerId { get; set; }
    
    [Required(ErrorMessage = "Name is required.")]
    [RegularExpression(@"^[0-9a-zA-ZæøåÆØÅ. \-]{2,30}$", ErrorMessage = "The Name must be numbers or letters and between 2 to 30 characters.")]
    [Display(Name = "Item name")]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Email { get; set; }

    [Required]
    [DataType(DataType.Password)]
    public string Password { get; set; }

    [Required]
    [DataType(DataType.Password)]
    [Compare("Password", ErrorMessage = "Passwords do not match")]
    public string ConfirmPassword { get; set; }

    public virtual List<Item>? Item { get; set; }
}
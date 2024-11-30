using System.ComponentModel.DataAnnotations;

namespace FoodRegistration.Models;

public class User
{
    [Key]
    public int UserId { get; set; }

    [Required]
    [EmailAddress]
    public string? Email { get; set; }

    [Required]
    public string? Password { get; set; }
}

/* CODE FOR Profile.cs (Som skal slettes)
using System.ComponentModel.DataAnnotations;
using FoodRegistration.Models;

namespace FoodRegistration.Models;

public class Profile
{
    public int UserId { get; set; }

    [Required]
    public string? Email { get; set; }
}
*/
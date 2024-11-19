using System.ComponentModel.DataAnnotations;

namespace FoodRegistration.ViewModels
{
    public class RegisterUserViewModel
    {
        [Required, EmailAddress]
        public string? Email { get; set; }

        [Required, MinLength(6, ErrorMessage ="Password must be at least 6 characters")]
        public string? Password { get; set; }

        [Required, Compare("Password", ErrorMessage ="Passwords do not match.")]
        public string? ConfirmPassword { get; set; }
    }
}
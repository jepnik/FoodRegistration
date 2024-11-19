using System.ComponentModel.DataAnnotations;
namespace FoodRegistration.ViewModels;

public class ChangePasswordViewModel
{
    [Required]
    [DataType(DataType.Password)]
    public string? OldPassword { get; set; }

    [Required]
    [DataType(DataType.Password), MinLength(6, ErrorMessage ="Password must be at least 6 characters")]
    public string? NewPassword { get; set; }

    [Required]
    [DataType(DataType.Password)]
    [Compare("NewPassword", ErrorMessage ="Passwords do not match.")]
    public string? ConfirmNewPassword { get; set; }
}
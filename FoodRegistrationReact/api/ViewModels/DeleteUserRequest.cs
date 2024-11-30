using System.ComponentModel.DataAnnotations;

namespace FoodRegistration.ViewModels
{
    public class DeleteUserRequest
    {
        [Required(ErrorMessage = "Password is required to confirm deletion.")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Required(ErrorMessage = "Confirmation is required to delete the account.")]
        public bool ConfirmDeletion { get; set; }
    }
}

using Microsoft.AspNetCore.Mvc;
using FoodRegistration.Models;

public class AccountController : Controller
{
    [HttpGet]
    public IActionResult Profile()
    {
        // Retrieve the current user's info here (username and possibly hashed password)
        var model = new ProfileViewModel
        {
            Username = "currentUsername"
        };
        return View(model);
    }

    [HttpPost]
    public IActionResult UpdateProfile(ProfileViewModel model)
    {
        if (ModelState.IsValid)
        {
            // Logic to update the user's username and password in the authentication store
            // Save the updated data here
            return RedirectToAction("Profile");
        }
        return View("Profile", model);
    }
}
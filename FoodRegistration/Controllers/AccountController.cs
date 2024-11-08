using Microsoft.AspNetCore.Mvc;
using FoodRegistration.Models;

namespace FoodRegistration.Controllers;

public class AccountController : Controller
{
    //GET: Account/Login
    public ActionResult Login()
    {
        return View();
    }

    [HttpPost]
    public ActionResult Login(string email, string password)
    {
        //temporary inputs
        if (email == "email" && password == "password")
        {
            //Lage session
            HttpContext.Session.SetString("User", email);
            return RedirectToAction("Index", "Home"); //Sendes til forside
        }
        ViewBag.Error = "Ikke gyldig brukernavn eller passord";
        return View();
    }

    public ActionResult Logout()
    {
        //Logg ut og stop session
        HttpContext.Session.Clear();
        return RedirectToAction("Login");
    }

    [HttpGet]
    public IActionResult Profile()
    {
        // Retrieve the current user's info here (username and possibly hashed password)
        var model = new ProfileViewModel
        {
            Email = "currentEmail"
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
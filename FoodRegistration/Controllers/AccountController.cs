using Microsoft.AspNetCore.Mvc;
using FoodRegistration.Models;
using FoodRegistration.DAL;
using FoodRegistration.ViewModels;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace FoodRegistration.Controllers;

public class AccountController : Controller
{

    private readonly ItemDbContext _context;

        public AccountController(ItemDbContext context)
        {
            _context = context;
        }
    
    //Sets a variable to retrieve the users ID from the session, this is used in many methods
    private int? CurrentUserId => HttpContext.Session.GetInt32("UserID");

    private string HashPassword(string password) //Method for hashing password. Using SHA256 because it's quick and we're not using ASP.NET Core Identity
    {
        using (var sha256 = SHA256.Create())
        {
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
        }
    }

    [HttpGet]
    public IActionResult RegisterUser()
    {
        return View();
    }
    
    [HttpPost]
    public async Task<IActionResult> RegisterUser(RegisterUserViewModel model)
    {
        if (ModelState.IsValid)
        {
                // Check if the email already exists
            if (await _context.Users.AnyAsync(u => u.Email == model.Email))
            {
                ModelState.AddModelError("Email", "Email is already registered.");
                return View(model);
            }

            // Add the new user to the database
            var newUser = new User
            {
                /* added ?? string.Empty to remove warnings saying possible null reference assignment, 
                it is believed that these values never will be null, so it's assumed to be safe to remove the warnings */
                Email = model.Email ?? string.Empty,
                Password = HashPassword(model.Password!) //model.Password ?? string.Empty
            };
            _context.Users.Add(newUser);
            _context.SaveChanges();

            return RedirectToAction("Login");
        }
        return View(model);
    }

    [HttpGet]
    public IActionResult Login()
    {
        return View();
    }

    [HttpPost]
        public async Task<IActionResult> Login(LoginViewModel model)
    {
        if (ModelState.IsValid)
        {
            //Compares input with data in database
            var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == model.Email && u.Password == HashPassword(model.Password!)); //Hashes written password to compare to hashed password in database

            if (user != null)
            {
                //Assigns UserID and Email
                HttpContext.Session.SetInt32("UserID", user.UserId);
                HttpContext.Session.SetString("UserEmail", user.Email!);
                return RedirectToAction("Index", "Home");
            }
            else
            {
                //Error messages
                ModelState.AddModelError("Email", "Invalid email");
                ModelState.AddModelError("Password", "Invalid password");
            }
        }
        return View(model);
    }

    public ActionResult Logout()
    {
        //Log out and stop session
        HttpContext.Session.Clear();
        return RedirectToAction("Login");
    }

    [HttpGet]
    public async Task<IActionResult> Profile()
    {
        //Makes sure the UserId is correct with the database
        var userId = CurrentUserId;
        var user = await _context.Users.FindAsync(userId);
        var model = new User //Removed Profile.cs Model since it was identical to User.cs
        {
            UserId = user!.UserId, //Using '!' because user never will be null at this point and it was giving a warning. Middleware ensures you have to be logged in to reach this method
            Email = user.Email
        };
        return View(model);
    }

    [HttpGet]
    public IActionResult ChangePassword()
    {
        return View();
    }

    [HttpPost]
    public async Task<IActionResult> ChangePassword(ChangePasswordViewModel model)
    {
        if (ModelState.IsValid)
        {
            var userId = CurrentUserId;
            //Simple example of authorization
            if (userId.HasValue)
            {
                var user = await _context.Users.FindAsync(userId.Value);
                if (user != null && user.Password == HashPassword(model.OldPassword!))
                {
                    //Hash new password
                    user.Password = HashPassword(model.NewPassword!);
                    await _context.SaveChangesAsync();

                    return RedirectToAction("Profile");
                }
                else
                {
                    ModelState.AddModelError("OldPassword", "Incorrect password"); //Error message for incorrect old password
                }
            }
        }
        return View(model);
    }

    [HttpPost]
    public async Task<IActionResult> DeleteUser()
    {
        var userId = CurrentUserId;
        var user = await _context.Users.FindAsync(userId!.Value); //! to safely remove warning as userId will never be null at this point  

        if (user != null)
        {
            //Deletes user from database and logs you out
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            HttpContext.Session.Clear();
        }
        return RedirectToAction("Login"); //User will get sent here anyways because of middleware 
    }
}
using Microsoft.AspNetCore.Mvc;
using FoodRegistration.Models;
using FoodRegistration.DAL;
using FoodRegistration.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace FoodRegistration.Controllers;

public class AccountController : Controller
{

    private readonly ItemDbContext _context;

        public AccountController(ItemDbContext context)
        {
            _context = context;
        }
    
    /*Sets a variable to retrieve the users ID from the session, this is used in many methods*/
    private int? CurrentUserId => HttpContext.Session.GetInt32("UserID");

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
                Password = model.Password ?? string.Empty
            };
            _context.Users.Add(newUser);
            _context.SaveChanges();

            return RedirectToAction("Login");
        }
        return View(model);
    }

    //GET: Account/Login
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
            var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == model.Email && u.Password == model.Password);

            if (user != null)
            {
                HttpContext.Session.SetInt32("UserID", user.UserId);
                HttpContext.Session.SetString("UserEmail", user.Email!);
                return RedirectToAction("Index", "Home");
            }
            else
            {
                ModelState.AddModelError("Email", "Invalid email");
                ModelState.AddModelError("Password", "Invalid password");
            }
        }
        return View(model);
    }

    public ActionResult Logout()
    {
        //Logg ut og stop session
        HttpContext.Session.Clear();
        return RedirectToAction("Login");
    }

    [HttpGet]
    public async Task<IActionResult> Profile()
    {
        var userId = CurrentUserId;
        var user = await _context.Users.FindAsync(userId);
        var model = new User //Removed Profile.cs Model since it was identical to User.cs
        {
            UserId = user!.UserId,
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
            if (userId.HasValue)
            {
                var user = await _context.Users.FindAsync(userId.Value);
                if (user != null && user.Password == model.OldPassword)
                {
                    user.Password = model.NewPassword;
                    await _context.SaveChangesAsync();

                    return RedirectToAction("Profile");
                }
                else
                {
                    ModelState.AddModelError("", "Invalid old password");
                }
            }
        }
        return View(model);
    }

    [HttpPost]
    public async Task<IActionResult> DeleteUser()
    {
        var userId = CurrentUserId;
        var user = await _context.Users.FindAsync(userId!.Value);

        if (user != null)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            HttpContext.Session.Clear();
        }
        return RedirectToAction("Login"); //User will get sent here anyways because of middleware 
    }
}
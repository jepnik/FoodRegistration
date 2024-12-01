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

    //Method for hashing password, using SHA256 
    private string HashPassword(string password) 
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
        
                Email = model.Email ?? string.Empty,
                Password = HashPassword(model.Password!) 
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
            .FirstOrDefaultAsync(u => u.Email == model.Email && u.Password == HashPassword(model.Password!)); 

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
        var model = new User 
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
                    ModelState.AddModelError("OldPassword", "Incorrect password"); 
                }
            }
        }
        return View(model);
    }

    [HttpPost]
    public async Task<IActionResult> DeleteUser()
    {
        //! to safely remove warning as userId will never be null at this point  
        var userId = CurrentUserId;
        var user = await _context.Users.FindAsync(userId!.Value); 

        if (user != null)
        {
            //Deletes user from database and logs you out
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            HttpContext.Session.Clear();
        }
        return RedirectToAction("Login"); 
    }
}
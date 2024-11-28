using Microsoft.AspNetCore.Mvc;
using FoodRegistration.Models;
using FoodRegistration.DAL;
using FoodRegistration.ViewModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace FoodRegistration.Controllers
{
    [ApiController]
    [Route("api/account")]
    public class AccountApiController : ControllerBase
    {
        private readonly ItemDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AccountApiController> _logger;

        public AccountApiController(ItemDbContext context, IConfiguration configuration, ILogger<AccountApiController> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }

        private string HashPassword(string password)
        {
            if (string.IsNullOrEmpty(password))
            {
                throw new ArgumentNullException(nameof(password), "Password cannot be null or empty");
            }

            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
            }
        }

        private string GenerateJwtToken(int userId, string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                throw new ArgumentNullException(nameof(email), "Email cannot be null or empty");
            }

            var key = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(key))
            {
                throw new ArgumentNullException(nameof(key), "Jwt:Key is not configured correctly.");
            }

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var creds = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddHours(2);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, email),
                new Claim("UserID", userId.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: expires,
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpPost("register")]
public async Task<IActionResult> Register([FromBody] RegisterUserViewModel model)
{
    if (model == null || !ModelState.IsValid)
    {
        _logger.LogError("Invalid registration model.");
        return BadRequest(ModelState);
    }

    if (model.Password != model.ConfirmPassword)
    {
        return BadRequest(new { error = "Password and Confirm Password do not match." });
    }

    var existingUser = await _context.Users
        .FirstOrDefaultAsync(u => u.Email == model.Email);

    if (existingUser != null)
    {
        _logger.LogWarning("Email {Email} is already registered.", model.Email);
        return Conflict(new { error = "Email is already registered." });
    }

    var user = new User
    {
        Email = model.Email,
        Password = HashPassword(model.Password),
        // Add other necessary fields
    };

    await _context.Users.AddAsync(user);
    await _context.SaveChangesAsync();

    _logger.LogInformation("User {Email} registered successfully.", user.Email);

    return Ok(new { message = "Registration successful." });
}


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
            if (model == null || !ModelState.IsValid)
            {
                _logger.LogError("Invalid login model.");
                return BadRequest(ModelState);
            }

            _logger.LogInformation("Attempting login for email: {Email}", model.Email);

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == model.Email);

            if (user == null || user.Password != HashPassword(model.Password))
            {
                _logger.LogWarning("Invalid email or password for email: {Email}", model.Email);
                return Unauthorized(new { error = "Invalid email or password." });
            }

            _logger.LogInformation("Retrieved user: {UserId}, {Email}", user.UserId, user.Email);

            try
            {
                if (string.IsNullOrEmpty(user.Email))
                {
                    _logger.LogError("Email for user with ID {UserId} is null or empty.", user.UserId);
                    return StatusCode(500, "Internal server error.");
                }

                var token = GenerateJwtToken(user.UserId, user.Email);

                Response.Cookies.Append("jwt", token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict
                });

                return Ok(new { message = "Login successful.", token });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while generating JWT token.");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var token = Request.Cookies["jwt"];
            if (string.IsNullOrEmpty(token))
                return Unauthorized(new { error = "Unauthorized access." });

            var handler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);

            try
            {
                var claims = handler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = _configuration["Jwt:Issuer"],
                    ValidAudience = _configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                }, out _);

                var userId = int.Parse(claims.FindFirst("UserID")!.Value);
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                    return NotFound(new { error = "User not found." });

                return Ok(new { userId = user.UserId, email = user.Email });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Invalid token.");
                return Unauthorized(new { error = "Invalid token." });
            }
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt");
            return Ok(new { message = "Logged out successfully." });
        }
    }
}




// --------------------MVC controller----------------------------



public class AccountController : Controller
{

    private readonly ItemDbContext _context;

        public AccountController(ItemDbContext context)
        {
            _context = context;
        }
    
    /*Sets a variable to retrieve the users ID from the session, this is used in many methods*/
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
            .FirstOrDefaultAsync(u => u.Email == model.Email && u.Password == HashPassword(model.Password!)); //Hashes written password to compare to hashed password in database

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
        //Log out and stop session
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
            UserId = user!.UserId, //Using '!' because user never will be null at this point, since you have to be logged in to reach this method
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
                if (user != null && user.Password == HashPassword(model.OldPassword!))
                {
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
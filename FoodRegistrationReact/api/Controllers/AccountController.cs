using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Threading.Tasks;
using System;
using System.Linq;
using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using FoodRegistration.Models;
using FoodRegistration.DAL;
using FoodRegistration.ViewModels;

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

        
        // Hashes the provided password using SHA256.
              private string HashPassword(string password)
        {
            if (string.IsNullOrEmpty(password))
            {
                _logger.LogError("Attempted to hash a null or empty password.");
                throw new ArgumentNullException(nameof(password), "Password cannot be null or empty");
            }

            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                var hashedPassword = BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
                _logger.LogDebug("Password hashed successfully.");
                return hashedPassword;
            }
        }

        // Generates a token for the authenticated user.
        private string GenerateJwtToken(int userId, string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                _logger.LogError("Email is null or empty when generating JWT token.");
                throw new ArgumentNullException(nameof(email), "Email cannot be null or empty");
            }

            var key = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(key))
            {
                _logger.LogError("Jwt:Key is not configured correctly.");
                throw new ArgumentNullException(nameof(key), "Jwt:Key is not configured correctly.");
            }

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var creds = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddHours(2);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, email),
                new Claim("UserID", userId.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: creds);

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
            _logger.LogInformation("JWT token generated for user {UserId} ({Email}).", userId, email);
            return tokenString;
        }

        // Registers a new user.
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserViewModel model)
        {
            _logger.LogInformation("Registration attempt for email: {Email}", model?.Email);

            if (model == null || !ModelState.IsValid)
            {
                _logger.LogError("Invalid registration model. ModelState valid: {ModelStateValid}", ModelState.IsValid);
                return BadRequest(ModelState);
            }

            if (model.Password != model.ConfirmPassword)
            {
                _logger.LogWarning("Password and Confirm Password do not match for email: {Email}", model.Email);
                return BadRequest(new { error = "Password and Confirm Password do not match." });
            }

            try
            {
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
                    Password = HashPassword(model.Password)
                };

                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();

                _logger.LogInformation("User {Email} registered successfully with UserID {UserId}.", user.Email, user.UserId);

                return Ok(new { message = "Registration successful." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred during registration for email: {Email}.", model.Email);
                return StatusCode(500, new { error = "An error occurred during registration." });
            }
        }

        // Logs in a user and returns a JWT token upon successful authentication.
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
            _logger.LogInformation("Login attempt for email: {Email}", model?.Email);

            if (model == null || !ModelState.IsValid)
            {
                _logger.LogError("Invalid login model. ModelState valid: {ModelStateValid}", ModelState.IsValid);
                return BadRequest(ModelState);
            }

            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == model.Email);

                if (user == null)
                {
                    _logger.LogWarning("No user found with email: {Email}", model.Email);
                    return Unauthorized(new { error = "Invalid email or password." });
                }

                var hashedPassword = HashPassword(model.Password);

                if (user.Password != hashedPassword)
                {
                    _logger.LogWarning("Invalid password for user {Email}", model.Email);
                    return Unauthorized(new { error = "Invalid email or password." });
                }

                _logger.LogInformation("User {Email} authenticated successfully.", user.Email);

                var token = GenerateJwtToken(user.UserId, user.Email);

                return Ok(new { message = "Login successful.", token });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred during login for email: {Email}.", model.Email);
                return StatusCode(500, new { error = "An error occurred during login." });
            }
        }

        // Retrieves the profile of the authenticated user.
        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            _logger.LogInformation("Profile retrieval attempt.");

            try
            {
                // Get the UserID claim from the authenticated user
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserID");
                if (userIdClaim == null)
                {
                    _logger.LogWarning("UserID claim not found in token.");
                    return Unauthorized(new { error = "Unauthorized access." });
                }

                if (!int.TryParse(userIdClaim.Value, out int userId))
                {
                    _logger.LogWarning("Invalid UserID claim value: {UserID}", userIdClaim.Value);
                    return Unauthorized(new { error = "Unauthorized access." });
                }

                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    _logger.LogWarning("User not found for UserID: {UserID}", userId);
                    return NotFound(new { error = "User not found." });
                }

                _logger.LogInformation("Profile retrieved for user {Email} (UserID: {UserID}).", user.Email, user.UserId);

                return Ok(new { userId = user.UserId, email = user.Email });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving the user profile.");
                return StatusCode(500, new { error = "Internal server error." });
            }
        }

        // Changes the password of the authenticated user.
        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            _logger.LogInformation("Password change attempt.");

            // Validate request payload
            if (request == null || string.IsNullOrEmpty(request.OldPassword) || string.IsNullOrEmpty(request.NewPassword))
            {
                _logger.LogError("Invalid ChangePasswordRequest payload.");
                return BadRequest(new { error = "OldPassword and NewPassword are required." });
            }

            // Enforce password policies (e.g., minimum length)
            if (request.NewPassword.Length < 6)
            {
                _logger.LogWarning("New password does not meet minimum length requirements.");
                return BadRequest(new { error = "New password must be at least 6 characters long." });
            }

            try
            {
                // Retrieve user ID from JWT claims
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserID");
                if (userIdClaim == null)
                {
                    _logger.LogWarning("UserID claim not found.");
                    return Unauthorized(new { error = "Unauthorized access." });
                }

                if (!int.TryParse(userIdClaim.Value, out int userId))
                {
                    _logger.LogWarning("Invalid UserID claim value: {UserID}", userIdClaim.Value);
                    return Unauthorized(new { error = "Unauthorized access." });
                }

                // Fetch user from the database
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    _logger.LogWarning("User not found for UserID: {UserID}", userId);
                    return NotFound(new { error = "User not found." });
                }

                // Verify the old password
                var hashedOldPassword = HashPassword(request.OldPassword);
                if (user.Password != hashedOldPassword)
                {
                    _logger.LogWarning("Incorrect old password for UserID: {UserID}", userId);
                    return Unauthorized(new { error = "Current password is incorrect." });
                }

                // Hash the new password
                var hashedNewPassword = HashPassword(request.NewPassword);

                // Update the user's password
                user.Password = hashedNewPassword;
                _context.Users.Update(user);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Password changed successfully for UserID: {UserID}.", userId);

                return Ok(new { message = "Password changed successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while changing the password for UserID: {UserID}.", User.Claims.FirstOrDefault(c => c.Type == "UserID")?.Value);
                return StatusCode(500, new { error = "An error occurred while changing the password." });
            }
        }

  
        // Deletes the authenticated user's account.
        [Authorize]
        [HttpPost("delete-user")]
        public async Task<IActionResult> DeleteUser([FromBody] DeleteUserRequest request)
        {
            _logger.LogInformation("Account deletion attempt.");

            // Validate request payload
            if (request == null || !request.ConfirmDeletion)
            {
                _logger.LogError("Invalid DeleteUserRequest payload or deletion not confirmed.");
                return BadRequest(new { error = "Deletion must be confirmed." });
            }

            if (string.IsNullOrEmpty(request.Password))
            {
                _logger.LogError("Password is required for account deletion.");
                return BadRequest(new { error = "Password is required to confirm deletion." });
            }

            try
            {
                // Retrieve user ID 
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserID");
                if (userIdClaim == null)
                {
                    _logger.LogWarning("UserID claim not found.");
                    return Unauthorized(new { error = "Unauthorized access." });
                }

                if (!int.TryParse(userIdClaim.Value, out int userId))
                {
                    _logger.LogWarning("Invalid UserID claim value: {UserID}", userIdClaim.Value);
                    return Unauthorized(new { error = "Unauthorized access." });
                }

                // Fetch user from the database
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    _logger.LogWarning("User not found for UserID: {UserID}", userId);
                    return NotFound(new { error = "User not found." });
                }

                // Verify the password
                var hashedPassword = HashPassword(request.Password);
                if (user.Password != hashedPassword)
                {
                    _logger.LogWarning("Incorrect password for account deletion by UserID: {UserID}", userId);
                    return Unauthorized(new { error = "Password is incorrect." });
                }

                // Remove the user from the database
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                _logger.LogInformation("User {UserID} ({Email}) deleted their account successfully.", userId, user.Email);

                return Ok(new { message = "User account deleted successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting user {UserID}.", User.Claims.FirstOrDefault(c => c.Type == "UserID")?.Value);
                return StatusCode(500, new { error = "An error occurred while deleting the account." });
            }
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            _logger.LogInformation("Logout requested.");
            _logger.LogInformation("User logged out successfully.");
            return Ok(new { message = "Logged out successfully." });
        }
    }

// --------------------MVC controller----------------------------



public class AccountController : Controller
    {
        private readonly ItemDbContext _context;
        private readonly ILogger<AccountController> _logger;

        public AccountController(ItemDbContext context, ILogger<AccountController> logger)
        {
            _context = context;
            _logger = logger;
            _logger.LogInformation("AccountController instantiated.");
        }

      
        // Retrieves the current user's ID from the session.
        private int? CurrentUserId => HttpContext.Session.GetInt32("UserID");
    
        // <param name="password">The plain text password.</param>
        // <returns>Hashed password as a string.</returns>
        private string HashPassword(string password)
        {
            if (string.IsNullOrEmpty(password))
            {
                _logger.LogError("Attempted to hash a null or empty password.");
                throw new ArgumentNullException(nameof(password), "Password cannot be null or empty");
            }

            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                var hashedPassword = BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
                _logger.LogDebug("Password hashed successfully.");
                return hashedPassword;
            }
        }

        /// <summary>
        /// Displays the registration view.
        /// </summary>
        /// <returns>Registration view.</returns>
        [HttpGet]
        public IActionResult RegisterUser()
        {
            _logger.LogInformation("Navigated to RegisterUser GET action.");
            return View();
        }

        /// <summary>
        /// Handles user registration.
        /// </summary>
        /// <param name="model">Registration details.</param>
        /// <returns>Action result indicating success or failure.</returns>
        [HttpPost]
        public async Task<IActionResult> RegisterUser(RegisterUserViewModel model)
        {
            _logger.LogInformation("RegisterUser POST action invoked for email: {Email}", model?.Email);

            if (ModelState.IsValid)
            {
                try
                {
                    // Check if the email already exists
                    if (await _context.Users.AnyAsync(u => u.Email == model.Email))
                    {
                        _logger.LogWarning("Registration failed: Email {Email} is already registered.", model.Email);
                        ModelState.AddModelError("Email", "Email is already registered.");
                        return View(model);
                    }

                    // Add the new user to the database
                    var newUser = new User
                    {
                        Email = model.Email ?? string.Empty,
                        Password = HashPassword(model.Password!)
                        // Initialize other necessary fields here if any
                    };

                    await _context.Users.AddAsync(newUser);
                    await _context.SaveChangesAsync();

                    _logger.LogInformation("User registered successfully with Email: {Email}, UserID: {UserID}", newUser.Email, newUser.UserId);

                    return RedirectToAction("Login");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "An error occurred during user registration for Email: {Email}", model.Email);
                    ModelState.AddModelError(string.Empty, "An unexpected error occurred. Please try again later.");
                    return View(model);
                }
            }

            _logger.LogWarning("Registration failed due to invalid ModelState for Email: {Email}", model.Email);
            return View(model);
        }

        /// <summary>
        /// Displays the login view.
        /// </summary>
        /// <returns>Login view.</returns>
        [HttpGet]
        public IActionResult Login()
        {
            _logger.LogInformation("Navigated to Login GET action.");
            return View();
        }

        /// <summary>
        /// Handles user login.
        /// </summary>
        /// <param name="model">Login credentials.</param>
        /// <returns>Action result indicating success or failure.</returns>
        [HttpPost]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            _logger.LogInformation("Login POST action invoked for Email: {Email}", model?.Email);

            if (ModelState.IsValid)
            {
                try
                {
                    var hashedPassword = HashPassword(model.Password!);
                    var user = await _context.Users
                        .FirstOrDefaultAsync(u => u.Email == model.Email && u.Password == hashedPassword);

                    if (user != null)
                    {
                        HttpContext.Session.SetInt32("UserID", user.UserId);
                        HttpContext.Session.SetString("UserEmail", user.Email!);
                        _logger.LogInformation("User {Email} logged in successfully. UserID: {UserID}", user.Email, user.UserId);
                        return RedirectToAction("Index", "Home");
                    }
                    else
                    {
                        _logger.LogWarning("Login failed for Email: {Email}. Invalid email or password.", model.Email);
                        ModelState.AddModelError("Email", "Invalid email");
                        ModelState.AddModelError("Password", "Invalid password");
                        return View(model);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "An error occurred during login for Email: {Email}", model.Email);
                    ModelState.AddModelError(string.Empty, "An unexpected error occurred. Please try again later.");
                    return View(model);
                }
            }

            _logger.LogWarning("Login failed due to invalid ModelState for Email: {Email}", model.Email);
            return View(model);
        }

        /// <summary>
        /// Logs out the user by clearing the session.
        /// </summary>
        /// <returns>Redirect to Login view.</returns>
        public ActionResult Logout()
        {
            _logger.LogInformation("Logout action invoked. Clearing session.");
            HttpContext.Session.Clear();
            _logger.LogInformation("User logged out successfully. Redirecting to Login.");
            return RedirectToAction("Login");
        }

        /// <summary>
        /// Displays the user's profile.
        /// </summary>
        /// <returns>Profile view with user details.</returns>
        [HttpGet]
        public async Task<IActionResult> Profile()
        {
            var userId = CurrentUserId;
            _logger.LogInformation("Profile action invoked. CurrentUserId: {UserID}", userId);

            if (!userId.HasValue)
            {
                _logger.LogWarning("Profile access denied. UserID is null.");
                return RedirectToAction("Login");
            }

            try
            {
                var user = await _context.Users.FindAsync(userId.Value);

                if (user == null)
                {
                    _logger.LogWarning("Profile retrieval failed. User not found. UserID: {UserID}", userId.Value);
                    return NotFound("User not found.");
                }

                var model = new User
                {
                    UserId = user.UserId,
                    Email = user.Email
                };

                _logger.LogInformation("Profile retrieved successfully for UserID: {UserID}, Email: {Email}", user.UserId, user.Email);
                return View(model);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving the profile for UserID: {UserID}", userId.Value);
                return StatusCode(500, "An error occurred while retrieving the profile.");
            }
        }

        /// <summary>
        /// Displays the Change Password view.
        /// </summary>
        /// <returns>Change Password view.</returns>
        [HttpGet]
        public IActionResult ChangePassword()
        {
            _logger.LogInformation("Navigated to ChangePassword GET action.");
            return View();
        }

        /// <summary>
        /// Handles password change requests.
        /// </summary>
        /// <param name="model">Password change details.</param>
        /// <returns>Action result indicating success or failure.</returns>
        [HttpPost]
        public async Task<IActionResult> ChangePassword(ChangePasswordViewModel model)
        {
            _logger.LogInformation("ChangePassword POST action invoked for UserID: {UserID}", CurrentUserId);

            if (ModelState.IsValid)
            {
                var userId = CurrentUserId;
                if (userId.HasValue)
                {
                    try
                    {
                        var user = await _context.Users.FindAsync(userId.Value);

                        if (user != null && user.Password == HashPassword(model.OldPassword!))
                        {
                            user.Password = HashPassword(model.NewPassword!);
                            await _context.SaveChangesAsync();

                            _logger.LogInformation("Password changed successfully for UserID: {UserID}", userId.Value);
                            return RedirectToAction("Profile");
                        }
                        else
                        {
                            _logger.LogWarning("Password change failed for UserID: {UserID}. Incorrect old password.", userId.Value);
                            ModelState.AddModelError("OldPassword", "Incorrect password");
                            return View(model);
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "An error occurred while changing the password for UserID: {UserID}", userId.Value);
                        ModelState.AddModelError(string.Empty, "An unexpected error occurred. Please try again later.");
                        return View(model);
                    }
                }

                _logger.LogWarning("Password change attempted without a valid UserID.");
                return RedirectToAction("Login");
            }

            _logger.LogWarning("Password change failed due to invalid ModelState for UserID: {UserID}", CurrentUserId);
            return View(model);
        }

        /// <summary>
        /// Deletes the authenticated user's account.
        /// </summary>
        /// <returns>Redirect to Login view upon successful deletion.</returns>
        [HttpPost]
        public async Task<IActionResult> DeleteUser()
        {
            var userId = CurrentUserId;
            _logger.LogInformation("DeleteUser POST action invoked for UserID: {UserID}", userId);

            if (!userId.HasValue)
            {
                _logger.LogWarning("DeleteUser attempted without a valid UserID.");
                return RedirectToAction("Login");
            }

            try
            {
                var user = await _context.Users.FindAsync(userId.Value);

                if (user != null)
                {
                    _context.Users.Remove(user);
                    await _context.SaveChangesAsync();
                    HttpContext.Session.Clear();

                    _logger.LogInformation("User account deleted successfully. UserID: {UserID}, Email: {Email}", user.UserId, user.Email);
                    return RedirectToAction("Login");
                }
                else
                {
                    _logger.LogWarning("DeleteUser failed. User not found. UserID: {UserID}", userId.Value);
                    return NotFound("User not found.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting the user account for UserID: {UserID}", userId.Value);
                return StatusCode(500, "An error occurred while deleting the account.");
            }
        }
    }
}
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
}
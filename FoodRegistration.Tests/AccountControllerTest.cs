using FoodRegistration.Controllers;
using FoodRegistration.DAL;
using FoodRegistration.Models;
using FoodRegistration.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace FoodRegistration.Tests
{
    public class AccountControllerTests
    {
        private readonly AccountController _controller;
        private readonly ItemDbContext _context;

        public AccountControllerTests()
        {
            // Set up the in-memory database
            var options = new DbContextOptionsBuilder<ItemDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _context = new ItemDbContext(options);

            // Seed the database
            SeedDatabase();

            // Set up the controller with an in-memory database and session
            _controller = new AccountController(_context)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext()
                }
            };

            // Add session support
            _controller.ControllerContext.HttpContext.Session = new MockHttpSession();
        }

        private void SeedDatabase()
        {
            // Clear the database to prevent duplicate entries
            _context.Users.RemoveRange(_context.Users);
            _context.Items.RemoveRange(_context.Items);
            _context.SaveChanges();

            _context.Users.AddRange(new List<User>
            {
                new User { UserId = 1, Email = "test1@foodcompany.com", Password = HashPassword("password1") },
                new User { UserId = 2, Email = "test2@foodcompany.com", Password = HashPassword("password2") }
            });

            _context.Items.AddRange(new List<Item>
            {
                new Item
                {
                    ItemId = 1,
                    Name = "Apple",
                    Category = "Fruit",
                    Certificate = "Organic",
                    ImageUrl = "/images/apple.jpg",
                    Energy = 52,
                    Carbohydrates = 14,
                    Sugar = 10,
                    Protein = 0.3,
                    Fat = 0.2,
                    Saturatedfat = 0.1,
                    Unsaturatedfat = 0.1,
                    Fibre = 2.4,
                    Salt = 0,
                    CountryOfOrigin = "USA",
                    CountryOfProvenance = "USA",
                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now
                },
                new Item
                {
                    ItemId = 2,
                    Name = "Banana",
                    Category = "Fruit",
                    Certificate = "Fair Trade",
                    ImageUrl = "/images/banana.jpg",
                    Energy = 89,
                    Carbohydrates = 23,
                    Sugar = 12,
                    Protein = 1.1,
                    Fat = 0.3,
                    Saturatedfat = 0.1,
                    Unsaturatedfat = 0.2,
                    Fibre = 2.6,
                    Salt = 0,
                    CountryOfOrigin = "Ecuador",
                    CountryOfProvenance = "Ecuador",
                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now
                }
            });

            _context.SaveChanges();
        }

        private string HashPassword(string password)
        {
            using var sha256 = System.Security.Cryptography.SHA256.Create();
            var hashedBytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
        }
        
        // Tests successful login with valid credentials
        [Fact]
        public async Task Login_Post_ReturnsRedirectToActionResult_WhenCredentialsAreValid()
        {
            // Arrange
            var model = new LoginViewModel
            {
                Email = "test1@foodcompany.com",
                Password = "password1"
            };

            // Act
            var result = await _controller.Login(model);

            // Assert
            var redirectToActionResult = Assert.IsType<RedirectToActionResult>(result);
            Assert.NotNull(redirectToActionResult);
            Assert.Equal("Index", redirectToActionResult.ActionName);
            Assert.Equal("Home", redirectToActionResult.ControllerName);
        }

        // Tests login failure with invalid credentials
        [Fact]
        public async Task Login_Post_ReturnsViewResult_WhenCredentialsAreInvalid()
        {
            // Arrange
            var model = new LoginViewModel
            {
                Email = "invalid@domain.com",
                Password = "wrongpassword"
            };

            // Act
            var result = await _controller.Login(model);

            // Assert
            var viewResult = Assert.IsType<ViewResult>(result);
            Assert.NotNull(viewResult);

            // Check that ModelState contains the expected errors
            Assert.True(_controller.ModelState.ContainsKey("Email"));
            Assert.True(_controller.ModelState.ContainsKey("Password"));
            Assert.Equal("Invalid email", _controller.ModelState["Email"].Errors.First().ErrorMessage);
            Assert.Equal("Invalid password", _controller.ModelState["Password"].Errors.First().ErrorMessage);
        }
        
        // Tests that logout clears the session and redirects to login
        [Fact]
        public void Logout_ClearsSession_RedirectsToLogin()
        {
            // Act
            var result = _controller.Logout();

            // Assert
            var redirectToActionResult = Assert.IsType<RedirectToActionResult>(result);
            Assert.Equal("Login", redirectToActionResult.ActionName);
            Assert.Null(_controller.ControllerContext.HttpContext.Session.GetInt32("UserID"));
        }

        // Tests accessing profile with an authenticated user
        [Fact]
        public async Task Profile_AuthenticatedUser_ReturnsUserProfile()
        {
            // Arrange
            _controller.ControllerContext.HttpContext.Session.SetInt32("UserID", 1);

            // Act
            var result = await _controller.Profile();

            // Assert
            var viewResult = Assert.IsType<ViewResult>(result);
            var user = Assert.IsType<User>(viewResult.ViewData.Model);
            Assert.Equal("test1@foodcompany.com", user.Email);
        }

        // Tests changing password with valid input
        [Fact]
        public async Task ChangePassword_ValidInput_UpdatesPassword()
        {
            // Arrange
            _controller.ControllerContext.HttpContext.Session.SetInt32("UserID", 1);
            var model = new ChangePasswordViewModel
            {
                OldPassword = "password1",
                NewPassword = "newpassword",
                ConfirmNewPassword = "newpassword"
            };

            // Act
            var result = await _controller.ChangePassword(model);

            // Assert
            Assert.IsType<RedirectToActionResult>(result);
            var updatedUser = await _context.Users.FindAsync(1);
            Assert.Equal(HashPassword("newpassword"), updatedUser.Password);
        }

        // Tests deleting a user with a valid request
        [Fact]
        public async Task DeleteUser_ValidRequest_DeletesUser()
        {
            // Arrange
            _controller.ControllerContext.HttpContext.Session.SetInt32("UserID", 1);

            // Act
            var result = await _controller.DeleteUser();

            // Assert
            var redirectToActionResult = Assert.IsType<RedirectToActionResult>(result);
            Assert.Equal("Login", redirectToActionResult.ActionName);
            var deletedUser = await _context.Users.FindAsync(1);
            Assert.Null(deletedUser);
        }
    }

    // Mock implementation of ISession for testing purposes
    public class MockHttpSession : ISession
    {
        private readonly Dictionary<string, byte[]> _sessionStorage = new Dictionary<string, byte[]>();

        public IEnumerable<string> Keys => _sessionStorage.Keys;

        public string Id => Guid.NewGuid().ToString();

        public bool IsAvailable => true;

        public void Clear() => _sessionStorage.Clear();

        public Task CommitAsync(CancellationToken cancellationToken = default) => Task.CompletedTask;

        public Task LoadAsync(CancellationToken cancellationToken = default) => Task.CompletedTask;

        public void Remove(string key) => _sessionStorage.Remove(key);

        public void Set(string key, byte[] value) => _sessionStorage[key] = value;

        public bool TryGetValue(string key, out byte[] value)
        {
            if (_sessionStorage.TryGetValue(key, out var val))
            {
                value = val;
                return true;
            }

            value = Array.Empty<byte>();
            return false;
        }
    }
}

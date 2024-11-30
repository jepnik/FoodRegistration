using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using FoodRegistration.Controllers;
using FoodRegistration.Models;
using FoodRegistration.ViewModels;
using FoodRegistration.DAL;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace FoodRegistration.Tests
{
    public class AccountControllerTests
    {
        private readonly Mock<ItemDbContext> _mockContext;
        private readonly AccountController _controller;
        private readonly Mock<DbSet<User>> _mockUserSet;

        public AccountControllerTests()
        {
            _mockContext = new Mock<ItemDbContext>();
            _mockUserSet = new Mock<DbSet<User>>();

            _mockContext.Setup(m => m.Users).Returns(_mockUserSet.Object);

            _controller = new AccountController(_mockContext.Object)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext()
                }
            };
            _controller.ControllerContext.HttpContext.Session = new MockHttpSession();
        }

        [Fact]
        public void Login_Get_ReturnsViewResult()
        {
            // Act
            var result = _controller.Login();

            // Assert
            Assert.IsType<ViewResult>(result);
        }

        [Fact]
        public async Task Login_Post_ReturnsRedirectToActionResult_WhenCredentialsAreValid()
        {
            // Arrange
            var user = new User { UserId = 1, Email = "email", Password = "hashedpassword" };
            _mockUserSet.Setup(m => m.FirstOrDefaultAsync(It.IsAny<System.Linq.Expressions.Expression<System.Func<User, bool>>>(), default))
                        .ReturnsAsync(user);

            var model = new LoginViewModel
            {
                Email = "email",
                Password = "password"
            };

            // Act
            var result = await _controller.Login(model);

            // Assert
            var redirectToActionResult = Assert.IsType<RedirectToActionResult>(result);
            Assert.Equal("Index", redirectToActionResult.ActionName);
            Assert.Equal("Home", redirectToActionResult.ControllerName);
        }

        [Fact]
        public async Task Login_Post_ReturnsViewResult_WhenCredentialsAreInvalid()
        {
            // Arrange
            _mockUserSet.Setup(m => m.FirstOrDefaultAsync(It.IsAny<System.Linq.Expressions.Expression<System.Func<User, bool>>>(), default))
                        .ReturnsAsync((User)null);

            var model = new LoginViewModel
            {
                Email = "invalidEmail",
                Password = "invalidPassword"
            };

            // Act
            var result = await _controller.Login(model);

            // Assert
            var viewResult = Assert.IsType<ViewResult>(result);
            Assert.True(_controller.ModelState.ContainsKey("Email"));
        }

        [Fact]
        public void Logout_ReturnsRedirectToActionResult()
        {
            // Act
            var result = _controller.Logout();

            // Assert
            var redirectToActionResult = Assert.IsType<RedirectToActionResult>(result);
            Assert.Equal("Login", redirectToActionResult.ActionName);
        }

        [Fact]
        public async Task Profile_Get_ReturnsViewResult_WithUser()
        {
            // Arrange
            var user = new User { UserId = 1, Email = "currentEmail" };
            _mockUserSet.Setup(m => m.FindAsync(1)).ReturnsAsync(user);
            _controller.ControllerContext.HttpContext.Session.SetInt32("UserID", 1);

            // Act
            var result = await _controller.Profile();

            // Assert
            var viewResult = Assert.IsType<ViewResult>(result);
            var model = Assert.IsAssignableFrom<User>(viewResult.ViewData.Model);
            Assert.Equal("currentEmail", model.Email);
        }

        [Fact]
        public async Task ChangePassword_Post_ReturnsRedirectToActionResult_WhenSuccessful()
        {
            // Arrange
            var user = new User { UserId = 1, Password = "hashedOldPassword" };
            _mockUserSet.Setup(m => m.FindAsync(1)).ReturnsAsync(user);
            _controller.ControllerContext.HttpContext.Session.SetInt32("UserID", 1);

            var model = new ChangePasswordViewModel
            {
                OldPassword = "oldPassword",
                NewPassword = "newPassword",
                ConfirmNewPassword = "newPassword"
            };

            // Act
            var result = await _controller.ChangePassword(model);

            // Assert
            var redirectToActionResult = Assert.IsType<RedirectToActionResult>(result);
            Assert.Equal("Profile", redirectToActionResult.ActionName);
        }

        [Fact]
        public async Task ChangePassword_Post_ReturnsViewResult_WhenOldPasswordIsIncorrect()
        {
            // Arrange
            var user = new User { UserId = 1, Password = "hashedDifferentPassword" };
            _mockUserSet.Setup(m => m.FindAsync(1)).ReturnsAsync(user);
            _controller.ControllerContext.HttpContext.Session.SetInt32("UserID", 1);

            var model = new ChangePasswordViewModel
            {
                OldPassword = "wrongOldPassword",
                NewPassword = "newPassword",
                ConfirmNewPassword = "newPassword"
            };

            // Act
            var result = await _controller.ChangePassword(model);

            // Assert
            var viewResult = Assert.IsType<ViewResult>(result);
            Assert.True(_controller.ModelState.ContainsKey("OldPassword"));
        }

        [Fact]
        public async Task DeleteUser_Post_RedirectsToLogin_AfterSuccessfulDeletion()
        {
            // Arrange
            var user = new User { UserId = 1 };
            _mockUserSet.Setup(m => m.FindAsync(1)).ReturnsAsync(user);
            _controller.ControllerContext.HttpContext.Session.SetInt32("UserID", 1);

            // Act
            var result = await _controller.DeleteUser();

            // Assert
            var redirectToActionResult = Assert.IsType<RedirectToActionResult>(result);
            Assert.Equal("Login", redirectToActionResult.ActionName);
        }
    }

    // Mock session implementation
    public class MockHttpSession : ISession
    {
        private readonly Dictionary<string, byte[]> _sessionStorage = new Dictionary<string, byte[]>();

        public IEnumerable<string> Keys => _sessionStorage.Keys;
        public string Id => System.Guid.NewGuid().ToString();
        public bool IsAvailable => true;
        public void Clear() => _sessionStorage.Clear();
        public Task CommitAsync(System.Threading.CancellationToken cancellationToken = default) => Task.CompletedTask;
        public Task LoadAsync(System.Threading.CancellationToken cancellationToken = default) => Task.CompletedTask;
        public void Remove(string key) => _sessionStorage.Remove(key);
        public void Set(string key, byte[] value) => _sessionStorage[key] = value;

        public bool TryGetValue(string key, out byte[] value)
        {
            if (_sessionStorage.TryGetValue(key, out var val))
            {
                value = val;
                return true;
            }
            value = System.Array.Empty<byte>();
            return false;
        }
    }
}


using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using FoodRegistration.Controllers;
using FoodRegistration.Models;
using FoodRegistration.ViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FoodRegistration.Tests
{
    public class AccountControllerTests
    {
        private readonly AccountController _controller;

        public AccountControllerTests()
        {
            _controller = new AccountController
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
        public void Login_Post_ReturnsRedirectToActionResult_WhenCredentialsAreValid()
        {
            // Arrange
            var email = "email";
            var password = "password";

            // Act
            var result = _controller.Login(email, password);

            // Assert
            var redirectToActionResult = Assert.IsType<RedirectToActionResult>(result);
            Assert.Equal("Index", redirectToActionResult.ActionName);
            Assert.Equal("Home", redirectToActionResult.ControllerName);
        }

        [Fact]
        public void Login_Post_ReturnsViewResult_WhenCredentialsAreInvalid()
        {
            // Arrange
            var email = "invalidEmail";
            var password = "invalidPassword";

            // Act
            var result = _controller.Login(email, password);

            // Assert
            var viewResult = Assert.IsType<ViewResult>(result);
            Assert.Equal("Ikke gyldig brukernavn eller passord", _controller.ViewBag.Error);
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
        public void Profile_Get_ReturnsViewResult_WithProfileViewModel()
        {
            // Act
            var result = _controller.Profile();

            // Assert
            var viewResult = Assert.IsType<ViewResult>(result);
            var model = Assert.IsAssignableFrom<ProfileViewModel>(viewResult.ViewData.Model);
            Assert.Equal("currentEmail", model.Email);
        }

        [Fact]
        public void UpdateProfile_Post_ReturnsRedirectToActionResult_WhenModelStateIsValid()
        {
            // Arrange
            var model = new ProfileViewModel
            {
                Email = "newEmail",
                Password = "newPassword",
                ConfirmPassword = "newPassword"
            };
            _controller.ModelState.Clear(); // Simulate a valid ModelState

            // Act
            var result = _controller.UpdateProfile(model);

            // Assert
            var redirectToActionResult = Assert.IsType<RedirectToActionResult>(result);
            Assert.Equal("Profile", redirectToActionResult.ActionName);
        }

        [Fact]
        public void UpdateProfile_Post_ReturnsViewResult_WhenModelStateIsInvalid()
        {
            // Arrange
            var model = new ProfileViewModel
            {
                Email = "newEmail",
                Password = "newPassword",
                ConfirmPassword = "differentPassword"
            };
            _controller.ModelState.AddModelError("ConfirmPassword", "Passwords do not match");

            // Act
            var result = _controller.UpdateProfile(model);

            // Assert
            var viewResult = Assert.IsType<ViewResult>(result);
            var returnedModel = Assert.IsAssignableFrom<ProfileViewModel>(viewResult.ViewData.Model);
            Assert.Equal(model, returnedModel);
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

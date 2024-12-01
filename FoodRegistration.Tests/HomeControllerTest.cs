using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using FoodRegistration.Controllers;
using FoodRegistration.Models;
using FoodRegistration.DAL;
using FoodRegistration.ViewModels;
using Microsoft.Extensions.Logging;

namespace FoodRegistration.Tests
{
    public class HomeControllerTests
    {
        private readonly Mock<IItemRepository> _mockRepo;
        private readonly Mock<ILogger<HomeController>> _mockLogger;
        private readonly HomeController _controller;

        public HomeControllerTests()
        {
            _mockRepo = new Mock<IItemRepository>();
            _mockLogger = new Mock<ILogger<HomeController>>();
            _controller = new HomeController(_mockRepo.Object, _mockLogger.Object);
        }
        // Tests showing list of items
        [Fact]
        public async Task Index_ReturnsViewResult_WithListOfItems()
        {
            // Arrange
            var items = new List<Item> { new Item { ItemId = 1, Name = "Test Item" } };
            _mockRepo.Setup(repo => repo.GetAll()).ReturnsAsync(items);

            // Act
            var result = await _controller.Index();

            // Assert
            var viewResult = Assert.IsType<ViewResult>(result);
            var model = Assert.IsAssignableFrom<ItemsViewModel>(viewResult.ViewData.Model);
            Assert.Single(model.Items);
        }
        // Tests showing details of an Item
        [Fact]
        public async Task Details_ReturnsViewResult_WithItem()
        {
            // Arrange
            var item = new Item { ItemId = 1, Name = "Test Item" };
            _mockRepo.Setup(repo => repo.GetItemById(1)).ReturnsAsync(item);

            // Act
            var result = await _controller.Details(1);

            // Assert
            var viewResult = Assert.IsType<ViewResult>(result);
            var model = Assert.IsAssignableFrom<Item>(viewResult.ViewData.Model);
            Assert.Equal(item.ItemId, model.ItemId);
        }
        // Tests create item
        [Fact]
        public void Create_ReturnsViewResult()
        {
            // Act
            var result = _controller.Create();

            // Assert
            Assert.IsType<ViewResult>(result);
        }
        // Tests the Create method to ensure it redirects to the Index action when the model state is valid
        [Fact]
        public async Task Create_Post_ReturnsRedirectToActionResult_WhenModelStateIsValid()
        {
            // Arrange
            var item = new Item
            {
                ItemId = 1,
                Name = "Test Item",
                Category = "Test Category",
                CountryOfOrigin = "Test Country",
                Certificate = "Test Certificate",
                Energy = 1.0,
                Carbohydrates = 1.0,
                Sugar = 1.0,
                Protein = 1.0,
                Fat = 2.0,
                Saturatedfat = 1.0,
                Unsaturatedfat = 1.0,
                Fibre = 1.0,
                Salt = 1.0,
                ImageUrl = "",
                CreatedDate = DateTime.Now,
                UpdatedDate = DateTime.Now
            };
            _mockRepo.Setup(repo => repo.Create(item)).ReturnsAsync(true);
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };

            // Simulate a valid ModelState
            _controller.ModelState.Clear();

            // Act
            var result = await _controller.Create(item);

            // Assert
            var redirectToActionResult = Assert.IsType<RedirectToActionResult>(result);
            Assert.Equal("Index", redirectToActionResult.ActionName);
        }
        // Tests update item with Viewresult
        [Fact]
        public async Task Update_Get_ReturnsViewResult_WithItem()
        {
            // Arrange
            var item = new Item { ItemId = 1, Name = "Test Item" };
            _mockRepo.Setup(repo => repo.GetItemById(1)).ReturnsAsync(item);

            // Act
            var result = await _controller.Update(1);

            // Assert
            var viewResult = Assert.IsType<ViewResult>(result);
            var model = Assert.IsAssignableFrom<Item>(viewResult.ViewData.Model);
            Assert.Equal(item.ItemId, model.ItemId);
        }
        // Tests the Update method to ensure it redirects to the Index action when the model state is valid
        [Fact]
        public async Task Update_Post_ReturnsRedirectToActionResult_WhenModelStateIsValid()
        {
            // Arrange
            var item = new Item { ItemId = 1, Name = "Test Item" };
            _mockRepo.Setup(repo => repo.GetItemById(item.ItemId)).ReturnsAsync(item);
            _mockRepo.Setup(repo => repo.Update(item)).ReturnsAsync(true);

            // Simulate a valid ModelState
            _controller.ModelState.Clear();

            // Act
            var result = await _controller.Update(item);

            // Assert
            var redirectToActionResult = Assert.IsType<RedirectToActionResult>(result);
            Assert.Equal("Index", redirectToActionResult.ActionName);
        }
        // Test Delete item
        [Fact]
        public async Task Delete_Get_ReturnsViewResult_WithItem()
        {
            // Arrange
            var item = new Item { ItemId = 1, Name = "Test Item" };
            _mockRepo.Setup(repo => repo.GetItemById(1)).ReturnsAsync(item);

            // Act
            var result = await _controller.Delete(1);

            // Assert
            var viewResult = Assert.IsType<ViewResult>(result);
            var model = Assert.IsAssignableFrom<Item>(viewResult.ViewData.Model);
            Assert.Equal(item.ItemId, model.ItemId);
        }
      // Test confirmation of deleting item with redirect to actionresult
        [Fact]
        public async Task DeleteConfirmed_ReturnsRedirectToActionResult()
        {
            // Arrange
            _mockRepo.Setup(repo => repo.Delete(1)).ReturnsAsync(true);

            // Act
            var result = await _controller.DeleteConfirmed(1);

            // Assert
            var redirectToActionResult = Assert.IsType<RedirectToActionResult>(result);
            Assert.Equal("Index", redirectToActionResult.ActionName);
        }

        #region Updated Negative Test Cases


        // Test Create POST action with invalid ModelState.
        [Fact]
        public async Task Create_Post_ReturnsViewResult_WithInvalidModelState()
        {
            // Arrange
            var item = new Item(); // Missing required fields
            _controller.ModelState.AddModelError("Name", "The Name field is required.");
            _controller.ModelState.AddModelError("Category", "The Category field is required.");

            // Act
            var result = await _controller.Create(item);

            // Assert
            var viewResult = Assert.IsType<ViewResult>(result);
            var returnedItem = Assert.IsType<Item>(viewResult.ViewData.Model);
            Assert.Equal(item, returnedItem);
            Assert.False(_controller.ModelState.IsValid);
            Assert.Equal(2, _controller.ModelState.ErrorCount);
        }


        // Test Details action when item does not exist.

        [Fact]
        public async Task Details_ReturnsNotFound_WhenItemDoesNotExist()
        {
            // Arrange
            int nonExistentId = 999;
            _mockRepo.Setup(repo => repo.GetItemById(nonExistentId)).ReturnsAsync((Item)null);

            // Act
            var result = await _controller.Details(nonExistentId);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal($"Item not found for the ItemId", notFoundResult.Value);
        }


        // Test Update POST action when item does not exist.
        [Fact]
        public async Task Update_Post_ReturnsNotFound_WhenItemDoesNotExist()
        {
            // Arrange
            var item = new Item { ItemId = 1, Name = "Non-Existent Item" };
            _mockRepo.Setup(repo => repo.GetItemById(item.ItemId)).ReturnsAsync((Item)null);

            _controller.ModelState.Clear();

            // Act
            var result = await _controller.Update(item);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal($"Item not found.", notFoundResult.Value);
        }


        // Test DeleteConfirmed action when deletion fails.

        [Fact]
        public async Task DeleteConfirmed_ReturnsBadRequest_WhenDeletionFails()
        {
            // Arrange
            int itemIdToDelete = 1;
            _mockRepo.Setup(repo => repo.Delete(itemIdToDelete)).ReturnsAsync(false);

            // Act
            var result = await _controller.DeleteConfirmed(itemIdToDelete);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Item deletion failed", badRequestResult.Value);
        }
        #endregion
    }

}

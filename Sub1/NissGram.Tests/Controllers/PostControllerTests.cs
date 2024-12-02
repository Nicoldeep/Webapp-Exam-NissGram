using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using NissGram.Controllers;
using NissGram.DAL.Repositories;
using NissGram.Models;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.AspNetCore.Http;
using NissGram.ViewModels;
using System.Security.Principal;
using System.Security.Claims;
using NissGram.DAL.Interfaces;

namespace NissGram.Tests.Controllers;

public class PostControllerTests
{
    static Mock<IPostRepository> _mockPostRepository = new Mock<IPostRepository>();
    static Mock<IUserRepository> _mockUserRepository = new Mock<IUserRepository>();
    static Mock<ILogger<PostController>> _mockLogger = new Mock<ILogger<PostController>>();
    PostController _postController = new PostController(
        _mockPostRepository.Object,
        _mockUserRepository.Object,
        _mockLogger.Object
    );
 
    [Fact]
    public async Task TestDetailsValid()
    {
        // ARRANGE
        int testId = 1;
        var testPost = new Post
        {
            PostId = testId,
            Text = "Test post",
            ImgUrl = null,
            DateCreated = DateTime.Now,
            DateUpdated = DateTime.Now
        };

        _mockPostRepository
            .Setup(repo => repo.GetPostByIdAsync(testId))
            .ReturnsAsync(testPost); // Simulate that the post exists

        // ACT
        var result = await _postController.Details(testId);

        // ASSERT
        var viewResult = Assert.IsType<ViewResult>(result); // Ensure ViewResult is returned
        var model = Assert.IsAssignableFrom<Post>(viewResult.Model); // Ensure model is of type Post
        Assert.Equal(testPost.PostId, model.PostId); // Verify correct post is returned
    }

    [Fact]
    public async Task TestDetailsInvalid()
    {
        // ARRANGE
        int invalidId = 999;

        _mockPostRepository
            .Setup(repo => repo.GetPostByIdAsync(invalidId))
            .ReturnsAsync((Post)null); // Simulate that the post does not exist

        // ACT
        var result = await _postController.Details(invalidId);

        // ASSERT
        Assert.IsType<NotFoundResult>(result); // Ensure NotFoundResult is returned
    }



    // POSITIVE TEST : CREATE
    [Fact]
    public async Task TestCreateValid()
    {
        // ARRANGE
        var testUser = new User
        {
            UserName = "JaneDoe",
            Email = "jane.doe@example.com"
        };

        // Mock IFormFile
        var mockImageFile = new Mock<IFormFile>();
        mockImageFile.Setup(f => f.Length).Returns(1024);
        mockImageFile.Setup(f => f.FileName).Returns("test.jpg");
        mockImageFile.Setup(f => f.OpenReadStream()).Returns(new MemoryStream());

        var testPost = new Post
        {
            PostId = 1,
            User = testUser,
            Text = "Valid Post Text",
            ImgUrl =  "/images/test.jpg",
            DateCreated = DateTime.Now,
            DateUpdated = DateTime.Now
        };

        var mockClaimsPrincipal = new Mock<ClaimsPrincipal>();
        mockClaimsPrincipal.Setup(user => user.Identity!.IsAuthenticated).Returns(true);
        mockClaimsPrincipal.Setup(user => user.Identity!.Name).Returns(testUser.UserName); // Sørg for at dette samsvarer

        _postController.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = mockClaimsPrincipal.Object
            }
        };

        // Simulate user retrieval in repository
        _mockUserRepository
            .Setup(repo => repo.GetUserByUsernameAsync(testUser.UserName)) // Sørg for at samme navn brukes her
            .ReturnsAsync(testUser); // Returner den mockede brukeren

        _mockPostRepository
            .Setup(repo => repo.CreatePostAsync(It.IsAny<Post>()))
            .ReturnsAsync(true);

        _postController.ModelState.Clear(); // Mock a valid modelstate

        // ACT
        var result = await _postController.Create(testPost, mockImageFile.Object);
        // ASSERT
        var viewResult = Assert.IsType<ViewResult>(result); // Ensure ViewResult is returned
        var model = Assert.IsAssignableFrom<Post>(viewResult.Model); // Ensure model is of type Post
        Assert.Equal(testPost.PostId, model.PostId); // Verify correct post is returned
    }

    [Fact]
    public async Task TestCreateInvalid()
    {
        _postController.ModelState.Clear();

        // ARRANGE
        var testUser = new User
        {
            UserName = "JaneDoe",
            Email = "jane.doe@example.com"
        };

        var testPostWithoutTextAndImage = new Post
        {
            User = testUser, // Valid user
            Text = "", // Missing text
            ImgUrl = null,
            DateCreated = DateTime.Now,
            DateUpdated = DateTime.Now
        };

        var testPostWithoutUser = new Post
        {
            User = null, // Missing user
            Text = "Valid text.", // Valid text
            ImgUrl = null,
            DateCreated = DateTime.Now,
            DateUpdated = DateTime.Now
        };

        var mockClaimsPrincipal = new Mock<ClaimsPrincipal>();
        mockClaimsPrincipal.Setup(user => user.Identity!.IsAuthenticated).Returns(true);
        mockClaimsPrincipal.Setup(user => user.Identity!.Name).Returns(testUser.UserName); // Sørg for at dette samsvarer

        _postController.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = mockClaimsPrincipal.Object
            }
        };

        // Simulate user retrieval in repository
        _mockUserRepository
            .Setup(repo => repo.GetUserByUsernameAsync(testUser.UserName)) // Sørg for at samme navn brukes her
            .ReturnsAsync(testUser); // Returner den mockede brukeren

        // ACT: Test for post without text and image
        _postController.ModelState.Clear(); // Clear ModelState to simulate fresh validation state
        _postController.ModelState.AddModelError("Text", "Either Text or ImgUrl is required."); // Add validation error
        var resultWithoutTextAndImage = await _postController.Create(testPostWithoutTextAndImage, null);

        // ASSERT: Test for post without text and image
        var viewResultWithoutTextAndImage = Assert.IsType<ViewResult>(resultWithoutTextAndImage); // Result should be a ViewResult
        Assert.False(_postController.ModelState.IsValid, "Expected ModelState to be invalid for missing text and image."); // Ensure ModelState is invalid
        _mockPostRepository.Verify(repo => repo.CreatePostAsync(It.IsAny<Post>()), Times.Never); // Ensure CreatePostAsync is not called

        // ACT: Test for post without user
        _postController.ModelState.Clear(); // Clear ModelState for fresh validation
        _postController.ModelState.AddModelError("User", "User is required."); // Add validation error
        _postController.ControllerContext.HttpContext.User = new ClaimsPrincipal(); // Simulate unauthenticated user
        var resultWithoutUser = await _postController.Create(testPostWithoutUser, null);

        // ASSERT: Test for post without user
        var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(resultWithoutUser); // Oppdater forventningen
        Assert.Equal("User is not authenticated.", unauthorizedResult.Value); // Valider melding
        _mockPostRepository.Verify(repo => repo.CreatePostAsync(It.IsAny<Post>()), Times.Never); // Ensure CreatePostAsync is not called
    }


    // POSITIVE TEST : UPDATE
    [Fact]
    public async Task TestUpdateValid()
    {
        // ARRANGE
        var testUser = new User
        {
            UserName = "JaneDoe",
            Email = "jane.doe@example.com"
        };

        var existingPost = new Post
        {
            PostId = 1, // Assume ID for the post to update
            User = testUser,
            Text = "Old text for the post.",
            ImgUrl = "/images/old_image.png",
            DateCreated = DateTime.Now.AddDays(-1),
            DateUpdated = DateTime.Now.AddDays(-1)
        };

        var updatedModel = new PostUpdateViewModel
        {
            PostId = 1,
            Text = "Updated text for the post.",
            NewImage = null // No new image uploaded
        };

        // Mock repository behavior for retrieving the post
        _mockPostRepository
            .Setup(repo => repo.GetPostByIdAsync(updatedModel.PostId))
            .ReturnsAsync(existingPost);

        _mockPostRepository
            .Setup(repo => repo.UpdatePostAsync(It.IsAny<Post>()))
            .ReturnsAsync(true); // Simulate successful update

        _postController.ModelState.Clear(); // Clear ModelState to simulate valid model

        // ACT
        var result = await _postController.Update(updatedModel);

        // ASSERT
        Assert.True(_postController.ModelState.IsValid, "Expected ModelState to be valid.");

        var redirectResult = Assert.IsType<RedirectToActionResult>(result); // Check for RedirectToActionResult
        Assert.Equal("Index", redirectResult.ActionName); // Check redirection to Index

        // Verify that UpdatePostAsync was called with the correct Post data
        _mockPostRepository.Verify(repo => repo.UpdatePostAsync(It.Is<Post>(p =>
            p.PostId == existingPost.PostId &&
            p.Text == updatedModel.Text &&
            p.User.UserName == "JaneDoe"
        )), Times.Once);
    }


    [Fact]
    public async Task TestUpdateInvalid()
    {
        // ARRANGE
        var testUser = new User
        {
            UserName = "JaneDoe",
            Email = "jane.doe@example.com"
        };

        // Create a model that simulates a non-existent post (e.g., invalid PostId)
        var testUpdateViewModel = new PostUpdateViewModel
        {
            PostId = 999, // Assume this ID does not exist
            Text = "Valid text.",
            NewImage = null // No new image
        };

        // Simulate that the repository cannot find the post with PostId = 999
        _mockPostRepository
            .Setup(repo => repo.GetPostByIdAsync(testUpdateViewModel.PostId))
            .ReturnsAsync((Post)null); // Return null to indicate post does not exist

        _postController.ModelState.Clear(); // Clear ModelState to simulate valid input

        // ACT
        var result = await _postController.Update(testUpdateViewModel);

        // ASSERT
        Assert.IsType<NotFoundResult>(result); // Ensure that the result is a NotFoundResult
        _mockPostRepository.Verify(repo => repo.UpdatePostAsync(It.IsAny<Post>()), Times.Never); // Verify that UpdatePostAsync was never called
    }


   [Fact]
    public async Task TestDeleteValid()
    {
        // ARRANGE
        int testId = 1; // ID of the post to be deleted

        // Simulate successful deletion
        _mockPostRepository
            .Setup(repo => repo.DeletePostAsync(testId))
            .ReturnsAsync(true); // Simulate success

        // ACT
        var result = await _postController.Delete(testId);

        // ASSERT
        var redirectResult = Assert.IsType<RedirectToActionResult>(result); // Ensure redirection
        Assert.Equal("Index", redirectResult.ActionName); // Confirm redirection to Index
        Assert.Equal("Home", redirectResult.ControllerName); // Confirm controller name
        _mockPostRepository.Verify(repo => repo.DeletePostAsync(testId), Times.Once); // Verify method call
    }


    [Fact]
    public async Task TestDeleteInvalid()
    {
        // ARRANGE
        int testId = 999; // ID of the post that cannot be deleted

        // Simulate failed deletion
        _mockPostRepository
            .Setup(repo => repo.DeletePostAsync(testId))
            .ReturnsAsync(false); // Simulate failure

        // ACT
        var result = await _postController.Delete(testId);

        // ASSERT
        var redirectResult = Assert.IsType<RedirectToActionResult>(result); // Ensure redirection
        Assert.Equal("Details", redirectResult.ActionName); // Confirm redirection to Details
        Assert.Equal(testId, redirectResult.RouteValues["id"]); // Ensure correct post ID is passed
        Assert.True(_postController.ModelState.ContainsKey(""), "Expected error message in ModelState.");
        _mockPostRepository.Verify(repo => repo.DeletePostAsync(testId), Times.Once); // Verify method call
    }



}

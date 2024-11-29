using Microsoft.AspNetCore.Mvc;
using NissGram.Models;
using NissGram.ViewModels;
using NissGram.DAL.Repositories;
using NissGram.DAL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication;
using NissGram.DAL.Interfaces;

namespace NissGram.Controllers;

public class UserController : Controller
{
    private readonly IUserRepository _userRepository;
    private readonly ILogger<UserController> _logger;

    public UserController(IUserRepository userRepository, ILogger<UserController> logger)
    {
        _userRepository = userRepository;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> Profile(string? statusMessage = null)
    {
        // Check if User.Identity or User.Identity.Name is null
        if (User.Identity == null || string.IsNullOrEmpty(User.Identity.Name))
            return Unauthorized("User is not authenticated.");


        var currentUser = await _userRepository.GetUserByUsernameAsync(User.Identity.Name);

        if (currentUser == null)
        {
            _logger.LogError("[UserController] Failed to find user with GetUserByUsernameAsync for username: {username}", User.Identity.Name);
            return NotFound("User not found.");
        }

        /*if (string.IsNullOrEmpty(currentUser.ProfilePicture))
       {
           currentUser.ProfilePicture = "/images/profile_image_default.png"; // Ensure default picture
       }*/

        var userProfileViewModel = new UserProfileViewModel(currentUser)
        {
            StatusMessage = statusMessage // Pass the status message to the view model
        };

        return View(userProfileViewModel);
    }

    [HttpGet]
    public async Task<IActionResult> UserUpdateCreate()
    {
        // Check if User.Identity or User.Identity.Name is null
        if (User.Identity == null || string.IsNullOrEmpty(User.Identity.Name))
        {
            return Unauthorized("User is not authenticated.");
        }

        var currentUser = await _userRepository.GetUserByUsernameAsync(User.Identity.Name);

        if (currentUser == null)
        {
            return NotFound("User not found.");
        }

        var model = new UserUpdateCreateViewModel
        {
            ProfilePicture = currentUser.ProfilePicture,  //?? "/images/profile_images_default.png",
            About = currentUser.About,
            Username = currentUser.UserName ?? "",  // Ensure the UserName is not null
            FirstName = currentUser.FirstName,
            LastName = currentUser.LastName,
            Email = currentUser.Email ?? "", // Ensure Email is not null
            PhoneNumber = currentUser.PhoneNumber,
        };

        return View("UserUpdateCreate", model);
    }

    [HttpPost]
    public async Task<IActionResult> UserUpdateCreate(UserUpdateCreateViewModel model)
    {
        if (!ModelState.IsValid)
        {
            return View(model); // Redisplay the form with validation errors
        }

        var currentUserName = User.Identity?.Name;

        if (string.IsNullOrWhiteSpace(currentUserName))
        {
            _logger.LogWarning("[UserController] Unauthorized access attempt to UserUpdateCreate.");
            return Unauthorized("User is not authenticated.");
        }

        try
        {
            var currentUser = await _userRepository.GetUserByUsernameAsync(currentUserName);

            if (currentUser == null)
            {
                _logger.LogWarning("[UserController] User not found for username: {Username}", currentUserName);
                return NotFound("User not found.");
            }

            // Handle profile picture upload if present
            if (Request.Form.Files.Count > 0)
            {
                var file = Request.Form.Files[0];
                if (file.Length > 0)
                {
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                    var uploadsFolder = Path.Combine("wwwroot", "uploads", "profile-pictures");
                    Directory.CreateDirectory(uploadsFolder);
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    currentUser.ProfilePicture = $"/uploads/profile-pictures/{fileName}";
                }
            }

            // Update user properties
            currentUser.About = model.About;
            currentUser.FirstName = model.FirstName;
            currentUser.LastName = model.LastName;
            currentUser.PhoneNumber = model.PhoneNumber;

            // Save updates
            var updateSuccess = await _userRepository.UpdateUserAsync(currentUser);

            if (!updateSuccess)
            {
                _logger.LogError("[UserController] Failed to update user with username: {Username}", currentUserName);
                return StatusCode(500, "An error occurred while updating the user.");
            }

            return RedirectToAction(nameof(Profile));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[UserController] An error occurred in UserUpdateCreate for username: {Username}", currentUserName);
            return StatusCode(500, "An unexpected error occurred.");
        }
    }

    //Delete User 
    [HttpPost]
    public async Task<IActionResult> DeleteUser()
    {
        try
        {
            // Get the username of the current user
            var username = User.Identity?.Name;

            // Ensure user is authenticated before attempting to delete
            if (string.IsNullOrEmpty(username))
            {
                _logger.LogWarning("[UserController] Unauthorized deletion attempt.");
                return Unauthorized("User is not authenticated.");
            }

            // Fetch the user from the database
            var user = await _userRepository.GetUserByUsernameAsync(username);

            if (user == null)
            {
                _logger.LogWarning("[UserController] User not found for deletion. Username: {Username}", username);
                return NotFound("Your account could not be found.");
            }

            // Delete the profile picture if it exists and is not the default picture
            if (!string.IsNullOrEmpty(user.ProfilePicture) &&
                user.ProfilePicture != "/images/profile_image_default.png")
            {
                try
                {
                    var filePath = Path.Combine("wwwroot", user.ProfilePicture.TrimStart('/'));
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "[UserController] Failed to delete profile picture for user: {Username}", username);
                    return StatusCode(500, "An error occurred while deleting your profile picture.");
                }
            }


            // Delete the user from the database
            var deleteSuccess = await _userRepository.DeleteUserByUsernameAsync(username);
            if (!deleteSuccess)
            {
                _logger.LogError("[UserController] Failed to delete user from database. Username: {Username}", username);
                return StatusCode(500, "An error occurred while deleting your account.");
            }

            // Sign the user out after deletion
            await HttpContext.SignOutAsync(IdentityConstants.ApplicationScheme);

            // Redirect to the login page or homepage
            return RedirectToAction("Index", "Home");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[UserController] An unexpected error occurred while deleting user.");
            return StatusCode(500, "An unexpected error occurred. Please try again later.");
        }
    }

    [HttpGet]
    public async Task<IActionResult> DeleteProfilePicture()
    {
        try
        {
            // Ensure user is authenticated before proceeding
            if (User.Identity == null || string.IsNullOrEmpty(User.Identity.Name))
            {
                _logger.LogWarning("[UserController] Unauthorized attempt to delete profile picture.");
                return Unauthorized("You must be logged in to delete your profile picture.");
            }

            var currentUser = await _userRepository.GetUserByUsernameAsync(User.Identity.Name);

            if (currentUser == null)
            {
                _logger.LogWarning("[UserController] User not found while attempting to delete profile picture. Username: {Username}", User.Identity.Name);
                return NotFound("User not found.");
            }

            if (!string.IsNullOrEmpty(currentUser.ProfilePicture) &&
                currentUser.ProfilePicture != "/images/profile_image_default.png")
            {
                try
                {
                    var filePath = Path.Combine("wwwroot", currentUser.ProfilePicture.TrimStart('/'));
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "[UserController] Failed to delete profile picture file for user: {Username}", User.Identity.Name);
                    return StatusCode(500, "An error occurred while deleting the profile picture. Please try again later.");
                }
            }

            // Reset to default profile picture
            currentUser.ProfilePicture = "/images/profile_image_default.png";
            var updateSuccess = await _userRepository.UpdateUserAsync(currentUser);

            if (!updateSuccess)
            {
                _logger.LogError("[UserController] Failed to update profile picture to default for user: {Username}", User.Identity.Name);
                return StatusCode(500, "An error occurred while updating your profile picture. Please try again later.");
            }

            return RedirectToAction(nameof(UserUpdateCreate));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[UserController] An unexpected error occurred while deleting profile picture for user: {Username}", User.Identity?.Name ?? "Unknown");
            return StatusCode(500, "An unexpected error occurred. Please contact support if the issue persists.");
        }
    }


    [HttpGet]
    public async Task<IActionResult> ViewUserProfile(string username)
    {

        if (string.IsNullOrWhiteSpace(username))
        {
            _logger.LogWarning("[UserController] Attempted to view profile with an empty or null username.");
            return BadRequest("Username cannot be empty.");
        }

        try
        {
            var user = await _userRepository.GetUserByUsernameAsync(username);

            if (user == null)
            {
                _logger.LogWarning("[UserController] User not found while attempting to view profile. Username: {Username}", username);
                return NotFound("User not found.");
            }

            var userProfileViewModel = new UserProfileViewModel(user);
            return View(userProfileViewModel);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[UserController] An unexpected error occurred while attempting to view user profile. Username: {Username}", username);
            return StatusCode(500, "An unexpected error occurred. Please contact support if the issue persists.");
        }
    }

   


}

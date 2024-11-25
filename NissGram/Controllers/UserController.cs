using Microsoft.AspNetCore.Mvc;
using NissGram.Models;
using NissGram.ViewModels;
using NissGram.DAL;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc.RazorPages;

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

    // GET: /Users
    public async Task<IActionResult> GetAllUsers()
    {
        // Fetch all users from the database
        var users = await _userRepository.GetAllUsersAsync();

        // Create an instance of UsersViewModel with the list of users
        var viewModel = new UsersViewModel(users, "All users");


        // Pass the ViewModel to the view
        return View(viewModel);
    }


    [HttpGet]
    public async Task<IActionResult> Profile()
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(currentUserId))
        {
            return Unauthorized("User not authenticated.");
        }

        var name = User.Identity.Name;

        var currentUser = await _userRepository.GetUserByIdAsync(currentUserId);
        if (currentUser == null)
        {
            return NotFound("User not found.");
        }

        var userProfileViewModel = new UserProfileViewModel(currentUser);

        return View(userProfileViewModel);
    }

    [HttpGet]
    public async Task<IActionResult> UserUpdateCreate()
    {
        // Fetch the currently logged-in user
        var currentUser = await _context.Users
            .FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);

        if (currentUser == null)
        {
            return NotFound("User not found.");
        }

        // Map the user's data to the view model
        var model = new UserUpdateCreateViewModel
        {
            ProfilePicture = currentUser.ProfilePicture ?? "/images/default-profile.png",
            About = currentUser.About,
            Username = currentUser.UserName,
            FirstName = currentUser.FirstName,
            LastName = currentUser.LastName,
            Email = currentUser.Email,
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

        // Fetch the currently logged-in user
        var currentUser = await _context.Users
            .FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);

        if (currentUser == null)
        {
            return NotFound("User not found.");
        }

        // Check if the new username is already taken by another user
        if (_context.Users.Any(u => u.UserName == model.Username && u.Id != currentUser.Id))
        {
            ModelState.AddModelError("Username", "This username is already taken.");
            return View(model); // Redisplay the form with an error
        }


        // Handle profile picture logic
        if (Request.Form["deleteProfilePicture"] == "true")
        {
            // Reset profile picture to default and set DB field to null
            currentUser.ProfilePicture = null;
        }
        else if (Request.Form.Files.Count > 0)
        {
            var file = Request.Form.Files[0];
            if (file.Length > 0)
            {
                //Save the new profile picture
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

        // Update other user data
        currentUser.About = model.About;
        currentUser.UserName = model.Username;
        currentUser.FirstName = model.FirstName;
        currentUser.LastName = model.LastName;
        currentUser.Email = model.Email;
        currentUser.PhoneNumber = model.PhoneNumber;


        // Save changes to the database
        _context.Users.Update(currentUser);
        await _context.SaveChangesAsync();

        // Deletes the deleted picture
        /*if (!string.IsNullOrEmpty(currentUser.ProfilePicture) && currentUser.ProfilePicture != "/images/profile_image_default.png")
        {
            var oldFilePath = Path.Combine("wwwroot", currentUser.ProfilePicture.TrimStart('/'));
            if (System.IO.File.Exists(oldFilePath))
            {
                System.IO.File.Delete(oldFilePath);
            }
        }*/

        // Redirect back to the profile page
        return RedirectToAction(nameof(Profile));

    }

    [HttpGet]
    public async Task<IActionResult> DeleteProfilePicture()
    {
        // Fetch the currently logged-in user
        var currentUser = await _context.Users
            .FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);

        if (currentUser == null)
        {
            return NotFound("User not found.");
        }

        // Check if the user has a custom profile picture
        if (!string.IsNullOrEmpty(currentUser.ProfilePicture) && currentUser.ProfilePicture != "/images/profile_image_default.png")
        {
            var filePath = Path.Combine("wwwroot", currentUser.ProfilePicture.TrimStart('/'));
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath); // Delete the file from the filesystem
            }

            // Remove the profile picture from the database
            currentUser.ProfilePicture = "/images/profile_image_default.png";
            _context.Users.Update(currentUser);
            await _context.SaveChangesAsync();
        }

        // Redirect to the UserUpdateCreate page after deletion
        return RedirectToAction(nameof(UserUpdateCreate));
    }



    [HttpGet]
    public async Task<IActionResult> ViewUserProfile(string username)
    {
        // Fetch the user by username
        var user = await _context.Users
            .Include(u => u.Posts)
            .FirstOrDefaultAsync(u => u.UserName == username);


        if (user == null)
        {
            return NotFound("User not found.");
        }

        // Separate posts into pictures and notes
        var pictures = user.Posts?.Where(p => p.ImgUrl != null).ToList() ?? new List<Post>();
        var notes = user.Posts?.Where(p => p.ImgUrl == null).ToList() ?? new List<Post>();

        // Prepare the view model
        var userProfileViewModel = new UserProfileViewModel
        {
            User = user,
            PictureCount = pictures.Count,
            NoteCount = notes.Count,
            Pictures = pictures,
            Notes = notes
        };

        return View(userProfileViewModel);
    }


}
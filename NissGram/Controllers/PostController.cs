using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NissGram.DAL;
using NissGram.Models;
using NissGram.ViewModels;
using System.Security.Claims;


namespace NissGram.Controllers;
public class PostController : Controller
{
    private readonly IPostRepository _postRepository;
    private readonly IUserRepository _userRepository;
    private readonly ILogger<PostController> _logger;

    public PostController(IPostRepository postRepository, IUserRepository userRepository, ILogger<PostController> logger)
    {
        _userRepository = userRepository;
        _postRepository = postRepository;
        _logger = logger;
    }

    // GET: Vis detaljer for et enkelt innlegg, inkludert kommentarer og antall likes
    public async Task<IActionResult> Details(int id)
    {
        var post = await _postRepository.GetPostByIdAsync(id);
        if (post == null)
        {
            return NotFound();
        }
        return View(post);
    }

    // GET: Create Post Form
    [HttpGet]
    public IActionResult Create()
    {
        return View();
    }

    // POST: Create a new Post
    [HttpPost]
    public async Task<IActionResult> Create(Post post, IFormFile? uploadImage)
    {
        // Retrieve the current user's ID from claims
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            ModelState.AddModelError("", "User not authenticated.");
            return View(post);
        }

        // Fetch the current user from the database
        var user = await _userRepository.GetUserByIdAsync(userId);
        if (user == null)
        {
            ModelState.AddModelError("", "User not found.");
            return View(post);
        }

        // Handle image upload if provided
        if (uploadImage != null && uploadImage.Length > 0)
        {
            var fileName = Guid.NewGuid() + Path.GetExtension(uploadImage.FileName);
            var filePath = Path.Combine("wwwroot/images", fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await uploadImage.CopyToAsync(stream);
            }

            post.ImgUrl = "/images/" + fileName;
        }

        // Associate the post with the current user
        post.User = user;
        post.DateCreated = DateTime.Now;
        post.DateUpdated = DateTime.Now;

        if (ModelState.IsValid)
        {
            bool success = await _postRepository.CreatePostAsync(post);
            if (success)
            {
                return RedirectToAction(nameof(Index));
            }
            ModelState.AddModelError("", "Failed to create the post.");
        }

        return View(post);
    }

    // GET: Show the update form
    [HttpGet]
    public async Task<IActionResult> Update(int id)
    {
        var post = await _postRepository.GetPostByIdAsync(id);
        if (post == null)
        {
            return NotFound();
        }
        return View(post); // Viser oppdateringsskjemaet med eksisterende data
    }

    // POST: Update the post
    [HttpPost]
    public async Task<IActionResult> Update(Post post)
    {
        if (ModelState.IsValid)
        {
            var ok = await _postRepository.UpdatePostAsync(post);
            if (ok)
            {
                return RedirectToAction(nameof(Index));
            }
        }
        return View(post); // Viser skjemaet på nytt hvis validering mislyktes
    }


    // DELETE
    [HttpPost]
    public async Task<IActionResult> Delete(int id)
    {
        await _postRepository.DeletePostAsync(id);
        return RedirectToAction(nameof(Index));
    }
}


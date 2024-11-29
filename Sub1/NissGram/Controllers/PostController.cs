using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NissGram.DAL.Repositories;
using NissGram.DAL;
using NissGram.Models;
using NissGram.ViewModels;
using System.Security.Claims;
using NissGram.DAL.Interfaces;



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
            _logger.LogError("[PostController] Getting post failed for postid: {@post}", post);
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
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(Post post, IFormFile? uploadImage)
    {
        // Remove the User property from ModelState to ignore its validation
        ModelState.Remove(nameof(Post.User));

        // Check if User.Identity or User.Identity.Name is null
        if (User.Identity == null || string.IsNullOrEmpty(User.Identity.Name))
        {
            return Unauthorized("User is not authenticated.");
        }

        // Get the current user
        var user = await _userRepository.GetUserByUsernameAsync(User.Identity.Name);
        if (user == null)
        {
            ModelState.AddModelError("", "User not found.");
            return View(post);
        }

        // Validate that at least one of Text or Image is provided
        if (string.IsNullOrWhiteSpace(post.Text) && (uploadImage == null || uploadImage.Length == 0))
        {
            ModelState.AddModelError("", "You must provide either text or an image.");
            return View(post);
        }

        // Handle image upload if provided
        if (uploadImage != null && uploadImage.Length > 0)
        {
            try
            {
                var fileName = Guid.NewGuid() + Path.GetExtension(uploadImage.FileName);
                var filePath = Path.Combine("wwwroot/images", fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await uploadImage.CopyToAsync(stream);
                }

                post.ImgUrl = "/images/" + fileName;
            }
            catch (Exception ex)
            {
                _logger.LogError("[PostController] Error occurred while uploading image. Exception: {ex}", ex.Message);
                ModelState.AddModelError("", "An error occurred while uploading the image.");
                return View(post);
            }
        }

        // Assign the current user and timestamps to the post
        post.User = user; post.DateCreated = DateTime.Now; post.DateUpdated = DateTime.Now;

        // Proceed if the ModelState is valid
        if (ModelState.IsValid)
        {
            try
            {
                bool success = await _postRepository.CreatePostAsync(post);
                if (success)
                {
                    return RedirectToAction("Index", "Home");
                }

                // Log failure from the repository
                _logger.LogError("[PostController] Failed to create a new post. Post data: {@Post}", post);
                ModelState.AddModelError("", "An unexpected error occurred while trying to create the post.");
            }
            catch (Exception ex)
            {
                // Log the exception
                _logger.LogError("[PostController] An error occurred while creating a post. Post data: {@Post}, Exception: {ex}", post, ex.Message);
                ModelState.AddModelError("", "A system error occurred while processing your request. Please contact support.");
            }
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
            _logger.LogError("[PostController] An error occurred while getting post with PostId: {PostId}", id);
            return NotFound();
        }
       // Map post to ViewModel
        var model = new PostUpdateViewModel
        {
            PostId = post.PostId,
            Text = post.Text,
            ExistingImgUrl = post.ImgUrl // Use ImgUrl property for existing image
        };
        return View("PostUpdateView", model); // Display the update form with existing data
    }

   [HttpPost]
    public async Task<IActionResult> Update(PostUpdateViewModel model)
    {
        if (!ModelState.IsValid)
        {
            return View("PostUpdateView", model); // Returner skjemaet hvis validering feiler
        }

        // Hent eksisterende post
        var existingPost = await _postRepository.GetPostByIdAsync(model.PostId);
        if (existingPost == null)
        {
            return NotFound();
        }

        // // Oppdater tekst
        // if (!string.IsNullOrWhiteSpace(model.Text) && model.Text != existingPost.Text)
        // {
        //     existingPost.Text = model.Text;
        // }

        // Validate: Ensure at least one of Text or Image exists
        if (string.IsNullOrWhiteSpace(model.Text) && string.IsNullOrEmpty(existingPost.ImgUrl) && model.NewImage == null)
        {
            ModelState.AddModelError("", "A post must contain either text or an image.");
            return View("PostUpdateView", model);
        }

        // Update text
        existingPost.Text = string.IsNullOrWhiteSpace(model.Text) ? null : model.Text;


        // Håndter ny bildeopplasting
        if (model.NewImage != null && model.NewImage.Length > 0)
        {
            var fileName = Guid.NewGuid() + Path.GetExtension(model.NewImage.FileName);
            var filePath = Path.Combine("wwwroot/images", fileName);

            try
            {
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.NewImage.CopyToAsync(stream);
                }

                existingPost.ImgUrl = "/images/" + fileName;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while uploading image.");
                ModelState.AddModelError("", "An error occurred while uploading the image.");
                return View("PostUpdateView", model);
            }
        }

        // Oppdater tidsstempel
        existingPost.DateUpdated = DateTime.Now;

        // Lagre oppdateringen
        var success = await _postRepository.UpdatePostAsync(existingPost);
        if (success)
        {
            return RedirectToAction("Index", "Home"); // Redirect til hjemmesiden

        }

        ModelState.AddModelError("", "Failed to update the post.");
        return RedirectToAction(nameof(PostUpdateViewModel));
    }




    [HttpPost]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _postRepository.DeletePostAsync(id);
        if (success)
        {
            return RedirectToAction("Index", "Home");
        }

        // Hvis slettingen mislykkes, legg til en feilmelding
        ModelState.AddModelError("", "Failed to delete the post.");
        return RedirectToAction("Details", new { id });
    }



    [HttpPost]
    public async Task<IActionResult> Like(int postId)
    {
        var user = await _userRepository.GetUserByUsernameAsync(User.Identity?.Name ?? string.Empty);
        if (user == null) return Unauthorized();

        var post = await _postRepository.GetPostByIdAsync(postId);
        if (post == null)
        {
            _logger.LogError("[PostController] An error occurred while getting post with PostId: {PostId}", postId);
            return NotFound();
        }

        // Check if the user has already liked the post
        var existingLike = post.UserLikes.FirstOrDefault(like => like.UserId == user.Id);

        if (existingLike != null)
        {
            // If the user has already liked, remove the like
            post.UserLikes.Remove(existingLike);
        }
        else
        {
            // If the user hasn't liked, add the like
            post.UserLikes.Add(new UserPostLike
            {
                UserId = user.Id,
                PostId = postId,
            });
        }

        var success = await _postRepository.UpdatePostAsync(post);

        if (!success)
        {
            _logger.LogError("[PostController] An error occurred while updating like on post with PostId: {PostId}", postId);
            return StatusCode(500, "An error occurred while updating the like status.");
        }
        /// Redirect back to the specific post section
        return RedirectToAction(nameof(Index), "Home", new { section = $"post-{postId}" });
    }
}

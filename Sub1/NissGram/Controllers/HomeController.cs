using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using NissGram.Models;
using NissGram.DAL.Repositories;
using NissGram.DAL.Interfaces;
using NissGram.DAL;
using NissGram.ViewModels;
using Microsoft.AspNetCore.Authorization;

namespace NissGram.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly IPostRepository _postRepository;


    public HomeController(ILogger<HomeController> logger, IPostRepository postRepository)
    {
        _logger = logger;
        _postRepository = postRepository;
    }

    public async Task<IActionResult> Index()
    {
        var posts = await _postRepository.GetAllPostsAsync();
        if (posts == null)
        {
            _logger.LogError("[HomeController] Post list not found while executing _itemRepository.GetAllPostsAsync()");
            return NotFound("Item list not found");
        }
        var viewModel = new PostsViewModel(posts, "All Posts");
        return View(viewModel);
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NissGram.Models;
using Microsoft.AspNetCore.Identity;
using NissGram.DTOs;


namespace NissGram.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly SignInManager<User> _signInManager;
    private readonly UserManager<User> _userManager;

    public AuthController(SignInManager<User> signInManager, UserManager<User> userManager)
    {
        _signInManager = signInManager;
        _userManager = userManager;
    }

    // REMOVE THIS AFTER TESTING
    [AllowAnonymous] // No authentication required 
    [HttpGet("test")]
    public IActionResult Test()
    {
        return Ok("Test endpoint working.");
    }

    [HttpGet("isauthenticated")]
    public IActionResult GetAuthenticationStatus()
    {
        if (User.Identity == null || !User.Identity.IsAuthenticated)
        {
            return Unauthorized(new { isAuthenticated = false, user = (string?)null });
        }

        return Ok(new
        {
            isAuthenticated = true,
            user = User.Identity.Name
        });
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        if (!ModelState.IsValid) return BadRequest("Invalid login data.");

        var user = await _userManager.FindByNameAsync(loginDto.Username);
        if (user == null) return Unauthorized("Invalid username or password.");

        var result = await _signInManager.PasswordSignInAsync(user, loginDto.Password, loginDto.RememberMe, false);

        if (result.Succeeded) return Ok(new { Message = "Login successful." });

        return Unauthorized("Invalid username or password.");
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        // Validate the incoming data
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Ensure passwords match (redundant since it's validated by the DTO, but good for safety)
        if (registerDto.Password != registerDto.ConfirmPassword)
        {
            return BadRequest("Passwords do not match.");
        }

        // Map the DTO to the User model
        var user = new User
        {
            UserName = registerDto.Username,
            Email = registerDto.Email,
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName,
            About = registerDto.About,
            ProfilePicture = registerDto.ProfilePicture
        };

        // Create the user in the database
        var result = await _userManager.CreateAsync(user, registerDto.Password);

        if (result.Succeeded)
        {
            // Optionally add user to default roles or perform additional setup here

            return Ok(new
            {
                Message = "User registered successfully.",
                UserId = user.Id,
                Username = user.UserName,
                Email = user.Email
            });
        }

        // Return errors if registration failed
        return BadRequest(new
        {
            Errors = result.Errors.Select(e => e.Description).ToArray()
        });
    }


    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        return Ok("Logged out successfully.");
    }


}

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Serilog;
using NissGram.DAL;
using NissGram.Models;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;


var builder = WebApplication.CreateBuilder(args);

// Set up connection string
var connectionString = builder.Configuration.GetConnectionString("NissDbContextConnection")
    ?? throw new InvalidOperationException("Connection string 'NissDbContextConnection' not found.");

// Add services to the container
builder.Services.AddDbContext<NissDbContext>(options =>
    options.UseSqlite(connectionString));

// Configure ASP.NET Identity
builder.Services.AddIdentity<User, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequiredLength = 8;
    options.SignIn.RequireConfirmedAccount = false;
    options.SignIn.RequireConfirmedEmail = false;
    options.User.RequireUniqueEmail = true;
})
    .AddEntityFrameworkStores<NissDbContext>()
    .AddDefaultTokenProviders();

// Configure authentication cookies
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.SameSite = SameSiteMode.None; // For cross-origin cookies
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Enforce HTTPS in production
    options.Cookie.HttpOnly = true; // Prevent JavaScript access to cookies
    options.LoginPath = "/api/auth/login";
    options.AccessDeniedPath = "/api/auth/accessdenied";
    options.LogoutPath = "/api/auth/logout";
    options.SlidingExpiration = true;
    options.ExpireTimeSpan = TimeSpan.FromMinutes(30); // Adjust as needed
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = 401; // Return 401 Unauthorized for APIs
        return Task.CompletedTask;
    };
    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.StatusCode = 403; // Return 403 Forbidden for APIs
        return Task.CompletedTask;
    };
});

// Add custom repositories and other dependencies
builder.Services.AddScoped<IPostRepository, PostRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICommentRepository, CommentRepository>();

// Add controllers and policy for authorization
builder.Services.AddControllersWithViews(config =>
{
    var policy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
    config.Filters.Add(new AuthorizeFilter(policy));
});

// Add CORS for React integration
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
        builder.WithOrigins("http://localhost:3000") // Frontend URL
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials()); // Support cookies
});

// Add Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Set up Serilog logging
var loggerConfiguration = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.File($"Logs/app_{DateTime.Now:yyyyMMdd_HHmmss}.log");

var logger = loggerConfiguration.CreateLogger();
builder.Logging.ClearProviders();
builder.Logging.AddSerilog(logger);

builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    });

var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
    DBInit.Seed(app); // Seed data in development
}

app.UseStaticFiles();
app.UseRouting();
app.UseCors("CorsPolicy"); // Apply CORS policy
app.UseAuthentication(); // Enable ASP.NET Identity authentication
app.UseAuthorization(); // Enable authorization

// Map logout endpoint
app.MapPost("/logout", async (SignInManager<User> signInManager) =>
{
    await signInManager.SignOutAsync();
    return Results.Ok();
}).RequireAuthorization();

// Map pingauth endpoint
app.MapGet("/pingauth", (ClaimsPrincipal user) =>
{
    var email = user.FindFirstValue(ClaimTypes.Email);
    return Results.Json(new { email });
}).RequireAuthorization();

// Map routes
app.MapControllers(); // Attribute-based API routes
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();

using Microsoft.EntityFrameworkCore;
using NissGram.DAL;
using Microsoft.AspNetCore.Identity;
using Serilog;
using Serilog.Events;
using NissGram.Models;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.UI.Services;
//Oppretter en instans av WebApplicationBuilder som brukes til å konfigurere
//applikasjonen. args er komamandolinje argumenter som sendes inn i applikasjonen
var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("NissDbContextConnection") ?? throw new InvalidOperationException("Connection string 'NissDbContextConnection' not found.");
//Builder.Services: Refererer til IServiceCollection, som er en samling av tjenester 
//som applikasjonen bruker
//AddControllersWithViews: Legger støtte for MVC i applikasjonen. Denne metoden
//konfigurerer nødvendige tjenester for å håndtere kontroller og generere HTML-sider

builder.Services.AddDbContext<NissDbContext>(options =>
{
    options.UseSqlite(
        builder.Configuration["ConnectionStrings:NissDbContextConnection"]);
});

builder.Services.AddIdentity<User, IdentityRole>(options =>
{
    //so that Identity doesnt expect IEmailSender for registration
    options.SignIn.RequireConfirmedAccount = false;
    options.SignIn.RequireConfirmedEmail = false;
})
    .AddEntityFrameworkStores<NissDbContext>()
    .AddDefaultTokenProviders();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/Identity/Account/Login";
    options.AccessDeniedPath = "/Identity/Account/AccessDenied";
    options.LogoutPath = "/Identity/Account/Logout";
    options.ExpireTimeSpan = TimeSpan.FromSeconds(1800); //short timeout for testing
    //options.SlidingExpiration = false; // Set to false to prevent extending session on activity

});

//POlicy som krever autentisering for å få tilgang til noen av sidene
 builder.Services.AddControllersWithViews(config =>
{
    // Requires users to be authenticated globally
    var policy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
    config.Filters.Add(new AuthorizeFilter(policy));
});

builder.Services.AddRazorPages(options =>
{
    options.Conventions.AuthorizeFolder("/"); // This restricts all pages by default
    options.Conventions.AllowAnonymousToPage("/Account/Login");
    options.Conventions.AllowAnonymousToPage("/Account/Logout");
    options.Conventions.AllowAnonymousToPage("/Account/Register");
    
    // If your pages are under the Identity area:
    // options.Conventions.AllowAnonymousToAreaPage("Identity", "/Account/Login");
    // options.Conventions.AllowAnonymousToAreaPage("Identity", "/Account/Register");
});

builder.Services.AddScoped<IPostRepository, PostRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>(); // Register UserRepository

builder.Services.AddSingleton<IEmailSender, DummyEmailSender>();

builder.Services.AddSession(options =>
{
    options.Cookie.Name = ".NissGram.Session";
    options.IdleTimeout = TimeSpan.FromMinutes(30); // 30 minutes
    //options.Cookie.IsEssential = true;
});




var loggerConfiguration = new LoggerConfiguration()
    .MinimumLevel.Information() // levels: Trace< Information < Warning < Erorr < Fatal
    .WriteTo.File($"Logs/app_{DateTime.Now:yyyyMMdd_HHmmss}.log");


/*loggerConfiguration.Filter.ByExcluding(e => e.Properties.TryGetValue("SourceContext", out var value) &&
                            e.Level == LogEventLevel.Information &&
                            e.MessageTemplate.Text.Contains("Executed DbCommand"));*/

var logger = loggerConfiguration.CreateLogger();
builder.Logging.AddSerilog(logger);

//Når alle tjenester og middleware er konfigurert, bygges applikasjonen ved å kalle Build()
//Dette returnerer en WebApplication instans som kan brukes til å konfigurere
//pipeline-en videre og kjøre applikasjonen
var app = builder.Build();

//Dette skjekker om applikasjonen kjører i et utviklingsmiljø.
if (app.Environment.IsDevelopment())
{
    //Hvis applikasjonen kjører i utviklingsmiljø, legger dette til en side som viser detaljerte feilmeldinger.
    app.UseDeveloperExceptionPage();
    //Calls the seeding method to initialise the database with predefined data.
    DBInit.Seed(app);
}

//Gjør det mulig at applikasjonen kan servere statiske filer som bilder direkte fra
//mappen wwwroot uten noen ekstra kode
app.UseStaticFiles();
app.UseSession();
//It checks incoming requests for authentication credentials and establishes the user's identity for the app
app.UseAuthentication();
app.UseAuthorization();

//Setter opp en standardrute for MVC-applikasjonen
// Sett opp en standardrute til innloggingssiden
app.MapDefaultControllerRoute(); // Starter med innloggingssiden

app.MapRazorPages();

app.Run();

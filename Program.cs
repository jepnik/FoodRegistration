using Microsoft.EntityFrameworkCore;
using FoodRegistration.DAL;
using Serilog;

// Create a logger configuration
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console() // Log to console
    .WriteTo.File("Logs/log.txt", rollingInterval: RollingInterval.Day) // Log to file
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);

// Use Serilog for logging
builder.Host.UseSerilog();

// Add services to the container.
builder.Services.AddControllersWithViews(); // For MVC
builder.Services.AddControllers(); // For API controllers

// Configure the DbContext with SQLite
builder.Services.AddDbContext<ItemDbContext>(options =>
{
    options.UseSqlite(builder.Configuration["ConnectionStrings:ItemDbContextConnection"]);
});

// Register repository
builder.Services.AddScoped<IItemRepository, ItemRepository>();

//Session support
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30); //Timeout session etter 30 minutter
    options.Cookie.HttpOnly = true; //Session må ha cookie http for GDPR. Nødvendig for denne oppgaven?
    options.Cookie.IsEssential = true;
});

var app = builder.Build();

// Log application start
Log.Information("Application Starting...");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    DBInit.Seed(app); // Seed the database in development mode
}
/* else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
} */


app.UseHttpsRedirection();

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseSession();

app.UseAuthorization();

app.UseMiddleware<AuthenticationMiddleware>();

app.UseRouting();

app.UseAuthorization();

// Configure route mappings for both MVC and API
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}"); // MVC route

app.MapControllers(); // API route mapping

app.Run();

// Ensure logs are flushed at the end of the application run
Log.CloseAndFlush();
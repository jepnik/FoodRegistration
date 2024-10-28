/* var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run(); */

using Microsoft.EntityFrameworkCore;
using FoodRegistration.DAL;
using Serilog;

// Create a logger configuration
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console() // Log to console
    .WriteTo.File("logs/log.txt", rollingInterval: RollingInterval.Day) // Log to file
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);

// Use Serilog for logging
builder.Host.UseSerilog();

builder.Services.AddControllersWithViews();

// Configure the DbContext with SQLite
builder.Services.AddDbContext<ItemDbContext>(options =>
{
    options.UseSqlite(builder.Configuration["ConnectionStrings:ItemDbContextConnection"]);
});

builder.Services.AddScoped<IItemRepository, ItemRepository>();

var app = builder.Build();

// Log application start
Log.Information("Application Starting...");

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    DBInit.Seed(app);
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseStaticFiles();

app.MapDefaultControllerRoute();

app.Run();

// Ensure logs are flushed at the end of the application run
Log.CloseAndFlush();
using Microsoft.EntityFrameworkCore;
using FoodRegistration.DAL;
using Serilog;
using Serilog.Events;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("ItemDbContextConnection") ?? 
throw new InvalidOperationException("Connection string 'ItemDbContextConnection' not found.");

builder.Services.AddControllersWithViews();

// Configure the DbContext with SQLite
builder.Services.AddDbContext<ItemDbContext>(options =>
{
    options.UseSqlite(builder.Configuration["ConnectionStrings:ItemDbContextConnection"]);
});

// Register repository
builder.Services.AddScoped<IItemRepository, ItemRepository>();

// Create a logger configuration
var loggerConfiguration = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console() // Log to console
    .WriteTo.File($"Logs/log_{DateTime.Now:yyyyMMdd_HHmmss}.log"); // Log to file

loggerConfiguration.Filter.ByExcluding(e => e.Properties.TryGetValue("SourceContext", out var value) &&
                            e.Level == LogEventLevel.Information &&
                            e.MessageTemplate.Text.Contains("Executed DbCommand"));

var logger = loggerConfiguration.CreateLogger();
builder.Logging.AddSerilog(logger);

// Session support
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30); //Timeout session etter 30 minutter
    options.Cookie.HttpOnly = true; //Session må ha cookie http for GDPR. Nødvendig for denne oppgaven?
    options.Cookie.IsEssential = true;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    DBInit.Seed(app); // Seed the database in development mode
}

app.UseStaticFiles();

app.UseSession();

app.Use(async (context, next) => 
{ context.Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate"; 
context.Response.Headers["Pragma"] = "no-cache";
context.Response.Headers["Expires"] = "-1";
await next(); });

app.UseAuthorization();

app.UseAuthentication();

app.UseMiddleware<AuthenticationMiddleware>();

app.MapDefaultControllerRoute();

app.Run();

// Ensure logs are flushed at the end of the application run
Log.CloseAndFlush();
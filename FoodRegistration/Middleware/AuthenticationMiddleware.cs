public class AuthenticationMiddleware
{
    private readonly RequestDelegate _next;

    public AuthenticationMiddleware(RequestDelegate next)
    {
        _next = next;
    }   

    public async Task InvokeAsync(HttpContext context)
    {
        // Check if session exists
        if (!context.Session.GetInt32("UserID").HasValue
        && !context.Request.Path.StartsWithSegments("/Account/Login")
        && !context.Request.Path.StartsWithSegments("/Account/RegisterUser"))
        {
            context.Response.Redirect("/Account/Login");
            return;
        }

        await _next(context);
    }
}
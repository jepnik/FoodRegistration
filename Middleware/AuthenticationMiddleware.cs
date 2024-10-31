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
        if (string.IsNullOrEmpty(context.Session.GetString("User")) && !context.Request.Path.StartsWithSegments("/Account/Login"))
        {
            context.Response.Redirect("/Account/Login");
            return;
        }

        await _next(context);
    }
}
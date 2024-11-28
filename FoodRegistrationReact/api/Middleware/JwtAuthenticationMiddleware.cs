public class JwtAuthenticationMiddleware
{
    private readonly RequestDelegate _next;

    public JwtAuthenticationMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var token = context.Request.Cookies["jwt"];
        if (string.IsNullOrEmpty(token)
            && !context.Request.Path.StartsWithSegments("/api/account/login")
            && !context.Request.Path.StartsWithSegments("/api/account/register"))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await context.Response.WriteAsync("Unauthorized access.");
            return;
        }

        await _next(context);
    }
}

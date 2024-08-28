using plantilla_app_web.Filters;
using plantilla_app_web.Middleware;
using Domain.Common;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddMemoryCache();
builder.Services.AddControllersWithViews();
builder.Services.AddInfrastructureServices();
builder.Services.AddTransient<CryptoFilter>();


builder.Services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings:BasicAuth"));
builder.Services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings:Endpoints"));
builder.Services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings:EndpointServices"));//TODO: Eliminar cuando todos esten migrados
builder.Services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings:EndpointServicesApiGateway"));
builder.Services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings:HttpConfig"));
builder.Services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings:EnvConfig"));
builder.Services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings:LoadParameters"));
builder.Services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings:Permisos"));

var app = builder.Build();

// Configure the HTTP request pipeline.
if(!app.Environment.IsDevelopment()) {
}

app.UseStaticFiles();
app.UseRouting();

app.UseAuthotizationMego();

app.UseAuthorization();

app.UseValidateCachedParameters();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();

using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using RatioMaster.Core.Services;
using RatioMaster.API.Hubs;
using RatioMaster.API.Data;
using RatioMaster.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Configuration des services
builder.Services.AddControllers();
builder.Services.AddSignalR(); // Pour les mises à jour temps réel
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Base de données
builder.Services.AddDbContext<RatioMasterContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    if (connectionString?.Contains(":memory:") == true)
    {
        options.UseSqlite(connectionString);
    }
    else
    {
        options.UseSqlServer(connectionString);
    }
});

// Redis pour les sessions
builder.Services.AddStackExchangeRedisCache(options => {
    options.Configuration = builder.Configuration.GetConnectionString("Redis");
});

// Services métier (portés depuis WinForms)
builder.Services.AddScoped<ITorrentService, ApiTorrentService>();
builder.Services.AddScoped<ITrackerService, CoreTrackerService>();
builder.Services.AddScoped<ISessionService, CoreSessionService>();
builder.Services.AddHostedService<ApiTorrentBackgroundService>();

// CORS pour le frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", builder =>
        builder.WithOrigins("http://localhost:3000")
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials());
});

var app = builder.Build();

// Pipeline de requêtes
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseRouting();
app.UseAuthorization();

app.MapControllers();
app.MapHub<TorrentHub>("/hub/torrents");

// Health check
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));

app.Run();

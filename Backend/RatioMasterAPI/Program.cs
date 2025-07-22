using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using RatioMaster.Core.Services;
using RatioMaster.API.Hubs;
using RatioMaster.API.Data;

var builder = WebApplication.CreateBuilder(args);

// Configuration des services
builder.Services.AddControllers();
builder.Services.AddSignalR(); // Pour les mises à jour temps réel
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Base de données
builder.Services.AddDbContext<RatioMasterContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Redis pour les sessions
builder.Services.AddStackExchangeRedisCache(options => {
    options.Configuration = builder.Configuration.GetConnectionString("Redis");
});

// Services métier (portés depuis WinForms)
builder.Services.AddScoped<ITorrentService, TorrentService>();
builder.Services.AddScoped<ITrackerService, TrackerService>();
builder.Services.AddScoped<ISessionService, SessionService>();
builder.Services.AddHostedService<TorrentBackgroundService>();

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

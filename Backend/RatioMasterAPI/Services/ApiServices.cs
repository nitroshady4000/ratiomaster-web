using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using RatioMaster.Core.Models;
using RatioMaster.Core.Services;
using RatioMaster.API.Data;
using RatioMaster.API.Hubs;

namespace RatioMaster.API.Services
{
    public class ApiTorrentService : CoreTorrentService
    {
        private readonly RatioMasterContext _context;
        private readonly IHubContext<TorrentHub> _hubContext;
        private readonly Dictionary<int, TorrentClient> _activeTorrents = new();

        public ApiTorrentService(
            RatioMasterContext context,
            ILogger<ApiTorrentService> logger,
            IHubContext<TorrentHub> hubContext) : base(logger)
        {
            _context = context;
            _hubContext = hubContext;
        }

        public override async Task<IEnumerable<TorrentInfo>> GetAllTorrentsAsync()
        {
            return await _context.Torrents.ToListAsync();
        }

        public override async Task<TorrentInfo?> GetTorrentAsync(int id)
        {
            return await _context.Torrents.FindAsync(id);
        }

        public override async Task<TorrentInfo> AddTorrentAsync(AddTorrentRequest request)
        {
            var torrentInfo = new TorrentInfo
            {
                Name = request.Name ?? "Test Torrent",
                InfoHash = GenerateTestInfoHash(),
                TrackerUrl = "http://tracker.test.com:8080/announce",
                TotalSize = 1024 * 1024 * 100, // 100MB pour test
                PieceLength = 262144,
                Status = TorrentStatus.Stopped,
                CreatedAt = DateTime.UtcNow,
                ClientType = request.ClientType ?? "uTorrent 3.5.5",
                UploadSpeed = request.UploadSpeed ?? 0,
                DownloadSpeed = request.DownloadSpeed ?? 0,
                ProxySettings = request.ProxySettings
            };

            _context.Torrents.Add(torrentInfo);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Torrent ajouté: {torrentInfo.Name} (ID: {torrentInfo.Id})");
            
            return torrentInfo;
        }

        public override async Task StartTorrentAsync(int id)
        {
            var torrent = await GetTorrentAsync(id);
            if (torrent == null)
                throw new ArgumentException($"Torrent {id} introuvable");

            torrent.Status = TorrentStatus.Running;
            torrent.StartedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            await _hubContext.Clients.All.SendAsync("TorrentStatusChanged", new { id, status = "Running" });
            
            _logger.LogInformation($"Torrent démarré: {torrent.Name} (ID: {id})");
        }

        public override async Task StopTorrentAsync(int id)
        {
            var torrent = await GetTorrentAsync(id);
            if (torrent == null)
                throw new ArgumentException($"Torrent {id} introuvable");

            torrent.Status = TorrentStatus.Stopped;
            torrent.StoppedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            await _hubContext.Clients.All.SendAsync("TorrentStatusChanged", new { id, status = "Stopped" });
            
            _logger.LogInformation($"Torrent arrêté: {torrent.Name} (ID: {id})");
        }

        public override async Task RemoveTorrentAsync(int id)
        {
            var torrent = await GetTorrentAsync(id);
            if (torrent != null)
            {
                _context.Torrents.Remove(torrent);
                await _context.SaveChangesAsync();
                
                _logger.LogInformation($"Torrent supprimé: {torrent.Name} (ID: {id})");
            }
        }

        public override async Task<TorrentStatusDto?> GetTorrentStatusAsync(int id)
        {
            var torrent = await GetTorrentAsync(id);
            if (torrent == null) return null;

            return new TorrentStatusDto
            {
                Id = id,
                Name = torrent.Name,
                Status = torrent.Status,
                Uploaded = torrent.Uploaded,
                Downloaded = torrent.Downloaded,
                UploadSpeed = torrent.UploadSpeed,
                DownloadSpeed = torrent.DownloadSpeed,
                Ratio = torrent.Ratio,
                LastUpdate = torrent.LastTrackerUpdate,
                NextUpdate = torrent.NextTrackerUpdate,
                Peers = torrent.ConnectedPeers,
                Seeds = torrent.Seeds,
                Leechers = torrent.Leechers
            };
        }

        public override async Task StartAllTorrentsAsync()
        {
            var torrents = await _context.Torrents.Where(t => t.Status == TorrentStatus.Stopped).ToListAsync();
            
            foreach (var torrent in torrents)
            {
                try
                {
                    await StartTorrentAsync(torrent.Id);
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Erreur lors du démarrage du torrent {torrent.Id}: {ex.Message}");
                }
            }
        }

        public override async Task StopAllTorrentsAsync()
        {
            var torrents = await _context.Torrents.Where(t => t.Status == TorrentStatus.Running).ToListAsync();
            
            foreach (var torrent in torrents)
            {
                try
                {
                    await StopTorrentAsync(torrent.Id);
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Erreur lors de l'arrêt du torrent {torrent.Id}: {ex.Message}");
                }
            }
        }
    }

    public class ApiTorrentBackgroundService : BackgroundService
    {
        private readonly ILogger<ApiTorrentBackgroundService> _logger;
        private readonly IServiceProvider _serviceProvider;

        public ApiTorrentBackgroundService(
            ILogger<ApiTorrentBackgroundService> logger,
            IServiceProvider serviceProvider)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Service de fond API démarré");
            
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _serviceProvider.CreateScope();
                    // TODO: Logique de mise à jour périodique des torrents
                    _logger.LogDebug("Background service tick");
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Erreur dans le service de fond: {ex.Message}");
                }
                
                await Task.Delay(30000, stoppingToken); // 30 secondes
            }
        }
    }
}

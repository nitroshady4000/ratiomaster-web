using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using RatioMaster.Core.Models;
using RatioMaster.API.Data;
using RatioMaster.API.Hubs;

namespace RatioMaster.Core.Services
{
    public class TorrentService : ITorrentService
    {
        private readonly RatioMasterContext _context;
        private readonly ILogger<TorrentService> _logger;
        private readonly IHubContext<TorrentHub> _hubContext;
        private readonly Dictionary<int, TorrentClient> _activeTorrents = new();

        public TorrentService(
            RatioMasterContext context,
            ILogger<TorrentService> logger,
            IHubContext<TorrentHub> hubContext)
        {
            _context = context;
            _logger = logger;
            _hubContext = hubContext;
        }

        public async Task<IEnumerable<TorrentInfo>> GetAllTorrentsAsync()
        {
            return await _context.Torrents.ToListAsync();
        }

        public async Task<TorrentInfo?> GetTorrentAsync(int id)
        {
            return await _context.Torrents.FindAsync(id);
        }

        public async Task<TorrentInfo> AddTorrentAsync(AddTorrentRequest request)
        {
            // Pour l'instant, on crée un torrent de base
            // TODO: Implémenter le parsing du fichier torrent
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

        public async Task StartTorrentAsync(int id)
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

        public async Task StopTorrentAsync(int id)
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

        public async Task RemoveTorrentAsync(int id)
        {
            var torrent = await GetTorrentAsync(id);
            if (torrent != null)
            {
                _context.Torrents.Remove(torrent);
                await _context.SaveChangesAsync();
                
                _logger.LogInformation($"Torrent supprimé: {torrent.Name} (ID: {id})");
            }
        }

        public async Task ManualUpdateAsync(int id)
        {
            _logger.LogInformation($"Mise à jour manuelle du torrent {id}");
            // TODO: Implémenter la mise à jour tracker
        }

        public async Task<TorrentStatusDto?> GetTorrentStatusAsync(int id)
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

        public async Task StartAllTorrentsAsync()
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

        public async Task StopAllTorrentsAsync()
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

        public async Task UpdateAllTorrentsAsync()
        {
            _logger.LogInformation("Mise à jour de tous les torrents");
            // TODO: Implémenter la mise à jour de tous les torrents
        }

        private string GenerateTestInfoHash()
        {
            var random = new Random();
            var bytes = new byte[20];
            random.NextBytes(bytes);
            return Convert.ToHexString(bytes).ToLower();
        }
    }

    public class TrackerService : ITrackerService
    {
        private readonly ILogger<TrackerService> _logger;

        public TrackerService(ILogger<TrackerService> logger)
        {
            _logger = logger;
        }

        public async Task<TrackerResponse> AnnounceAsync(TorrentClient client, TrackerEvent eventType)
        {
            _logger.LogInformation($"Announce {eventType} pour {client.InfoHash}");
            
            // TODO: Implémenter la communication réelle avec les trackers
            return new TrackerResponse
            {
                Complete = 10,
                Incomplete = 5,
                Interval = 1800,
                Peers = new List<Peer>()
            };
        }

        public async Task<bool> TestTrackerAsync(string trackerUrl)
        {
            _logger.LogInformation($"Test du tracker: {trackerUrl}");
            return true; // TODO: Implémenter le vrai test
        }
    }

    public class SessionService : ISessionService
    {
        private readonly ILogger<SessionService> _logger;

        public SessionService(ILogger<SessionService> logger)
        {
            _logger = logger;
        }

        public async Task<IEnumerable<SessionInfo>> GetAvailableSessionsAsync()
        {
            // TODO: Lire les sessions depuis le système de fichiers
            return new List<SessionInfo>();
        }

        public async Task SaveCurrentSessionAsync(string name, bool stopTorrents)
        {
            _logger.LogInformation($"Sauvegarde de la session: {name}");
            // TODO: Implémenter la sauvegarde
        }

        public async Task LoadSessionAsync(string sessionPath, bool autoStart)
        {
            _logger.LogInformation($"Chargement de la session: {sessionPath}");
            // TODO: Implémenter le chargement
        }

        public async Task DeleteSessionAsync(string sessionName)
        {
            _logger.LogInformation($"Suppression de la session: {sessionName}");
            // TODO: Implémenter la suppression
        }
    }

    public class TorrentBackgroundService : BackgroundService
    {
        private readonly ILogger<TorrentBackgroundService> _logger;

        public TorrentBackgroundService(ILogger<TorrentBackgroundService> logger)
        {
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Service de fond démarré");
            
            while (!stoppingToken.IsCancellationRequested)
            {
                // TODO: Logique de mise à jour périodique des torrents
                await Task.Delay(30000, stoppingToken); // 30 secondes
            }
        }
    }
}

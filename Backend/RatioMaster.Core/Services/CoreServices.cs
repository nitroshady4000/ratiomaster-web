using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Hosting;
using RatioMaster.Core.Models;

namespace RatioMaster.Core.Services
{
    // Implémentations de base pour le Core - seront surchargées dans l'API
    public class CoreTorrentService : ITorrentService
    {
        protected readonly ILogger<CoreTorrentService> _logger;

        public CoreTorrentService(ILogger<CoreTorrentService> logger)
        {
            _logger = logger;
        }

        public virtual async Task<IEnumerable<TorrentInfo>> GetAllTorrentsAsync()
        {
            _logger.LogInformation("GetAllTorrentsAsync called");
            return new List<TorrentInfo>();
        }

        public virtual async Task<TorrentInfo?> GetTorrentAsync(int id)
        {
            _logger.LogInformation($"GetTorrentAsync called with id: {id}");
            return null;
        }

        public virtual async Task<TorrentInfo> AddTorrentAsync(AddTorrentRequest request)
        {
            _logger.LogInformation($"AddTorrentAsync called for: {request.Name}");
            
            var torrentInfo = new TorrentInfo
            {
                Id = 1,
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

            return torrentInfo;
        }

        public virtual async Task StartTorrentAsync(int id)
        {
            _logger.LogInformation($"StartTorrentAsync called for id: {id}");
        }

        public virtual async Task StopTorrentAsync(int id)
        {
            _logger.LogInformation($"StopTorrentAsync called for id: {id}");
        }

        public virtual async Task RemoveTorrentAsync(int id)
        {
            _logger.LogInformation($"RemoveTorrentAsync called for id: {id}");
        }

        public virtual async Task ManualUpdateAsync(int id)
        {
            _logger.LogInformation($"ManualUpdateAsync called for id: {id}");
        }

        public virtual async Task<TorrentStatusDto?> GetTorrentStatusAsync(int id)
        {
            _logger.LogInformation($"GetTorrentStatusAsync called for id: {id}");
            return null;
        }

        public virtual async Task StartAllTorrentsAsync()
        {
            _logger.LogInformation("StartAllTorrentsAsync called");
        }

        public virtual async Task StopAllTorrentsAsync()
        {
            _logger.LogInformation("StopAllTorrentsAsync called");
        }

        public virtual async Task UpdateAllTorrentsAsync()
        {
            _logger.LogInformation("UpdateAllTorrentsAsync called");
        }

        protected string GenerateTestInfoHash()
        {
            var random = new Random();
            var bytes = new byte[20];
            random.NextBytes(bytes);
            return Convert.ToHexString(bytes).ToLower();
        }
    }

    public class CoreTrackerService : ITrackerService
    {
        private readonly ILogger<CoreTrackerService> _logger;

        public CoreTrackerService(ILogger<CoreTrackerService> logger)
        {
            _logger = logger;
        }

        public virtual async Task<TrackerResponse> AnnounceAsync(TorrentClient client, TrackerEvent eventType)
        {
            _logger.LogInformation($"Announce {eventType} pour {client.InfoHash}");
            
            return new TrackerResponse
            {
                Complete = 10,
                Incomplete = 5,
                Interval = 1800,
                Peers = new List<Peer>()
            };
        }

        public virtual async Task<bool> TestTrackerAsync(string trackerUrl)
        {
            _logger.LogInformation($"Test du tracker: {trackerUrl}");
            return true;
        }
    }

    public class CoreSessionService : ISessionService
    {
        private readonly ILogger<CoreSessionService> _logger;

        public CoreSessionService(ILogger<CoreSessionService> logger)
        {
            _logger = logger;
        }

        public virtual async Task<IEnumerable<SessionInfo>> GetAvailableSessionsAsync()
        {
            _logger.LogInformation("GetAvailableSessionsAsync called");
            return new List<SessionInfo>();
        }

        public virtual async Task SaveCurrentSessionAsync(string name, bool stopTorrents)
        {
            _logger.LogInformation($"Sauvegarde de la session: {name}");
        }

        public virtual async Task LoadSessionAsync(string sessionPath, bool autoStart)
        {
            _logger.LogInformation($"Chargement de la session: {sessionPath}");
        }

        public virtual async Task DeleteSessionAsync(string sessionName)
        {
            _logger.LogInformation($"Suppression de la session: {sessionName}");
        }
    }

    public class CoreTorrentBackgroundService : BackgroundService
    {
        private readonly ILogger<CoreTorrentBackgroundService> _logger;

        public CoreTorrentBackgroundService(ILogger<CoreTorrentBackgroundService> logger)
        {
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Service de fond démarré");
            
            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogDebug("Background service tick");
                await Task.Delay(30000, stoppingToken); // 30 secondes
            }
        }
    }
}

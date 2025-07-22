using RatioMaster.Core.Models;
using Microsoft.Extensions.Logging;

namespace RatioMaster.Core.Services
{
    public class TorrentClient
    {
        public string InfoHash { get; set; } = string.Empty;
        public string TrackerUrl { get; set; } = string.Empty;
        public string PeerId { get; set; } = string.Empty;
        public int Port { get; set; } = 6881;
        public long Uploaded { get; set; }
        public long Downloaded { get; set; }
        public long Left { get; set; }
        public string ClientType { get; set; } = string.Empty;
        
        private readonly TorrentClientConfig _config;
        private readonly ITrackerService _trackerService;
        private readonly ILogger _logger;
        private bool _isRunning;

        public TorrentClient(TorrentClientConfig config, ITrackerService trackerService, ILogger logger)
        {
            _config = config;
            _trackerService = trackerService;
            _logger = logger;
            
            InfoHash = config.InfoHash;
            TrackerUrl = config.TrackerUrl;
            ClientType = config.ClientType;
            Left = config.TotalSize;
            
            // Générer un peer ID selon le type de client
            PeerId = GeneratePeerId(config.ClientType);
        }

        public async Task StartAsync()
        {
            if (_isRunning) return;
            
            _isRunning = true;
            _logger.LogInformation($"Démarrage du client torrent pour {InfoHash}");
            
            // Envoyer l'événement "started" au tracker
            try
            {
                var response = await _trackerService.AnnounceAsync(this, TrackerEvent.Started);
                _logger.LogInformation($"Tracker response: {response.Complete} seeds, {response.Incomplete} leechers");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Erreur lors de l'annonce started: {ex.Message}");
                throw;
            }
        }

        public async Task StopAsync()
        {
            if (!_isRunning) return;
            
            _isRunning = false;
            _logger.LogInformation($"Arrêt du client torrent pour {InfoHash}");
            
            // Envoyer l'événement "stopped" au tracker
            try
            {
                await _trackerService.AnnounceAsync(this, TrackerEvent.Stopped);
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"Erreur lors de l'annonce stopped: {ex.Message}");
            }
        }

        public async Task UpdateTrackerAsync()
        {
            if (!_isRunning) return;
            
            try
            {
                var response = await _trackerService.AnnounceAsync(this, TrackerEvent.None);
                _logger.LogDebug($"Mise à jour tracker: {response.Complete} seeds, {response.Incomplete} leechers");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Erreur lors de la mise à jour tracker: {ex.Message}");
            }
        }

        private string GeneratePeerId(string clientType)
        {
            // Génération des peer IDs selon les conventions des clients
            var random = new Random();
            var randomPart = new byte[12];
            random.NextBytes(randomPart);
            
            return clientType.ToLower() switch
            {
                "utorrent 3.5.5" => "-UT355S-" + Convert.ToHexString(randomPart),
                "utorrent 2.2.1" => "-UT221S-" + Convert.ToHexString(randomPart),
                "bittorrent 7.10.5" => "-BT7105-" + Convert.ToHexString(randomPart),
                "azureus 5.7.6.0" => "-AZ5760-" + Convert.ToHexString(randomPart),
                "bitcomet 1.70" => "-BC0170-" + Convert.ToHexString(randomPart),
                "transmission 3.00" => "-TR3000-" + Convert.ToHexString(randomPart),
                "deluge 2.0.3" => "-DE203s-" + Convert.ToHexString(randomPart),
                "qbittorrent 4.4.0" => "-qB4400-" + Convert.ToHexString(randomPart),
                _ => "-RM1000-" + Convert.ToHexString(randomPart) // RatioMaster par défaut
            };
        }
    }

    public class TorrentClientConfig
    {
        public string ClientType { get; set; } = string.Empty;
        public string InfoHash { get; set; } = string.Empty;
        public string TrackerUrl { get; set; } = string.Empty;
        public long TotalSize { get; set; }
        public int UploadSpeed { get; set; }
        public int DownloadSpeed { get; set; }
        public ProxySettings? ProxySettings { get; set; }
    }
}

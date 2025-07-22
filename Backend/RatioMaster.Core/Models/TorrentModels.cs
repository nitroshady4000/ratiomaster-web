namespace RatioMaster.Core.Models
{
    public class TorrentInfo
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string InfoHash { get; set; } = string.Empty;
        public string TrackerUrl { get; set; } = string.Empty;
        public long TotalSize { get; set; }
        public int PieceLength { get; set; }
        public TorrentStatus Status { get; set; }
        public string ClientType { get; set; } = "uTorrent 3.5.5";
        
        // Statistiques
        public long Uploaded { get; set; }
        public long Downloaded { get; set; }
        public int UploadSpeed { get; set; }
        public int DownloadSpeed { get; set; }
        public int ConnectedPeers { get; set; }
        public int Seeds { get; set; }
        public int Leechers { get; set; }
        
        // Timestamps
        public DateTime CreatedAt { get; set; }
        public DateTime? StartedAt { get; set; }
        public DateTime? StoppedAt { get; set; }
        public DateTime? LastTrackerUpdate { get; set; }
        public DateTime? NextTrackerUpdate { get; set; }
        
        // Configuration
        public ProxySettings? ProxySettings { get; set; }
        public int UpdateInterval { get; set; } = 1800; // 30 minutes par défaut
        
        // Propriétés calculées
        public double Ratio => Downloaded > 0 ? (double)Uploaded / Downloaded : 0;
    }

    public enum TorrentStatus
    {
        Stopped,
        Running,
        Error
    }

    public class TorrentStatusDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public TorrentStatus Status { get; set; }
        public long Uploaded { get; set; }
        public long Downloaded { get; set; }
        public int UploadSpeed { get; set; }
        public int DownloadSpeed { get; set; }
        public double Ratio { get; set; }
        public DateTime? LastUpdate { get; set; }
        public DateTime? NextUpdate { get; set; }
        public int Peers { get; set; }
        public int Seeds { get; set; }
        public int Leechers { get; set; }
    }

    public class AddTorrentRequest
    {
        public string? Name { get; set; }
        public byte[] TorrentData { get; set; } = Array.Empty<byte>();
        public string? ClientType { get; set; }
        public int? UploadSpeed { get; set; }
        public int? DownloadSpeed { get; set; }
        public ProxySettings? ProxySettings { get; set; }
    }

    public class ProxySettings
    {
        public string Type { get; set; } = "None"; // None, HTTP, SOCKS4, SOCKS5
        public string Host { get; set; } = string.Empty;
        public int Port { get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; }
    }

    public class SessionInfo
    {
        public string Name { get; set; } = string.Empty;
        public string Path { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public int TorrentCount { get; set; }
        public string TotalSize { get; set; } = string.Empty;
    }

    public class SaveSessionRequest
    {
        public string Name { get; set; } = string.Empty;
        public bool StopTorrents { get; set; } = true;
    }

    public class LoadSessionRequest
    {
        public string SessionPath { get; set; } = string.Empty;
        public bool AutoStart { get; set; } = false;
    }

    public class TrackerResponse
    {
        public int Complete { get; set; }
        public int Incomplete { get; set; }
        public int Interval { get; set; }
        public int MinInterval { get; set; }
        public List<Peer> Peers { get; set; } = new();
        public string? FailureReason { get; set; }
        public string? WarningMessage { get; set; }
    }

    public class Peer
    {
        public string IP { get; set; } = string.Empty;
        public int Port { get; set; }
        public string? PeerId { get; set; }
    }

    public enum TrackerEvent
    {
        None,
        Started,
        Stopped,
        Completed
    }

    public class TorrentData
    {
        public string Name { get; set; } = string.Empty;
        public string InfoHash { get; set; } = string.Empty;
        public string Announce { get; set; } = string.Empty;
        public long TotalLength { get; set; }
        public int PieceLength { get; set; }
        public byte[] Pieces { get; set; } = Array.Empty<byte>();
    }
}

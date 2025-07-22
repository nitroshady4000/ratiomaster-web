using RatioMaster.Core.Models;

namespace RatioMaster.Core.Services
{
    public interface ITorrentService
    {
        Task<IEnumerable<TorrentInfo>> GetAllTorrentsAsync();
        Task<TorrentInfo?> GetTorrentAsync(int id);
        Task<TorrentInfo> AddTorrentAsync(AddTorrentRequest request);
        Task StartTorrentAsync(int id);
        Task StopTorrentAsync(int id);
        Task RemoveTorrentAsync(int id);
        Task ManualUpdateAsync(int id);
        Task<TorrentStatusDto?> GetTorrentStatusAsync(int id);
        Task StartAllTorrentsAsync();
        Task StopAllTorrentsAsync();
        Task UpdateAllTorrentsAsync();
    }

    public interface ITrackerService
    {
        Task<TrackerResponse> AnnounceAsync(TorrentClient client, TrackerEvent eventType);
        Task<bool> TestTrackerAsync(string trackerUrl);
    }

    public interface ISessionService
    {
        Task<IEnumerable<SessionInfo>> GetAvailableSessionsAsync();
        Task SaveCurrentSessionAsync(string name, bool stopTorrents);
        Task LoadSessionAsync(string sessionPath, bool autoStart);
        Task DeleteSessionAsync(string sessionName);
    }
}

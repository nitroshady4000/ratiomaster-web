using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using RatioMaster.Core.Models;
using RatioMaster.Core.Services;
using RatioMaster.API.Hubs;

namespace RatioMaster.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TorrentController : ControllerBase
    {
        private readonly ITorrentService _torrentService;
        private readonly IHubContext<TorrentHub> _hubContext;

        public TorrentController(ITorrentService torrentService, IHubContext<TorrentHub> hubContext)
        {
            _torrentService = torrentService;
            _hubContext = hubContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TorrentInfo>>> GetTorrents()
        {
            var torrents = await _torrentService.GetAllTorrentsAsync();
            return Ok(torrents);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TorrentInfo>> GetTorrent(int id)
        {
            var torrent = await _torrentService.GetTorrentAsync(id);
            if (torrent == null)
                return NotFound();
            
            return Ok(torrent);
        }

        [HttpPost]
        public async Task<ActionResult<TorrentInfo>> AddTorrent([FromBody] AddTorrentRequest request)
        {
            try
            {
                var torrent = await _torrentService.AddTorrentAsync(request);
                
                // Notifier les clients connectés
                await _hubContext.Clients.All.SendAsync("TorrentAdded", torrent);
                
                return CreatedAtAction(nameof(GetTorrent), new { id = torrent.Id }, torrent);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("{id}/start")]
        public async Task<IActionResult> StartTorrent(int id)
        {
            try
            {
                await _torrentService.StartTorrentAsync(id);
                await _hubContext.Clients.All.SendAsync("TorrentStarted", id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("{id}/stop")]
        public async Task<IActionResult> StopTorrent(int id)
        {
            try
            {
                await _torrentService.StopTorrentAsync(id);
                await _hubContext.Clients.All.SendAsync("TorrentStopped", id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("{id}/update")]
        public async Task<IActionResult> UpdateTorrent(int id)
        {
            try
            {
                await _torrentService.ManualUpdateAsync(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveTorrent(int id)
        {
            try
            {
                await _torrentService.RemoveTorrentAsync(id);
                await _hubContext.Clients.All.SendAsync("TorrentRemoved", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("{id}/status")]
        public async Task<ActionResult<TorrentStatus>> GetTorrentStatus(int id)
        {
            var status = await _torrentService.GetTorrentStatusAsync(id);
            if (status == null)
                return NotFound();
            
            return Ok(status);
        }

        [HttpPost("start-all")]
        public async Task<IActionResult> StartAllTorrents()
        {
            try
            {
                await _torrentService.StartAllTorrentsAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("stop-all")]
        public async Task<IActionResult> StopAllTorrents()
        {
            try
            {
                await _torrentService.StopAllTorrentsAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("update-all")]
        public async Task<IActionResult> UpdateAllTorrents()
        {
            try
            {
                await _torrentService.UpdateAllTorrentsAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}

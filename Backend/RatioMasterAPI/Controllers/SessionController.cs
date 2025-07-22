using Microsoft.AspNetCore.Mvc;
using RatioMaster.Core.Services;
using RatioMaster.Core.Models;

namespace RatioMaster.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SessionController : ControllerBase
    {
        private readonly ISessionService _sessionService;

        public SessionController(ISessionService sessionService)
        {
            _sessionService = sessionService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SessionInfo>>> GetSessions()
        {
            var sessions = await _sessionService.GetAvailableSessionsAsync();
            return Ok(sessions);
        }

        [HttpPost("save")]
        public async Task<IActionResult> SaveSession([FromBody] SaveSessionRequest request)
        {
            try
            {
                await _sessionService.SaveCurrentSessionAsync(request.Name, request.StopTorrents);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("load")]
        public async Task<IActionResult> LoadSession([FromBody] LoadSessionRequest request)
        {
            try
            {
                await _sessionService.LoadSessionAsync(request.SessionPath, request.AutoStart);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpDelete("{sessionName}")]
        public async Task<IActionResult> DeleteSession(string sessionName)
        {
            try
            {
                await _sessionService.DeleteSessionAsync(sessionName);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}

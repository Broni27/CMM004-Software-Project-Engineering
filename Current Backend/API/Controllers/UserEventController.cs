using API.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserEventController : ControllerBase
    {
        private readonly UserEventRepository _userEventRepository;
        
        public UserEventController(UserEventRepository userEventRepository)
        {
            _userEventRepository = userEventRepository;
           
        }

        [Authorize]
        [HttpPost("join/{eventId}")]
        public async Task<IActionResult> JoinEvent(int eventId)
        {
            var userId = GetUserIdFromToken();
            if (userId == null)
                return Unauthorized();

            var result = await _userEventRepository.JoinEventAsync(userId.Value, eventId);
            if (!result)
                return BadRequest("Failed to join the event.");

            return Ok(new { Message = "Joined event successfully." });
        }

        [Authorize]
        [HttpGet("joined")]
        public async Task<IActionResult> GetJoinedEvents()
        {
            var userId = GetUserIdFromToken();
            if (userId == null)
                return Unauthorized();
            var events = await _userEventRepository.GetJoinedEventsAsync(userId.Value);
            return Ok(events);
        }

        [Authorize]
        [HttpDelete("leave/{eventId}")]
        public async Task<IActionResult> LeaveEvent(int eventId)
        {
            var userId = GetUserIdFromToken();
            if (userId == null)
                return Unauthorized();

            var result = await _userEventRepository.LeaveEventAsync(userId.Value, eventId);
            if (!result)
                return BadRequest("Failed to leave the event. You may not be joined.");

            return Ok(new { Message = "Left event successfully." });
        }


        private int? GetUserIdFromToken()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return null;

            if (int.TryParse(userIdClaim.Value, out var userId))
            {
                return userId;
            }

            return null;
        }

    }
}

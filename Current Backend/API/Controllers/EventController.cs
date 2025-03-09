using API.Data;
using API.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly EventRepository _eventRepository;
        
        public EventController(EventRepository eventRepository)
        {
            _eventRepository = eventRepository;
           
        }
        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventDto>>> GetEvents() // /api/event
        {
            var events = await _eventRepository.GetEventsAsync();
            return Ok(events);
        }

        [HttpGet("{id}")] // api/event/1
        public async Task<ActionResult<EventDto>> GetEvent(int id)
        {
            var eventDto = await _eventRepository.GetEventAsync(id);
            if (eventDto == null) return NotFound();
            return eventDto; 
        }

        [Authorize]
        [HttpGet("created")]
        public async Task<ActionResult<IEnumerable<EventDto>>> GetEventsCreatedByUser()
        {
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized();
            var events = await _eventRepository.GetEventsCreatedByUserAsync(userId.Value);
            return Ok(events);
        }

        [Authorize]
        [HttpPut("{id}")] // api/event/1
        public async Task<ActionResult> UpdateEvent(int id, CreateEventDto dto)
        {
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized();
            var eventEntity = await _eventRepository.GetEventEntityByIdAsync(id);
            if (eventEntity == null) return NotFound();

            if (eventEntity.CreatorId != userId)
        {
            return Forbid("You are not authorized to update this event.");
        }
            var success = await _eventRepository.UpdateEventAsync(id, dto);

        if (!success)
        {
        return NotFound($"Event with ID {id} not found.");
        }

        return NoContent();
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<EventDto>> CreateEvent(CreateEventDto dto)
        {   
            var userId = GetUserIdFromToken();
            if (userId == null) return Unauthorized();
            var createdEvent = await _eventRepository.CreateEventAsync(dto, userId.Value);

        return CreatedAtAction(nameof(GetEvent), new { id = createdEvent.Id }, createdEvent);
        }

        [Authorize]
        [HttpDelete("{id}")] // api/event/1
        public async Task<ActionResult> DeleteEvent(int id)
        {
            var userId = GetUserIdFromToken();
        if (userId == null) return Unauthorized();

        var eventEntity = await _eventRepository.GetEventEntityByIdAsync(id);
        if (eventEntity == null) return NotFound();

        if (eventEntity.CreatorId != userId)
        {
            return Forbid("You are not authorized to delete this event.");
        }
        var success = await _eventRepository.DeleteEventAsync(id);

        if (!success)
        {
        return NotFound($"Event with ID {id} not found.");
        }

        return NoContent();
        }

        private int? GetUserIdFromToken()
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return null;
        return int.TryParse(userIdClaim.Value, out var userId) ? userId : null;
    }
    }
}
using API.Data;
using API.Dtos;
using API.models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

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

        [HttpPut("{id}")] // api/event/1
        public async Task<ActionResult> UpdateEvent(int id, CreateEventDto dto)
        {
        var success = await _eventRepository.UpdateEventAsync(id, dto);

        if (!success)
        {
        return NotFound($"Event with ID {id} not found.");
        }

        return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<EventDto>> CreateEvent(CreateEventDto dto)
        {   
        var createdEvent = await _eventRepository.CreateEventAsync(dto);

        return CreatedAtAction(nameof(GetEvent), new { id = createdEvent.Id }, createdEvent);
        }

        [HttpDelete("{id}")] // api/event/1
        public async Task<ActionResult> DeleteEvent(int id)
        {
        var success = await _eventRepository.DeleteEventAsync(id);

        if (!success)
        {
        return NotFound($"Event with ID {id} not found.");
        }

        return NoContent();
        }

    }
}

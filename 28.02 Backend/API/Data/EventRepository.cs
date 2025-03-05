using System;
using API.Dtos;
using API.models;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class EventRepository
{
    private readonly DataContext _context;
    public EventRepository (DataContext context) {
        _context = context;
    }

    public async Task<List<EventDto>> GetEventsAsync() 
    {

     var events = await _context.Events
        .Include(x => x.Creator)
        .Select(x => new EventDto
        {
            Id = x.Id,
            Title = x.Title,
            Description = x.Description,
            Rating = x.Rating,
            Date = x.Date,
            Capacity = x.Capacity,
            CreatorId = x.CreatorId,
            CreatorName = x.Creator.Username
        })
        .ToListAsync();

    return events;
    }

    public async Task<EventDto?> GetEventAsync(int id)
    {
        return await _context.Events
            .Where(x => x.Id == id)
            .Include(x => x.Creator)
            .Select(x => new EventDto
        {
            Id = x.Id,
            Title = x.Title,
            Description = x.Description,
            Rating = x.Rating,
            Date = x.Date,
            Capacity = x.Capacity,
            CreatorId = x.CreatorId,
            CreatorName = x.Creator.Username
        })
        .SingleOrDefaultAsync();
    }

    public async Task<EventDto> CreateEventAsync(CreateEventDto dto)
{
    var newEvent = new Event
    {
        Title = dto.Title,
        Description = dto.Description,
        Rating = dto.Rating,
        Date = dto.Date,
        Capacity = dto.Capacity,
        CreatorId = dto.CreatorId
    };

    _context.Events.Add(newEvent);
    await _context.SaveChangesAsync();

    var createdEvent = await _context.Events
        .Include(e => e.Creator)
        .Where(e => e.Id == newEvent.Id)
        .Select(e => new EventDto
        {
            Id = e.Id,
            Title = e.Title,
            Description = e.Description,
            Rating = e.Rating,
            Date = e.Date,
            Capacity = e.Capacity,
            CreatorId = e.CreatorId,
            CreatorName = e.Creator.Username
        })
        .SingleAsync();

    return createdEvent;
}

    public async Task<bool> UpdateEventAsync(int eventId, CreateEventDto dto)
{
    var existingEvent = await _context.Events.FindAsync(eventId);

    if (existingEvent == null)
    {
        return false; 
    }

    existingEvent.Title = dto.Title;
    existingEvent.Description = dto.Description;
    existingEvent.Rating = dto.Rating;
    existingEvent.Date = dto.Date;
    existingEvent.Capacity = dto.Capacity;

    await _context.SaveChangesAsync();
    return true;
}

    public async Task<bool> DeleteEventAsync(int eventId)
    {
    var existingEvent = await _context.Events.FindAsync(eventId);

    if (existingEvent == null)
    {
        return false; 
    }

    _context.Events.Remove(existingEvent);
    await _context.SaveChangesAsync();

    return true;
    }
}

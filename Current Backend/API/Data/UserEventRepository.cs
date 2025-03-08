using System;
using API.Dtos;
using API.models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class UserEventRepository
{
    private readonly DataContext _context;
    public UserEventRepository (DataContext context) {
        _context = context;
    }

    public async Task<List<EventDto>> GetJoinedEventsAsync(int userId)
    {
        return await _context.UserEvents
        .Where(x => x.UserId == userId)
        .Include(x => x.Event)
        .ThenInclude(y => y.Creator)
        .Select(x => new EventDto
        {
            Id = x.Event.Id,
            Title = x.Event.Title,
            Description = x.Event.Description,
            Rating = x.Event.Rating,
            Date = x.Event.Date,
            StartTime = x.Event.StartTime,
            EndTime = x.Event.EndTime,
            Location = x.Event.Location,
            Capacity = x.Event.Capacity,
            CreatorId = x.Event.CreatorId,
            CreatorName = x.Event.Creator != null ? x.Event.Creator.Username : "Unknown"
        })
        .ToListAsync();
    }

    public async Task<bool> JoinEventAsync(int userId, int eventId)
        {
            // Check if event exists
            var eventEntity = await _context.Events.FindAsync(eventId);
            if (eventEntity == null) return false;

            // Check capacity
            if (eventEntity.Capacity <= 0)
            {
                // Capacity full, cannot join
                return false;
            }

            // Check if already joined
            var alreadyJoined = await _context.UserEvents
                .AnyAsync(ue => ue.UserId == userId && ue.EventId == eventId);
            if (alreadyJoined) return false;

            // Add user to event
            var userEvent = new models.UserEvent
            {
                UserId = userId,
                EventId = eventId
            };

            _context.UserEvents.Add(userEvent);

            // Decrease event capacity
            eventEntity.Capacity -= 1;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> LeaveEventAsync(int userId, int eventId)
        {
            var userEvent = await _context.UserEvents
                .FirstOrDefaultAsync(ue => ue.UserId == userId && ue.EventId == eventId);

            if (userEvent == null) return false;

            // Remove user from event
            _context.UserEvents.Remove(userEvent);

            // Increase event capacity
            var eventEntity = await _context.Events.FindAsync(eventId);
            if (eventEntity != null)
            {
                eventEntity.Capacity += 1;
            }

            await _context.SaveChangesAsync();
            return true;
        }

}

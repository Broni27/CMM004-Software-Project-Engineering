using System;
using Microsoft.CodeAnalysis;

namespace API.Dtos;

public class CreateEventDto
{
    public required string Title { get; set; }
    public required string Description { get; set; }
    public int? Rating { get ;set; }
    public DateOnly Date { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public required string Location { get; set; }
    public int Capacity { get; set; }
    public int CreatorId { get; set; } 

}

using System;

namespace API.Dtos;

public class CreateEventDto
{
    public required string Title { get; set; }
    public required string Description { get; set; }
    public int? Rating { get ;set; }
    public DateTime Date { get; set; }
    public int Capacity { get; set; }
    public int CreatorId { get; set; } 

}

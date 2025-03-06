namespace API.models;

public class Event
{
    public int Id {get; set;}
    public required string Title {get; set;}
    public required string Description {get; set;}
    public int? Rating {get; set;}
    public DateTime Date {get; set;}
    public int Capacity {get; set;}

    //Foreign key for Event Creator
    public int CreatorId {get; set;}
    public User Creator {get; set;} = null!;

    public ICollection<UserEvent>? Participants {get; set;}//Many-to-Many with UserEvent 
}
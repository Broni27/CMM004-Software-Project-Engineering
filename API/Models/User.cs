public class User 
{
    public int Id {get; set;}
    public required string Username {get; set;}
    public required string Email {get; set;}
    public required string Realname {get; set;}
    public required string Password {get; set;}
    public Role Role {get; set;}

    public ICollection<Event> CreatedEvents {get; set;} = null!; //Events the user created
    public ICollection<UserEvent> JoinedEvents {get; set;} = null!; //Many-to-Many with UserEvent class
}
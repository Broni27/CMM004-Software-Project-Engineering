namespace API.models;

public class User 
{
    public int Id {get; set;}
    public required string Username {get; set;}
    public required string Email {get; set;}
    public required string Realname {get; set;}
    public required byte[] PasswordHash { get; set; }
    public required byte[] PasswordSalt { get; set; }
    public Role Role {get; set;}

    public ICollection<Event>? CreatedEvents {get; set;}  //Events the user created
    public ICollection<UserEvent>? JoinedEvents {get; set;}  //Many-to-Many with UserEvent class
}
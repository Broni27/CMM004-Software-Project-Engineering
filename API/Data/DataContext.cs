using Microsoft.EntityFrameworkCore;
using API.models;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {

    }
    public DbSet<User> Users {get; set;}
    public DbSet<Event> Events {get; set;}
    public DbSet<UserEvent> UserEvents {get; set;}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserEvent>()
            .HasKey(ue => new { ue.UserId, ue.EventId }); // Composite Primary Key

        modelBuilder.Entity<UserEvent>()
            .HasOne(ue => ue.User)
            .WithMany(u => u.JoinedEvents)
            .HasForeignKey(ue => ue.UserId);
            //.OnDelete(DeleteBehavior.Restrict); // Prevent cascading delete


        modelBuilder.Entity<UserEvent>()
            .HasOne(ue => ue.Event)
            .WithMany(e => e.Participants)
            .HasForeignKey(ue => ue.EventId);
            //.OnDelete(DeleteBehavior.Restrict); // Prevent cascading delete
        
            // One-to-Many: User -> Created Events
        modelBuilder.Entity<Event>()
        .HasOne(e => e.Creator) // Each event has one creator
        .WithMany(u => u.CreatedEvents) // A user can create many events
        .HasForeignKey(e => e.CreatorId); // Foreign Key in Event table
    }
}
using Microsoft.EntityFrameworkCore;

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

        modelBuilder.Entity<UserEvent>()
            .HasOne(ue => ue.Event)
            .WithMany(e => e.Participants)
            .HasForeignKey(ue => ue.EventId);
    }
}
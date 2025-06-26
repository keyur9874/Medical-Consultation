using Microsoft.EntityFrameworkCore;
using MedicalConsultation.Model.Entities;

namespace MedicalConsultation.Repository.Data;

public class MedicalConsultationContext : DbContext
{
    public MedicalConsultationContext(DbContextOptions<MedicalConsultationContext> options)
        : base(options)
    {
    }

    public DbSet<Patient> Patients { get; set; }
    public DbSet<Consultation> Consultations { get; set; }
    public DbSet<ConsultationAttachment> ConsultationAttachments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Patient configuration
        modelBuilder.Entity<Patient>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasDefaultValueSql("NEWID()");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.Phone).IsUnique();
        });

        // Consultation configuration
        modelBuilder.Entity<Consultation>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasDefaultValueSql("NEWID()");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

            entity.HasOne(e => e.Patient)
                  .WithMany(p => p.Consultations)
                  .HasForeignKey(e => e.PatientId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ConsultationAttachment configuration
        modelBuilder.Entity<ConsultationAttachment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasDefaultValueSql("NEWID()");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

            entity.HasOne(e => e.Consultation)
                  .WithMany(c => c.Attachments)
                  .HasForeignKey(e => e.ConsultationId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Seed data
        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        var patient1Id = Guid.NewGuid();
        var patient2Id = Guid.NewGuid();
        var patient3Id = Guid.NewGuid();

        modelBuilder.Entity<Patient>().HasData(
            new Patient
            {
                Id = patient1Id,
                Name = "John Smith",
                Age = 35,
                Gender = "Male",
                Phone = "+1-555-0123",
                Email = "john.smith@email.com",
                Address = "123 Main St, New York, NY 10001",
                EmergencyContact = "Jane Smith - +1-555-0124",
                CreatedAt = DateTime.UtcNow
            },
            new Patient
            {
                Id = patient2Id,
                Name = "Maria Garcia",
                Age = 28,
                Gender = "Female",
                Phone = "+1-555-0125",
                Email = "maria.garcia@email.com",
                Address = "456 Oak Ave, Los Angeles, CA 90001",
                EmergencyContact = "Carlos Garcia - +1-555-0126",
                CreatedAt = DateTime.UtcNow
            },
            new Patient
            {
                Id = patient3Id,
                Name = "David Johnson",
                Age = 42,
                Gender = "Male",
                Phone = "+1-555-0127",
                Email = "david.johnson@email.com",
                Address = "789 Pine St, Chicago, IL 60601",
                EmergencyContact = "Sarah Johnson - +1-555-0128",
                CreatedAt = DateTime.UtcNow
            }
        );

        modelBuilder.Entity<Consultation>().HasData(
            new Consultation
            {
                Id = Guid.NewGuid(),
                PatientId = patient1Id,
                Date = DateTime.Today.AddDays(5),
                Time = "10:00",
                Status = "Pending",
                Notes = "Regular checkup and blood pressure monitoring",
                CreatedAt = DateTime.UtcNow
            },
            new Consultation
            {
                Id = Guid.NewGuid(),
                PatientId = patient2Id,
                Date = DateTime.Today.AddDays(-1),
                Time = "14:30",
                Status = "Completed",
                Notes = "Follow-up appointment for diabetes management",
                CreatedAt = DateTime.UtcNow
            }
        );
    }
}
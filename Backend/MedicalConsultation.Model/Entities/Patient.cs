using System.ComponentModel.DataAnnotations;

namespace MedicalConsultation.Model.Entities;

public class Patient
{
    public Guid Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Range(1, 120)]
    public int Age { get; set; }

    [Required]
    [MaxLength(10)]
    public string Gender { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Phone { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string Address { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string EmergencyContact { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    public virtual ICollection<Consultation> Consultations { get; set; } = new List<Consultation>();
}
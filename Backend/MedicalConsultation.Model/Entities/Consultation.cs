using System.ComponentModel.DataAnnotations;

namespace MedicalConsultation.Model.Entities;

public class Consultation
{
    public Guid Id { get; set; }

    [Required]
    public Guid PatientId { get; set; }

    [Required]
    public DateTime Date { get; set; }

    [Required]
    [MaxLength(5)]
    public string Time { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = "Pending";

    [Required]
    [MaxLength(1000)]
    public string Notes { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public virtual Patient Patient { get; set; } = null!;
    public virtual ICollection<ConsultationAttachment> Attachments { get; set; } = new List<ConsultationAttachment>();
}
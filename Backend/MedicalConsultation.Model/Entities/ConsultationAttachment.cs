using System.ComponentModel.DataAnnotations;

namespace MedicalConsultation.Model.Entities;

public class ConsultationAttachment
{
    public Guid Id { get; set; }

    [Required]
    public Guid ConsultationId { get; set; }

    [Required]
    [MaxLength(255)]
    public string FileName { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string FilePath { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string ContentType { get; set; } = string.Empty;

    public long FileSize { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Consultation Consultation { get; set; } = null!;
}
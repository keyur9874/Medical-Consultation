using Microsoft.AspNetCore.Http;

namespace MedicalConsultation.Model.DTOs;

public class ConsultationDto
{
    public Guid Id { get; set; }
    public Guid PatientId { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public List<AttachmentDto> Attachments { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

public class CreateConsultationDto
{
    public Guid PatientId { get; set; }
    public string Date { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public List<IFormFile>? Attachments { get; set; }
}

public class UpdateConsultationStatusDto
{
    public string Status { get; set; } = string.Empty;
}

public class AttachmentDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public long Size { get; set; }
}
using AutoMapper;
using MedicalConsultation.Model.DTOs;
using MedicalConsultation.Model.Entities;

namespace MedicalConsultation.Service.Profiles;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Patient mappings
        CreateMap<Patient, PatientDto>();
        CreateMap<CreatePatientDto, Patient>();
        CreateMap<UpdatePatientDto, Patient>();

        // Consultation mappings
        CreateMap<Consultation, ConsultationDto>()
            .ForMember(dest => dest.PatientName, opt => opt.MapFrom(src => src.Patient.Name))
            .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.Date.ToString("yyyy-MM-dd")))
            .ForMember(dest => dest.Attachments, opt => opt.MapFrom(src => src.Attachments));

        CreateMap<CreateConsultationDto, Consultation>()
            .ForMember(dest => dest.Date, opt => opt.Ignore()) // Handle manually in controller
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => "Pending"));

        // Attachment mappings
        CreateMap<ConsultationAttachment, AttachmentDto>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.FileName))
            .ForMember(dest => dest.Url, opt => opt.MapFrom(src => src.FilePath))
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.ContentType))
            .ForMember(dest => dest.Size, opt => opt.MapFrom(src => src.FileSize));
    }
}
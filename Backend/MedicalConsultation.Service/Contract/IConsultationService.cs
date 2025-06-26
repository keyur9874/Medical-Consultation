using MedicalConsultation.Model.DTOs;
using MedicalConsultation.Model.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedicalConsultation.Service.Contract
{
    public interface IConsultationService
    {
        Task<IEnumerable<ConsultationDto>> GetConsultations();
        Task<ConsultationDto?> GetByIdAsync(Guid id);
        Task<IEnumerable<ConsultationDto>> GetConsultationsByPatient(Guid patientId);
        Task<ConsultationDto> CreateConsultation(CreateConsultationDto createConsultationDto);
        Task<ConsultationDto> UpdateAsync(ConsultationDto consultation);
        Task<bool> DeleteConsultation(Guid id);
    }
}

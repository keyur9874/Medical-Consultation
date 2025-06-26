using MedicalConsultation.Model.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedicalConsultation.Service.Contract
{
    public interface IPatientService
    {
        Task<IEnumerable<PatientDto>> GetAllAsync();
        Task<PatientDto?> GetByIdAsync(Guid id);
        Task<PatientDto> CreatePatientAsync(CreatePatientDto createDto);
        Task<bool> UpdatePatientAsync(Guid id, UpdatePatientDto updateDto);
        Task<bool> DeletePatientAsync(Guid id);
    }
}

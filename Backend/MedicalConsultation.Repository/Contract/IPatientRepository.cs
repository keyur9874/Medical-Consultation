using MedicalConsultation.Model.Entities;

namespace MedicalConsultation.Repository.Contract;

public interface IPatientRepository
{
    Task<IEnumerable<Patient>> GetAllAsync();
    Task<Patient?> GetByIdAsync(Guid id);
    Task<Patient> CreateAsync(Patient patient);
    Task<Patient> UpdateAsync(Patient patient);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
}
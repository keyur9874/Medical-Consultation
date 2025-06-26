using MedicalConsultation.Model.Entities;

namespace MedicalConsultation.Repository.Contract;

public interface IConsultationRepository
{
    Task<IEnumerable<Consultation>> GetAllAsync();
    Task<Consultation?> GetByIdAsync(Guid id);
    Task<IEnumerable<Consultation>> GetByPatientIdAsync(Guid patientId);
    Task<Consultation> CreateAsync(Consultation consultation);
    Task<Consultation> UpdateAsync(Consultation consultation);
    Task<bool> DeleteAsync(Guid id);
}
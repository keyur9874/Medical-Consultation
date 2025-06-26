using Microsoft.EntityFrameworkCore;
using MedicalConsultation.Repository.Contract;
using MedicalConsultation.Repository.Data;
using MedicalConsultation.Model.Entities;

namespace MedicalConsultation.Repository.Repository;

public class PatientRepository : IPatientRepository
{
    private readonly MedicalConsultationContext _context;

    public PatientRepository(MedicalConsultationContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Patient>> GetAllAsync()
    {
        return await _context.Patients
            .OrderBy(p => p.Name)
            .ToListAsync();
    }

    public async Task<Patient?> GetByIdAsync(Guid id)
    {
        return await _context.Patients
            .Include(p => p.Consultations)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<Patient> CreateAsync(Patient patient)
    {
        patient.Id = Guid.NewGuid();
        patient.CreatedAt = DateTime.UtcNow;

        _context.Patients.Add(patient);
        await _context.SaveChangesAsync();
        return patient;
    }

    public async Task<Patient> UpdateAsync(Patient patient)
    {
        patient.UpdatedAt = DateTime.UtcNow;
        _context.Entry(patient).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return patient;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var patient = await _context.Patients.FindAsync(id);
        if (patient == null)
            return false;

        _context.Patients.Remove(patient);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Patients.AnyAsync(p => p.Id == id);
    }
}
using Microsoft.EntityFrameworkCore;
using MedicalConsultation.Model.Entities;
using MedicalConsultation.Repository.Contract;
using MedicalConsultation.Repository.Data;

namespace MedicalConsultation.Repository.Repository;

public class ConsultationRepository : IConsultationRepository
{
    private readonly MedicalConsultationContext _context;

    public ConsultationRepository(MedicalConsultationContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Consultation>> GetAllAsync()
    {
        return await _context.Consultations
            .Include(c => c.Patient)
            .Include(c => c.Attachments)
            .OrderByDescending(c => c.Date)
            .ThenBy(c => c.Time)
            .ToListAsync();
    }

    public async Task<Consultation?> GetByIdAsync(Guid id)
    {
        return await _context.Consultations
            .Include(c => c.Patient)
            .Include(c => c.Attachments)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<IEnumerable<Consultation>> GetByPatientIdAsync(Guid patientId)
    {
        return await _context.Consultations
            .Include(c => c.Patient)
            .Include(c => c.Attachments)
            .Where(c => c.PatientId == patientId)
            .OrderByDescending(c => c.Date)
            .ThenBy(c => c.Time)
            .ToListAsync();
    }

    public async Task<Consultation> CreateAsync(Consultation consultation)
    {
        consultation.Id = Guid.NewGuid();
        consultation.CreatedAt = DateTime.UtcNow;

        _context.Consultations.Add(consultation);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(consultation.Id) ?? consultation;
    }

    public async Task<Consultation> UpdateAsync(Consultation consultation)
    {
        consultation.UpdatedAt = DateTime.UtcNow;
        _context.Entry(consultation).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return await GetByIdAsync(consultation.Id) ?? consultation;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var consultation = await _context.Consultations.FindAsync(id);
        if (consultation == null)
            return false;

        _context.Consultations.Remove(consultation);
        await _context.SaveChangesAsync();
        return true;
    }
}
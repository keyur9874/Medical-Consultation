using AutoMapper;
using MedicalConsultation.Model.DTOs;
using MedicalConsultation.Model.Entities;
using MedicalConsultation.Repository.Contract;
using MedicalConsultation.Service.Contract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedicalConsultation.Service.Service
{
    public class PatientService(
        IPatientRepository _patientRepository,
        IMapper _mapper
        ) : IPatientService
    {

        public async Task<IEnumerable<PatientDto>> GetAllAsync()
        {
            var patients = await _patientRepository.GetAllAsync();
            var patientDtos = _mapper.Map<IEnumerable<PatientDto>>(patients);
            return patientDtos;
        }

        public async Task<PatientDto?> GetByIdAsync(Guid id)
        {
            var patient = await _patientRepository.GetByIdAsync(id);
            if (patient == null) return null;

            return _mapper.Map<PatientDto>(patient);
        }

        public async Task<PatientDto> CreatePatientAsync(CreatePatientDto createDto)
        {
            var patient = _mapper.Map<Patient>(createDto);
            var created = await _patientRepository.CreateAsync(patient);
            return _mapper.Map<PatientDto>(created);
        }

        public async Task<bool> UpdatePatientAsync(Guid id, UpdatePatientDto updateDto)
        {
            var existing = await _patientRepository.GetByIdAsync(id);
            if (existing == null) return false;

            _mapper.Map(updateDto, existing);
            await _patientRepository.UpdateAsync(existing);
            return true;
        }

        public async Task<bool> DeletePatientAsync(Guid id)
        {
            return await _patientRepository.DeleteAsync(id);
        }
    }
}

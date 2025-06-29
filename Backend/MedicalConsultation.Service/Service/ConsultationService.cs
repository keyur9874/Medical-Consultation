using AutoMapper;
using MedicalConsultation.Model.DTOs;
using MedicalConsultation.Model.Entities;
using MedicalConsultation.Repository.Contract;
using MedicalConsultation.Repository.Repository;
using MedicalConsultation.Service.Contract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedicalConsultation.Service.Service
{
    public class ConsultationService(
        IConsultationRepository _consultationRepository, 
        IPatientRepository _patientRepository,
        IFileService _fileService,
        IMapper _mapper) : IConsultationService
    {

        public  async Task<IEnumerable<ConsultationDto>> GetConsultations()
        {
            var consultations = await _consultationRepository.GetAllAsync();
            var consultationDtos = _mapper.Map<IEnumerable<ConsultationDto>>(consultations);
            return consultationDtos;
        }

        public async Task<ConsultationDto?> GetByIdAsync(Guid id)
        {
            var consultation = await _consultationRepository.GetByIdAsync(id);
            if (consultation == null)
            {
                return null;
            }

            var consultationDto = _mapper.Map<ConsultationDto>(consultation);
            return consultationDto;
        }

        public async Task<IEnumerable<ConsultationDto>> GetConsultationsByPatient(Guid patientId)
        {
            var consultations = await _consultationRepository.GetByPatientIdAsync(patientId);
            var consultationDtos = _mapper.Map<IEnumerable<ConsultationDto>>(consultations);
            return consultationDtos;
        }

        public async Task<ConsultationDto> CreateConsultation(CreateConsultationDto createDto)
        {
            // Validate patient
            var patientExists = await _patientRepository.ExistsAsync(createDto.PatientId);
            if (!patientExists)
                throw new ArgumentException("Patient not found");

            // Map basic data
            var consultation = _mapper.Map<Consultation>(createDto);

            // Validate date
            if (!DateTime.TryParse(createDto.Date, out var parsedDate))
                throw new ArgumentException("Invalid date format");

            consultation.Date = parsedDate;

            // Save consultation
            var createdConsultation = await _consultationRepository.CreateAsync(consultation);

            // Handle file attachments
            if (createDto.Attachments != null && createDto.Attachments.Any())
            {
                var attachments = new List<ConsultationAttachment>();

                foreach (var file in createDto.Attachments)
                {
                    try
                    {
                        var filePath = await _fileService.SaveFileAsync(file, "consultations");

                        attachments.Add(new ConsultationAttachment
                        {
                            ConsultationId = createdConsultation.Id,
                            FileName = file.FileName,
                            FilePath = filePath,
                            ContentType = file.ContentType,
                            FileSize = file.Length,
                            CreatedAt = DateTime.UtcNow
                        });
                    }
                    catch
                    {
                        // Log and skip invalid files
                        continue;
                    }
                }

                if (attachments.Any())
                {
                    createdConsultation.Attachments = attachments;
                    await _consultationRepository.UpdateAsync(createdConsultation); // or call a dedicated `AddAttachmentsAsync` method
                }
            }

            return _mapper.Map<ConsultationDto>(createdConsultation);
        }


        //public async Task<ConsultationDto> UpdateAsync(ConsultationDto consultationDtos)
        //{
        //    var consultations = _mapper.Map<Consultation>(consultationDtos);
        //    var updatedConsultations = await _consultationRepository.UpdateAsync(consultations);

        //    var updatedConsultationDto = _mapper.Map<ConsultationDto>(updatedConsultations);
        //    return updatedConsultationDto;
        //}

        public async Task<UpdateStatusResult> UpdateStatusAsync(Guid id, string newStatus)
        {
            var consultation = await _consultationRepository.GetByIdAsync(id);
            if (consultation == null)
                return UpdateStatusResult.NotFound;

            var validStatuses = new[] { "Pending", "Completed", "Canceled" };
            if (!validStatuses.Contains(newStatus))
                return UpdateStatusResult.InvalidStatus;

            consultation.Status = newStatus;
            await _consultationRepository.UpdateAsync(consultation);
            return UpdateStatusResult.Success;
        }

        public Task<bool> DeleteConsultation(Guid id)
        {
            return _consultationRepository.DeleteAsync(id);
        }
    }
}

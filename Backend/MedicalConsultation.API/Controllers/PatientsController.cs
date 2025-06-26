using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MedicalConsultation.Model.DTOs;
using MedicalConsultation.Model.Entities;
using MedicalConsultation.Repository.Contract;
using MedicalConsultation.Service.Contract;

namespace MedicalConsultation.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PatientsController : ControllerBase
{
    private readonly IPatientService _patientService;

    public PatientsController(IPatientService patientService)
    {
        _patientService = patientService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PatientDto>>> GetPatients()
    {
        var patientDtos = await _patientService.GetAllAsync();
        return Ok(patientDtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PatientDto>> GetPatient(Guid id)
    {
        var patientDto = await _patientService.GetByIdAsync(id);
        if (patientDto == null)
        {
            return NotFound();
        }

        return Ok(patientDto);
    }

    [HttpPost]
    public async Task<ActionResult<PatientDto>> CreatePatient(CreatePatientDto createPatientDto)
    {
        var patientDto = await _patientService.CreatePatientAsync(createPatientDto);
        return CreatedAtAction(nameof(GetPatient), new { id = patientDto.Id }, patientDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePatient(Guid id, UpdatePatientDto updatePatientDto)
    {
        var updated = await _patientService.UpdatePatientAsync(id, updatePatientDto);
        if (!updated)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePatient(Guid id)
    {
        var deleted = await _patientService.DeletePatientAsync(id);
        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }

}
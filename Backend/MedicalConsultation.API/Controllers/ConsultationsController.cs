using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MedicalConsultation.Model.DTOs;
using MedicalConsultation.Service.Contract;

namespace MedicalConsultation.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ConsultationsController : ControllerBase
{
    private readonly IConsultationService _consultationService;

    public ConsultationsController(IConsultationService consultationService)
    {
        _consultationService = consultationService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ConsultationDto>>> GetConsultations()
    {
        var consultationDtos = await _consultationService.GetConsultations();
        return Ok(consultationDtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ConsultationDto>> GetConsultation(Guid id)
    {
        var consultationDto = await _consultationService.GetByIdAsync(id);
        if (consultationDto == null)
        {
            return NotFound();
        }

        return Ok(consultationDto);
    }

    [HttpGet("patient/{patientId}")]
    public async Task<ActionResult<IEnumerable<ConsultationDto>>> GetConsultationsByPatient(Guid patientId)
    {
        var consultationDtos = await _consultationService.GetConsultationsByPatient(patientId);
        return Ok(consultationDtos);
    }

    [HttpPost]
    public async Task<ActionResult<ConsultationDto>> CreateConsultation([FromForm] CreateConsultationDto createConsultationDto)
    {
        try
        {
            var consultationDto = await _consultationService.CreateConsultation(createConsultationDto);
            return CreatedAtAction(nameof(GetConsultation), new { id = consultationDto.Id }, consultationDto);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            // Optional: log exception
            return StatusCode(500, "An error occurred while creating the consultation.");
        }
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateConsultationStatus(Guid id, UpdateConsultationStatusDto updateStatusDto)
    {
        var consultation = await _consultationService.GetByIdAsync(id);
        if (consultation == null)
        {
            return NotFound();
        }

        var validStatuses = new[] { "Pending", "Completed", "Canceled" };
        if (!validStatuses.Contains(updateStatusDto.Status))
        {
            return BadRequest("Invalid status");
        }

        consultation.Status = updateStatusDto.Status;
        await _consultationService.UpdateAsync(consultation);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteConsultation(Guid id)
    {
        var deleted = await _consultationService.DeleteConsultation(id);
        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}
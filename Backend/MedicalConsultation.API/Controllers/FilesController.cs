using Microsoft.AspNetCore.Mvc;
using MedicalConsultation.Service.Contract;

namespace MedicalConsultation.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FilesController : ControllerBase
{
    private readonly IBlobStorageService _blobStorageService;
    private readonly ILogger<FilesController> _logger;

    public FilesController(IBlobStorageService blobStorageService, ILogger<FilesController> logger)
    {
        _blobStorageService = blobStorageService;
        _logger = logger;
    }

    [HttpGet("download/{containerName}/{fileName}")]
    public async Task<IActionResult> DownloadFile(string containerName, string fileName)
    {
        try
        {
            var fileExists = await _blobStorageService.FileExistsAsync(containerName, fileName);
            if (!fileExists)
            {
                return NotFound("File not found");
            }

            var fileStream = await _blobStorageService.DownloadFileAsync(containerName, fileName);

            // Get content type based on file extension
            var contentType = GetContentType(fileName);

            return File(fileStream, contentType, fileName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error downloading file: {FileName} from container: {ContainerName}", fileName, containerName);
            return StatusCode(500, "Error downloading file");
        }
    }

    [HttpGet("url/{containerName}/{fileName}")]
    public IActionResult GetFileUrl(string containerName, string fileName)
    {
        try
        {
            var url = _blobStorageService.GetFileUrl(containerName, fileName);
            return Ok(new { url });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting file URL: {FileName} from container: {ContainerName}", fileName, containerName);
            return StatusCode(500, "Error getting file URL");
        }
    }

    private static string GetContentType(string fileName)
    {
        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        return extension switch
        {
            ".pdf" => "application/pdf",
            ".doc" => "application/msword",
            ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".gif" => "image/gif",
            ".txt" => "text/plain",
            _ => "application/octet-stream"
        };
    }
}
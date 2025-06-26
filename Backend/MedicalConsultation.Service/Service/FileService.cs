using MedicalConsultation.Service.Contract;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Linq;

namespace MedicalConsultation.Service.Service;

public class FileService : IFileService
{
    private readonly IBlobStorageService _blobStorageService;
    private readonly IConfiguration _configuration;
    private readonly ILogger<FileService> _logger;
    private const string ConsultationContainer = "consultation-attachments";

    public FileService(
        IBlobStorageService blobStorageService,
        IConfiguration configuration,
        ILogger<FileService> logger)
    {
        _blobStorageService = blobStorageService;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<string> SaveFileAsync(IFormFile file, string folder)
    {
        try
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is empty");

            // Validate file size (10MB limit)
            const long maxFileSize = 10 * 1024 * 1024; // 10MB
            if (file.Length > maxFileSize)
                throw new ArgumentException("File size exceeds 10MB limit");

            // Validate file type (basic validation)
            var allowedExtensions = new[] { ".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".gif", ".txt" };
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(fileExtension))
                throw new ArgumentException($"File type {fileExtension} is not allowed");

            // Generate unique filename with folder prefix
            var uniqueFileName = $"{folder}/{Guid.NewGuid()}_{file.FileName}";

            // Upload to Azure Blob Storage
            var blobFileName = await _blobStorageService.UploadFileAsync(file, ConsultationContainer, uniqueFileName);

            _logger.LogInformation("File saved successfully: {FileName}", blobFileName);

            return blobFileName;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving file: {FileName}", file?.FileName);
            throw;
        }
    }

    public async Task<bool> DeleteFileAsync(string filePath)
    {
        try
        {
            if (string.IsNullOrEmpty(filePath))
                return false;

            var result = await _blobStorageService.DeleteFileAsync(ConsultationContainer, filePath);

            if (result)
            {
                _logger.LogInformation("File deleted successfully: {FilePath}", filePath);
            }

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting file: {FilePath}", filePath);
            return false;
        }
    }

    public string GetFileUrl(string filePath)
    {
        if (string.IsNullOrEmpty(filePath))
            return string.Empty;

        return _blobStorageService.GetFileUrl(ConsultationContainer, filePath);
    }
}
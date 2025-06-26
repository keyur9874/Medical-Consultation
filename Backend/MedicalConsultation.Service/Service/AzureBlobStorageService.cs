using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using MedicalConsultation.Service.Contract;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace MedicalConsultation.Service.Service;

public class AzureBlobStorageService : IBlobStorageService
{
    private readonly BlobServiceClient _blobServiceClient;
    private readonly ILogger<AzureBlobStorageService> _logger;

    public AzureBlobStorageService(BlobServiceClient blobServiceClient, ILogger<AzureBlobStorageService> logger)
    {
        _blobServiceClient = blobServiceClient;
        _logger = logger;
    }

    public async Task<string> UploadFileAsync(IFormFile file, string containerName, string? fileName = null)
    {
        try
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is empty or null");

            // Create container if it doesn't exist
            var containerClient = await GetBlobContainerClientAsync(containerName);

            // Generate unique filename if not provided
            fileName ??= $"{Guid.NewGuid()}_{file.FileName}";

            // Ensure filename is safe for blob storage
            fileName = SanitizeFileName(fileName);

            var blobClient = containerClient.GetBlobClient(fileName);

            // Set content type
            var blobHttpHeaders = new BlobHttpHeaders
            {
                ContentType = file.ContentType
            };

            // Upload file
            using var stream = file.OpenReadStream();
            await blobClient.UploadAsync(stream, new BlobUploadOptions
            {
                HttpHeaders = blobHttpHeaders
            });

            _logger.LogInformation("File uploaded successfully: {FileName} to container: {ContainerName}", fileName, containerName);

            return fileName;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading file: {FileName} to container: {ContainerName}", fileName, containerName);
            throw;
        }
    }

    public async Task<bool> DeleteFileAsync(string containerName, string fileName)
    {
        try
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            var blobClient = containerClient.GetBlobClient(fileName);

            var response = await blobClient.DeleteIfExistsAsync();

            if (response.Value)
            {
                _logger.LogInformation("File deleted successfully: {FileName} from container: {ContainerName}", fileName, containerName);
            }

            return response.Value;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting file: {FileName} from container: {ContainerName}", fileName, containerName);
            return false;
        }
    }

    public async Task<Stream> DownloadFileAsync(string containerName, string fileName)
    {
        try
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            var blobClient = containerClient.GetBlobClient(fileName);

            var response = await blobClient.DownloadStreamingAsync();
            return response.Value.Content;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error downloading file: {FileName} from container: {ContainerName}", fileName, containerName);
            throw;
        }
    }

    public string GetFileUrl(string containerName, string fileName)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
        var blobClient = containerClient.GetBlobClient(fileName);
        return blobClient.Uri.ToString();
    }

    public async Task<bool> FileExistsAsync(string containerName, string fileName)
    {
        try
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            var blobClient = containerClient.GetBlobClient(fileName);

            var response = await blobClient.ExistsAsync();
            return response.Value;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking file existence: {FileName} in container: {ContainerName}", fileName, containerName);
            return false;
        }
    }

    private async Task<BlobContainerClient> GetBlobContainerClientAsync(string containerName)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);

        // Create container if it doesn't exist with public read access
        await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);

        return containerClient;
    }

    private static string SanitizeFileName(string fileName)
    {
        // Remove or replace invalid characters for blob storage
        var invalidChars = new char[] { '\\', '/', ':', '*', '?', '"', '<', '>', '|' };

        foreach (var invalidChar in invalidChars)
        {
            fileName = fileName.Replace(invalidChar, '_');
        }

        return fileName;
    }
}
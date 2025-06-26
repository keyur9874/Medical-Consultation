using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedicalConsultation.Service.Contract
{
    public interface IBlobStorageService
    {
        Task<string> UploadFileAsync(IFormFile file, string containerName, string? fileName = null);
        Task<bool> DeleteFileAsync(string containerName, string fileName);
        Task<Stream> DownloadFileAsync(string containerName, string fileName);
        string GetFileUrl(string containerName, string fileName);
        Task<bool> FileExistsAsync(string containerName, string fileName);
    }
}

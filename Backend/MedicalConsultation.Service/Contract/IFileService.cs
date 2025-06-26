using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MedicalConsultation.Service.Contract
{
    public interface IFileService
    {
        Task<string> SaveFileAsync(IFormFile file, string folder);
        Task<bool> DeleteFileAsync(string filePath);
        string GetFileUrl(string filePath);
    }
}

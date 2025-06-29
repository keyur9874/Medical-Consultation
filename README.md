# Medical-Consultation

<!-- # Medical Consultation Management System -->

A comprehensive full-stack application for managing medical consultations, built with React frontend and .NET 8 Web API backend. Features patient management, consultation scheduling, and secure file storage with Azure Blob Storage.

![Medical Consultation Management](https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## 🌟 Features

### 👥 Patient Management

- ✅ Add new patients with comprehensive details
- ✅ View and search patient records
- ✅ Update patient information
- ✅ Patient profile with contact and emergency details

### 📅 Consultation Management

- ✅ Schedule consultations for patients
- ✅ View all consultations with filtering options
- ✅ Update consultation status (Pending, Completed, Canceled)
- ✅ Add consultation notes and attachments
- ✅ File upload with Azure Blob Storage integration

### 📁 File Management

- ✅ Secure file upload to Azure Blob Storage
- ✅ Public access to consultation attachments
- ✅ Support for multiple file types (PDF, DOC, DOCX, Images)
- ✅ File size validation and type checking

### 🎨 Modern UI/UX

- ✅ Responsive design with Ant Design components
- ✅ Professional medical theme
- ✅ Intuitive navigation and user experience
- ✅ Real-time data updates

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Ant Design** - Professional UI components
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Vite** - Fast development server

### Backend

- **.NET 8** - Latest .NET framework
- **Entity Framework Core** - ORM for database operations
- **SQL Server** - Robust database solution
- **Azure Blob Storage** - Scalable file storage
- **AutoMapper** - Object mapping
- **FluentValidation** - Input validation
- **Swagger/OpenAPI** - API documentation

### Infrastructure

- **Azure Blob Storage** - Cloud file storage
- **SQL Server LocalDB** - Development database
- **CORS** - Cross-origin resource sharing

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- .NET 8 SDK
- SQL Server or SQL Server LocalDB
- Azure Storage Account (or Azure Storage Emulator for development)

### Frontend Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/medical-consultation-system.git
   cd medical-consultation-system/frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Access the application**
   ```
   http://localhost:5173
   ```

### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Update configuration**

   Edit `backend/MedicalConsultation.API/appsettings.json`:

   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=MedicalConsultationDB;Trusted_Connection=true;MultipleActiveResultSets=true"
     },
     "AzureStorage": {
       "ConnectionString": "YOUR_AZURE_STORAGE_CONNECTION_STRING"
     }
   }
   ```

3. **Restore packages**

   ```bash
   dotnet restore
   ```

4. **Run the API**

   ```bash
   cd MedicalConsultation.API
   dotnet run
   ```

5. **Access Swagger UI**
   ```
   https://localhost:7001/swagger
   ```

## 🔧 Configuration

### Azure Storage Setup

#### Development (Local Testing)

```json
{
  "AzureStorage": {
    "ConnectionString": "UseDevelopmentStorage=true"
  }
}
```

#### Production

```json
{
  "AzureStorage": {
    "ConnectionString": "DefaultEndpointsProtocol=https;AccountName=YOUR_STORAGE_ACCOUNT;AccountKey=YOUR_ACCOUNT_KEY;EndpointSuffix=core.windows.net"
  }
}
```

### Database Configuration

The application uses SQL Server with Entity Framework Core. The database is automatically created on first run with sample data.

## 📊 Database Schema

### Patients Table

- `Id` (uniqueidentifier, PK)
- `Name` (nvarchar(100))
- `Age` (int)
- `Gender` (nvarchar(10))
- `Phone` (nvarchar(20), unique)
- `Email` (nvarchar(100), unique)
- `Address` (nvarchar(500))
- `EmergencyContact` (nvarchar(200))
- `CreatedAt` (datetime2)
- `UpdatedAt` (datetime2, nullable)

### Consultations Table

- `Id` (uniqueidentifier, PK)
- `PatientId` (uniqueidentifier, FK)
- `Date` (datetime2)
- `Time` (nvarchar(5))
- `Status` (nvarchar(20))
- `Notes` (nvarchar(1000))
- `CreatedAt` (datetime2)
- `UpdatedAt` (datetime2, nullable)

### ConsultationAttachments Table

- `Id` (uniqueidentifier, PK)
- `ConsultationId` (uniqueidentifier, FK)
- `FileName` (nvarchar(255))
- `FilePath` (nvarchar(500))
- `ContentType` (nvarchar(100))
- `FileSize` (bigint)
- `CreatedAt` (datetime2)

## 🔌 API Endpoints

### Patients

- `GET /api/patients` - Get all patients
- `GET /api/patients/{id}` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/{id}` - Update patient
- `DELETE /api/patients/{id}` - Delete patient

### Consultations

- `GET /api/consultations` - Get all consultations
- `GET /api/consultations/{id}` - Get consultation by ID
- `GET /api/consultations/patient/{patientId}` - Get consultations by patient
- `POST /api/consultations` - Create new consultation (with file upload)
- `PATCH /api/consultations/{id}/status` - Update consultation status
- `DELETE /api/consultations/{id}` - Delete consultation

### Files

- `GET /api/files/download/{containerName}/{fileName}` - Download file
- `GET /api/files/url/{containerName}/{fileName}` - Get file URL

## 📁 Project Structure

```
medical-consultation-system/
├── frontend/                     # React frontend
|   └── src/
│       ├── components/
│       │   ├── layout/              # Layout components
│       │   ├── patients/            # Patient management
│       │   └── consultations/       # Consultation management
│       ├── services/                # API services
│       ├── types/                   # TypeScript types
│       └── main.tsx                 # App entry point
├── backend/                     # .NET 8 Web API
│   ├── MedicalConsultation.API/        # Web API layer
│   ├── MedicalConsultation.Core/       # Domain layer
│   └── MedicalConsultation.Infrastructure/ # Data layer
└── README.md
```

## 🎯 Key Features Explained

### File Upload & Storage

- Files are uploaded to Azure Blob Storage with public access
- Unique naming prevents conflicts
- File validation ensures security
- Direct URL access for easy sharing

### Responsive Design

- Mobile-first approach
- Optimized for tablets and desktops
- Professional medical interface
- Accessible design patterns

### Data Validation

- Frontend validation with Ant Design
- Backend validation with FluentValidation
- Comprehensive error handling
- User-friendly error messages

## 🔒 Security Features

- Input validation on both frontend and backend
- File type and size restrictions
- SQL injection prevention with Entity Framework
- CORS configuration for secure cross-origin requests
- Secure file storage with Azure Blob Storage

## 🚀 Deployment

### Frontend Deployment

```bash
npm run build
# Deploy dist/ folder to your hosting service
```

### Backend Deployment

1. Update connection strings for production
2. Configure Azure Storage for production
3. Deploy to Azure App Service or IIS
4. Set up proper CORS origins

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Ant Design](https://ant.design/) for the beautiful UI components
- [Lucide React](https://lucide.dev/) for the icon library
- [Azure Blob Storage](https://azure.microsoft.com/services/storage/blobs/) for reliable file storage
- [.NET 8](https://dotnet.microsoft.com/) for the robust backend framework

## 📞 Support

If you have any questions or need help with setup, please open an issue in the GitHub repository.

---

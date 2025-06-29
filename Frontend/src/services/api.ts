import {
  Patient,
  Consultation,
  CreatePatientRequest,
  CreateConsultationRequest,
} from "../types";

const baseUrl = "https://keyur-web-app.azurewebsites.net/api";

class ApiService {
  async getPatients(): Promise<Patient[]> {
    const res = await fetch(`${baseUrl}/Patients`);
    if (!res.ok) throw new Error("Failed to fetch patients");
    return res.json();
  }

  async getPatientById(id: string): Promise<Patient | null> {
    const res = await fetch(`${baseUrl}/Patients/${id}`);
    if (!res.ok) return null;
    return res.json();
  }

  async createPatient(patientData: CreatePatientRequest): Promise<Patient> {
    const res = await fetch(`${baseUrl}/Patients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patientData),
    });
    if (!res.ok) throw new Error("Failed to create patient");
    return res.json();
  }

  async deletePatient(id: string): Promise<void> {
    const res = await fetch(`${baseUrl}/Patients/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete patient");
  }

  // Consultation APIs
  async getConsultations(): Promise<Consultation[]> {
    const res = await fetch(`${baseUrl}/Consultations`);
    if (!res.ok) throw new Error("Failed to fetch consultations");
    return res.json();
  }

  async getConsultationsByPatientId(
    patientId: string
  ): Promise<Consultation[]> {
    const res = await fetch(`${baseUrl}/Consultations/patient/${patientId}`);
    if (!res.ok) throw new Error("Failed to fetch consultations by patient");
    return res.json();
  }

  async createConsultation(
    data: CreateConsultationRequest
  ): Promise<Consultation> {
    const formData = new FormData();
    formData.append("PatientId", data.patientId);
    formData.append("Date", data.date);
    formData.append("Time", data.time);
    if (data.notes) formData.append("Notes", data.notes);
    if (data.attachments) {
      for (const file of data.attachments) {
        formData.append("Attachments", file);
      }
    }

    const res = await fetch(`${baseUrl}/Consultations`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to create consultation");
    return res.json();
  }

  async updateConsultationStatus(
    id: string,
    data: Consultation["status"]
  ): Promise<void> {
    const res = await fetch(`${baseUrl}/Consultations/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: data }),
    });
    debugger;
    if (!res.ok) throw new Error("Failed to update consultation status");
    return;
  }

  // --- Attachments/Files ---
  async downloadFile(containerName: string, fileName: string): Promise<Blob> {
    // GET /api/Files/download/{containerName}/{fileName}
    const res = await fetch(
      `${baseUrl}/Files/download/${encodeURIComponent(
        containerName
      )}/${encodeURIComponent(fileName)}`
    );
    if (!res.ok) {
      throw new Error("Failed to download file");
    }
    return await res.blob();
  }

  async getFileUrl(containerName: string, fileName: string): Promise<string> {
    // GET /api/Files/url/{containerName}/{fileName}
    const res = await fetch(
      `${baseUrl}/Files/url/${encodeURIComponent(
        containerName
      )}/${encodeURIComponent(fileName)}`
    );
    if (!res.ok) {
      throw new Error("Failed to get file URL");
    }
    // If your backend returns a URL in the response body as plain text:
    return await res.text();
    // If your backend returns `{ url: "..." }` as JSON, use:
    // const data = await res.json();
    // return data.url;
  }
}

export const apiService = new ApiService();

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  createdAt: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  status: "Pending" | "Completed" | "Canceled";
  notes: string;
  attachments: FileAttachment[];
  createdAt: string;
}

export interface FileAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface CreatePatientRequest {
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
}

export interface CreateConsultationRequest {
  patientId: string;
  date: string;
  time: string;
  notes: string;
  attachments?: File[];
}

import { Patient, Consultation, CreatePatientRequest, CreateConsultationRequest } from '../types';
import { mockPatients, mockConsultations } from './mockData';

// Mock API service - replace with actual API calls to .NET backend
class ApiService {
  private patients: Patient[] = [...mockPatients];
  private consultations: Consultation[] = [...mockConsultations];

  // Patient APIs
  async getPatients(): Promise<Patient[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.patients;
  }

  async getPatientById(id: string): Promise<Patient | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.patients.find(p => p.id === id) || null;
  }

  async createPatient(patientData: CreatePatientRequest): Promise<Patient> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newPatient: Patient = {
      id: Date.now().toString(),
      ...patientData,
      createdAt: new Date().toISOString(),
    };
    
    this.patients.push(newPatient);
    return newPatient;
  }

  // Consultation APIs
  async getConsultations(): Promise<Consultation[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.consultations;
  }

  async getConsultationsByPatientId(patientId: string): Promise<Consultation[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return this.consultations.filter(c => c.patientId === patientId);
  }

  async createConsultation(consultationData: CreateConsultationRequest): Promise<Consultation> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const patient = this.patients.find(p => p.id === consultationData.patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }

    const newConsultation: Consultation = {
      id: Date.now().toString(),
      patientId: consultationData.patientId,
      patientName: patient.name,
      date: consultationData.date,
      time: consultationData.time,
      status: 'Pending',
      notes: consultationData.notes,
      attachments: [], // In real implementation, handle file uploads
      createdAt: new Date().toISOString(),
    };
    
    this.consultations.push(newConsultation);
    return newConsultation;
  }

  async updateConsultationStatus(id: string, status: Consultation['status']): Promise<Consultation> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const consultation = this.consultations.find(c => c.id === id);
    if (!consultation) {
      throw new Error('Consultation not found');
    }
    
    consultation.status = status;
    return consultation;
  }
}

export const apiService = new ApiService();
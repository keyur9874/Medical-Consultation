import React, { useState } from "react";
import { ConfigProvider } from "antd";
import MainLayout from "./components/layout/MainLayout";
import PatientList from "./components/patients/PatientList";
import PatientForm from "./components/patients/PatientForm";
import ConsultationList from "./components/consultations/ConsultationList";
import ConsultationForm from "./components/consultations/ConsultationForm";
import { Patient } from "./types";

function App() {
  const [activeView, setActiveView] = useState("patients");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const handleMenuSelect = (key: string) => {
    setActiveView(key);
    if (key !== "schedule-consultation") {
      setSelectedPatient(null);
    }
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setActiveView("schedule-consultation");
  };

  const handlePatientAdded = () => {
    setActiveView("patients");
  };

  const handleConsultationScheduled = () => {
    setActiveView("consultations");
    setSelectedPatient(null);
  };

  const renderContent = () => {
    switch (activeView) {
      case "patients":
        return <PatientList onPatientSelect={handlePatientSelect} selectable />;
      case "add-patient":
        return <PatientForm onSuccess={handlePatientAdded} />;
      case "consultations":
        return <ConsultationList />;
      case "schedule-consultation":
        return (
          <ConsultationForm
            selectedPatient={selectedPatient}
            onSuccess={handleConsultationScheduled}
          />
        );
      default:
        return <PatientList />;
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1e3a8a",
          borderRadius: 8,
        },
      }}
    >
      <MainLayout selectedKey={activeView} onMenuSelect={handleMenuSelect}>
        {renderContent()}
      </MainLayout>
    </ConfigProvider>
  );
}

export default App;

// PatientDashboard.jsx
import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_AUTH_PATIENT = gql`
  query GetAuthPatient($id: ID!) {
    patient(id: $id) {
      id
      userName
      email
      motivationalTips
      vitalReports
      symptoms
    }
  }
`;

const GET_SYMPTOMS = gql`
  query GetSymptoms {
    symptoms {
      id
      name
      description
    }
  }
`;

const ADD_VITAL_REPORT = gql`
  mutation AddVitalReport(
    $patient: ID!
    $date: Date!
    $bodyTemp: Float!
    $heartRate: Float!
    $bloodPressure: Float!
    $respiratoryRate: Float!
  ) {
    addVitalReport(
      patient: $patient
      date: $date
      bodyTemp: $bodyTemp
      heartRate: $heartRate
      bloodPressure: $bloodPressure
      respiratoryRate: $respiratoryRate
    ) {
      id
    }
  }
`;

const SEND_EMERGENCY_ALERT = gql`
  mutation SendEmergencyAlert($patient: ID!, $date: Date!) {
    sendEmergencyAlert(patient: $patient, date: $date) {
      id
    }
  }
`;

const ASSIGN_SYMPTOM = gql`
  mutation AssignSymptom($patientId: ID!, $symptomId: ID!) {
    assignSympton(patientId: $patientId, symptomId: $symptomId) {
      id
    }
  }
`;

const PatientDashboard = ({ patientId }) => {
  const { data: patientData, refetch } = useQuery(GET_AUTH_PATIENT, {
    variables: { id: patientId },
  });

  const { data: symptomData } = useQuery(GET_SYMPTOMS);
  const [addVitalReport] = useMutation(ADD_VITAL_REPORT);
  const [sendEmergencyAlert] = useMutation(SEND_EMERGENCY_ALERT);
  const [assignSymptom] = useMutation(ASSIGN_SYMPTOM);

  const [vitals, setVitals] = useState({
    temperature: '',
    heartRate: '',
    bloodPressure: '',
    respiratoryRate: '',
  });

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  const handleChange = (e) => {
    setVitals({ ...vitals, [e.target.name]: e.target.value });
  };

  const handleSymptomToggle = async (id) => {
    const updated = selectedSymptoms.includes(id)
      ? selectedSymptoms.filter((s) => s !== id)
      : [...selectedSymptoms, id];

    setSelectedSymptoms(updated);

    try {
      if (!selectedSymptoms.includes(id)) {
        await assignSymptom({ variables: { patientId, symptomId: id } });
        alert('Symptom saved!');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save symptom.');
    }
  };

  const handleSubmitVitals = async (e) => {
    e.preventDefault();
    try {
      await addVitalReport({
        variables: {
          patient: patientId,
          date: new Date().toISOString(),
          bodyTemp: parseFloat(vitals.temperature),
          heartRate: parseFloat(vitals.heartRate),
          bloodPressure: parseFloat(vitals.bloodPressure),
          respiratoryRate: parseFloat(vitals.respiratoryRate),
        },
      });
      alert('Vitals submitted!');
      setVitals({ temperature: '', heartRate: '', bloodPressure: '', respiratoryRate: '' });
      await refetch();
    } catch (err) {
      console.error(err);
      alert('Error submitting vitals');
    }
  };

  const handleEmergency = async () => {
    try {
      await sendEmergencyAlert({
        variables: {
          patient: patientId,
          date: new Date().toISOString(),
        },
      });
      alert('Emergency alert sent!');
    } catch (err) {
      console.error(err);
      alert('Failed to send emergency alert');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <img src="/healthlogo.png" alt="Your Health Logo" className="w-12 h-12" />
        <h1 className="text-3xl font-bold text-blue-700">Your Health - Patient Dashboard</h1>
      </div>

      {/* Emergency */}
      <div className="bg-white shadow p-6 rounded mb-6">
        <h2 className="text-xl font-semibold mb-2">Emergency</h2>
        <button
          onClick={handleEmergency}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Send Emergency Alert
        </button>
      </div>

      {/* Vitals Form */}
      <div className="bg-white shadow p-6 rounded mb-6">
        <h2 className="text-xl font-semibold mb-2">Enter Daily Vitals</h2>
        <form onSubmit={handleSubmitVitals} className="grid grid-cols-2 gap-4">
          <input name="temperature" placeholder="Temperature (°C)" value={vitals.temperature} onChange={handleChange} className="border p-2 rounded" required />
          <input name="heartRate" placeholder="Heart Rate (bpm)" value={vitals.heartRate} onChange={handleChange} className="border p-2 rounded" required />
          <input name="bloodPressure" placeholder="Blood Pressure (e.g., 120/80)" value={vitals.bloodPressure} onChange={handleChange} className="border p-2 rounded" required />
          <input name="respiratoryRate" placeholder="Respiratory Rate (rpm)" value={vitals.respiratoryRate} onChange={handleChange} className="border p-2 rounded" required />
          <button type="submit" className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Submit
          </button>
        </form>
      </div>

      {/* Symptoms Checklist */}
      <div className="bg-white shadow p-6 rounded mb-6">
        <h2 className="text-xl font-semibold mb-2">Symptom Checklist</h2>
        <ul className="space-y-2">
          {symptomData?.symptoms.map((symptom) => (
            <li key={symptom.id}>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedSymptoms.includes(symptom.id)}
                  onChange={() => handleSymptomToggle(symptom.id)}
                />
                <span className="font-medium">{symptom.name}</span>
                <span className="text-sm text-gray-600">({symptom.description})</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Motivational Tips */}
      <div className="bg-white shadow p-6 rounded">
        <h2 className="text-xl font-semibold mb-2">Daily Motivational Tips</h2>
        {patientData?.patient?.motivationalTips?.length > 0 ? (
          <ul className="list-disc pl-6 space-y-1">
            {patientData.patient.motivationalTips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No tips yet.</p>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
